const User = require('../Model/UserdataSetCreation')
const Expense = require('../Model/expenseDataset')
const ForgotPasswordRequest = require('../Model/forgotPassword')
const { generateExpenseSummary } = require('../services/genaiService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('../util/database')
const genaiService = require('../services/genaiService');
const {Sequelize} = require('sequelize')
const { uploadCsvAndGetPresignedUrl }=require('../util/s3UploadCsv')
const {Op} = require('sequelize')

// mongoose connection

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const JWT_SECRET = process.env.JWT_SECRET || '987456321'

exports.register = async(req,res)=>{
     try{
          const {name,email,password,phn} = req.body
          console.log('Form data received:', {name,email,password,phn})
          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = await User.create({name,email,password: hashedPassword,phn})
          return res.status(201).send('Form submitted successfully')

     } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
               return res.status(409).send('Email already exists. Try another.');
          }
          console.error('Error occurred while submitting form:', error);
          res.status(500).send('Internal Server Error');
     }
}

exports.login = async(req, res) => {
     try {
          const { email, password } = req.body;

          const foundUser = await User.find({ where: { email } });
          if (foundUser) {
               
               bcrypt.compare(password, foundUser.password, (err, isMatch) => {
                    if (err) {
                         console.error('Error occurred while comparing passwords:', err);
                         return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }
                    
                    if (isMatch) {
                        
                         const token = jwt.sign(
                              { userId: foundUser.id, isPremiumUser: foundUser.isPremiumUser },
                              JWT_SECRET,
                              { expiresIn: '1d' }
                         );

                         return res.status(200).json({
                              success: true,
                              message: 'Login successful',
                              token: token,
                              isPremiumUser: foundUser.isPremiumUser
                         });
                    }
                    
                    return res.status(401).json({ success: false, message: 'Invalid email or password' });
               });
          } else {
               res.status(401).json({ success: false, message: 'Invalid email or password' });
          }
          
     } catch (error) {
          console.error('Error occurred during login:', error);
          res.status(500).send('Internal Server Error');
     }
}

exports.getAllUsers = async(req,res)=>{
     try{
          const users = await User.findAll()
          res.status(200).json(users)
     } catch (error) {
          console.error('Error occurred while fetching users:', error);
          res.status(500).send('Internal Server Error');
     }
}

exports.getCurrentUser = async (req, res) => {
     try {
          const user = await User.findByPk(req.user.id);
          if (!user) {
              return res.status(404).json({ message: 'User not found.' });
          }
          res.status(200).json({
               id: user.id,
               name: user.name,
               email: user.email,
               phn: user.phn,
               isPremiumUser: user.isPremiumUser,
               totalExpenses: user.totalExpenses || 0
          });
     } catch (error) {
          console.error('Error fetching current user:', error);
          res.status(500).send('Internal Server Error');
     }
}

exports.getExpenseSummary = async (req, res) => {
     try {
          const expenses = await Expense.findAll({ where: { userId: req.user.id } });
          if (!expenses.length) {
               return res.status(200).json({ summary: 'No expenses yet to summarize.' });
          }

          const summary = await generateExpenseSummary(expenses);
          res.status(200).json({ summary });
     } catch (error) {
          console.error('Error generating expense summary:', error?.response?.data || error);
          res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
     }
};

exports.getAllExpenses = async (req, res) => {
     try {
          const userId = req.user.id

          // Allow user-selected limit from query params, but keep safe defaults.
          const parsedLimit = parseInt(req.query.limit, 10);
          const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10

          const page = Math.max(1, parseInt(req.query.page, 10) || 1)
          const offset = (page - 1) * limit;

          const { count, rows: expenses } = await Expense.findAndCountAll({
               where: { userId },
               limit,
               offset,
               order: [['createdAt', 'DESC']]
          });

          const totalPages = Math.max(1, Math.ceil(count / limit));

          res.status(200).json({
               expenses,
               page,
               totalPages,
               total: count
          })
     } catch (error) {
          console.error('Error occurred while fetching expenses:', error);
          res.status(500).send('Internal Server Error')
     }
}

function escapeCsvValue(value) {

  if (value === null || value === undefined) return '';
    let stringVal = String(value);
    // Escape double quotes by doubling them up to comply with RFC 4180 CSV specifications
    if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n')) {
        return stringVal.replace(/"/g, '""');
    }
    return stringVal;
}

async function persistPremiumDownload({ userId }) {
  const PremiumLeader = require('../Model/premiumLeaders');

  const now = new Date();
  const iso = now.toISOString();

  const total = (await Expense.sum('amount', { where: { userId } })) || 0;

  const existing = await PremiumLeader.findOne({ where: { userId } });

  if (existing) {
    let historyArr = [];
    if (existing.expenseDownloadHistory) {
      try {
        historyArr = JSON.parse(existing.expenseDownloadHistory);
        if (!Array.isArray(historyArr)) historyArr = [];
      } catch {
        historyArr = [];
      }
    }

    historyArr.push(iso);

    await existing.update({
      lastExpenseDownloadAt: now,
      expenseDownloadCount: (existing.expenseDownloadCount || 0) + 1,
      expenseDownloadHistory: JSON.stringify(historyArr),
      totalExpenses: total,
    });
  } else {
    const user = await User.findByPk(userId);

    await PremiumLeader.create({
      name: user?.name || 'Unknown',
      totalExpenses: total,
      userId,
      lastExpenseDownloadAt: now,
      expenseDownloadCount: 1,
      expenseDownloadHistory: JSON.stringify([iso]),
    });
  }
}

function makeS3Key(prefix, userId) {
  return `${prefix}/user_${userId}_${Date.now()}`;
}
exports.downloadExpenses = async (req, res) => {
    try {
        // Check premium status if your application enforces it
        if (!req.user.isPremiumUser) {
            return res.status(401).json({ error: 'Unauthorized: Premium membership required.' });
        }

        const userId = req.user.id;
        const {rangeType , startDate, endDate}=req.query

        let whereClause = {userId}

        const now = new Date()
        let start = new Date()
        let end = new Date()

        if (rangeType === 'daily') {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            whereClause.createdAt = { [Op.between]: [start, end] };
        } 
        else if (rangeType === 'monthly') {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            whereClause.createdAt = { [Op.between]: [start, end] };
        } 
        else if (rangeType === 'yearly') {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            whereClause.createdAt = { [Op.between]: [start, end] };
        } 
        else if (rangeType === 'custom' && startDate && endDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            whereClause.createdAt = { [Op.between]: [start, end] };
        }
        // Fetch rows
        const expenses = await Expense.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        if (expenses.length === 0) {
            return res.status(404).json({ error: 'No data records found for the selected date range filter.' });
        }

        // Structure CSV
        const header = 'Date,Description,Category,Income,Expense\n';
        const rows = expenses
          .map(exp => {
               
               const dateObj = exp.createdAt ? new Date(exp.createdAt) : new Date();

               const dateString = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
               const cleanedDesc = escapeCsvValue(exp.description);
               const cleanedCategory = escapeCsvValue(exp.category || 'General');

               const isIncome = exp.type && exp.type.toUpperCase() === 'INCOME';
               const incomeVal = isIncome ? exp.amount : 0;
               const expenseVal = !isIncome ? exp.amount : 0;
               return `${dateString},"${cleanedDesc}","${cleanedCategory}",${incomeVal},${expenseVal}`;
          })
          .join('\n');
          
        const csv = header + rows;
        const csvFilename = `expenses_user_${userId}_${Date.now()}.csv`;
        const key = `expenses/user_${userId}/${csvFilename}`;

        // Send to our updated S3 utility function
        const url = await uploadCsvAndGetPresignedUrl({
            key,
            csv,
            contentType: 'text/csv',
        });

        // Respond back to frontend Axios
        return res.status(200).json({ success: true, url, filename: csvFilename });
        
    } catch (error) {
        console.error('CRITICAL FAULT IN DOWNLOAD CONTROLLER:', error);
        // Exposes the exact internal cause instead of hiding behind a blank 500 error
        return res.status(500).json({ error: 'Internal Server Error', message: error.message, details: error.stack });
    }
};

exports.downloadExpenseHistory = async (req, res) => {
  try {
    if (!req.user.isPremiumUser) {
      return res.status(401).json({ error: 'Unauthorized: Premium membership required to download expense history.' });
    }

    const userId = req.user.id;

    // Use existing persisted history. Do not update download tracking here,
    // so that downloading the history itself doesn't create extra history entries.

    const PremiumLeader = require('../Model/premiumLeaders');


    const premiumLeader = await PremiumLeader.findOne({ where: { userId } });


    let historyArr = [];
    if (premiumLeader?.expenseDownloadHistory) {
      try {
        historyArr = JSON.parse(premiumLeader.expenseDownloadHistory);
        if (!Array.isArray(historyArr)) historyArr = [];
      } catch {
        historyArr = [];
      }
    }

    const header = 'Download At\n';
    const rows = historyArr.map(ts => new Date(ts).toISOString()).join('\n');
    const csv = header + rows;

    // Upload to S3 and return pre-signed URL
    const { uploadCsvAndGetPresignedUrl } = require('../util/s3UploadCsv');
    const csvFilename = 'expense_download_history.csv';
    const key = `${makeS3Key('expense-history', userId)}/${csvFilename}`;

    const url = await uploadCsvAndGetPresignedUrl({
      key,
      csv,
      contentType: 'text/csv',
    });

    res.status(200).json({ url, filename: csvFilename });
  } catch (error) {
    console.error('Error downloading expense history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.addExpense = async (req, res) => {

     const t = await sequelize.transaction();
     try {

          const { amount, description, category ,type} = req.body;
          const userId = req.user.id;

          if (!amount || !description) {
               await t.rollback()
               return res.status(400).json({ error: 'Amount and description are required' });
          }

          const transactionType = type || 'expense';
          const user = await User.findByPk(userId);

          if (!user) {
              await t.rollback();
              return res.status(404).json({ error: 'User not found' });
          }

          

          const newExpense = await Expense.create(
               {
                    amount,
                    description,
                    category,
                    userId,
                    type:transactionType
               },
               { transaction: t }
          );

          // let updatedTotal 

          if (transactionType === 'credit') {
               const currentCredits = Number(user.totalCredits) || 0;
               const updatedCredits = currentCredits + Number(amount);
               
               await user.update({ totalCredits: updatedCredits }, { transaction: t });
          } else {
               const currentExpenditure = Number(user.totalExpenditure) || 0;
               const updatedExpenditure = currentExpenditure + Number(amount);
               
               await user.update({ totalExpenditure: updatedExpenditure }, { transaction: t });
          }
          // await user.update({ totalExpenses: updatedTotal }, { transaction: t });

          await t.commit();
          res.status(201).json(newExpense);
     } catch (error) {
          await t.rollback();
          console.error('Error occurred while adding expense:', error);
          res.status(500).send('Internal Server Error');
     }
};

exports.delete = async (req,res,next)=>{
     const expenseId = req.params.id
     const t = await sequelize.transaction()
     try{
          const expense = await Expense.findByPk(expenseId)

          if(!expense){
               await t.rollback();
               return res.status(404).json({success:false,message:'Expense not found'})
          }

          const user = await User.findByPk(req.user.id);
          if (!user) {
               await t.rollback();
               return res.status(404).json({ success:false, message:'User not found' })
          }

          const updatedTotal = Number(user.totalExpenses || 0) - Number(expense.amount);
          await user.update({ totalExpenses: updatedTotal }, { transaction: t });

          await expense.destroy({ transaction: t });
          await t.commit();
          res.status(200).json({success:true,message:'Expense deleted successfully'})
     }
     catch(error){
          await t.rollback();
          console.error('Error occurred while deleting expense:', error);
          res.status(500).json({success:false,message:'Internal Server Error'})
     }
}

exports.autoCategorize = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Description is required" });
    }

    const category = await genaiService.categorizeExpense(description);
    return res.status(200).json({ category });

  } catch (error) {
    console.error("Controller Error in autoCategorize:", error);
    return res.status(500).json({ error: "Internal Server Error during categorization" });
  }
};

// Simple forgot password handler: accepts { email, newPassword }
// If the user exists, update the password immediately in the database.
exports.forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        if (ForgotPasswordRequest) {
            await ForgotPasswordRequest.create({
                userId: user.id,
                isActive: false
            });
        }

        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const UserExpense = require('../Model/userExpense');

exports.getUserExpenseSummary = async (req, res) => {
    try {
        // Query the primary expense dataset dynamically using Sequelize extraction functions

        const reports = await Expense.findAll({
            where: { userId: req.user.id }, // Make sure to target only the logged-in user
            attributes: [
                // Extract Year and Month strings directly from MySQL 'createdAt' column

                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
                [Sequelize.fn('MONTHNAME', Sequelize.col('createdAt')), 'month'],

                // Sum up expenditures (assuming your column name is 'amount')

               [Sequelize.literal("SUM(CASE WHEN LOWER(type) = 'expense' THEN amount ELSE 0 END)"), 'totalExpenditure'],
               [Sequelize.literal("SUM(CASE WHEN LOWER(type) = 'credit' THEN amount ELSE 0 END)"), 'totalCredit']
            ],
            // Group the data by year and month so it combines matching rows
            group: [
                Sequelize.fn('YEAR', Sequelize.col('createdAt')), 
                Sequelize.fn('MONTHNAME', Sequelize.col('createdAt'))
            ],
            order: [
                [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'DESC'],
                [Sequelize.fn('MONTHNAME', Sequelize.col('createdAt')), 'ASC']
            ],
            raw: true // Ensures we get a pure JavaScript array block back
          });

        // Calculate the aggregate yearly total expenditures from your combined array rows
        let yearlyExpenditure = 0;
        let yearlyCredit = 0;
        
        // Loop through reports to cast strings to numbers and add them up
        const formattedMonthlyData = reports.map(row => {
            const expValue = parseFloat(row.totalExpenditure) || 0;
            const credValue = parseFloat(row.totalCredit) || 0;

            yearlyCredit += credValue
            yearlyExpenditure += expValue;
            
            return {
                year: row.year,
                month: row.month,
                totalExpenditure: expValue,
                totalCredit:credValue // Set a default value if you track credits elsewhere
            };
        });

        // Send JSON data back to frontend
        return res.status(200).json({
            success: true,
            monthlyData: formattedMonthlyData,
            yearlyTotals: {
                totalExpenditure: yearlyExpenditure,
                totalCredit: yearlyCredit// Update this once you link credit tracking tables
            }
        });

    } catch (err) {
        console.error('Error computing live database statistics:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
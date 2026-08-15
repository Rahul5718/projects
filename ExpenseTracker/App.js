
const express = require('express')
const app = express()
const path = require('path')
const sequelize = require('./util/database')

// import Database models
const Expense = require('./Model/expenseDataset')
const User = require('./Model/UserdataSetCreation')
const ForgotPasswordRequest = require('./Model/forgotPassword')
const UserExpense = require('./Model/userExpense')

const mogoose = require('mongoose')

require('dotenv').config()

User.hasMany(ForgotPasswordRequest, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
ForgotPasswordRequest.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(UserExpense, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserExpense.belongsTo(User, { foreignKey: 'userId' });

// Middleware to parse JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')))

// Set the view engine to EJS
app.set('view engine', 'ejs')

// Import and use the router
const router = require('./Route/route')
app.use(router)

app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, 'View', 'index.html'))
})

app.get('/user/register', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'singup.html'))
})

app.get('/user/login', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'login.html'))
})

app.get('/expenses/addexpense', (req, res) => {
     res.sendFile(path.join(__dirname, 'View', 'expense.html'))
})

app.get('/user/forgotpassword', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'forgotpassword.html'))
})

const Order = require('./Model/order')

// Existing relationships
User.hasMany(Expense);
Expense.belongsTo(User);

// New relationships
User.hasMany(Order);
Order.belongsTo(User);

const Mongo_url = `mongodb+srv://${process.env.Mongo_user}:${process.env.Mongo_pass}@${process.env.Mongo_cluster}/?appName=Cluster0${process.env.Mongo_database}`




// Start the server

async function startServer() {
    try {
        // Test the database authentication pool connection directly
        await sequelize.authenticate();
        console.log('Successfully authenticated with MySQL Database.');

        // Synchronize all your defined schemas/associations
        await sequelize.sync(); 
        console.log('MySQL Database Tables Synced Successfully.');

        // Initialize server instance listening parameters
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running smoothly on port ${PORT}`);
        });

    } catch (err) {
        console.error('Core application initialization failed:', err);
    }
}

startServer();

const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const buildFallbackSummary = (expenses) => {
  let totalExpenses = 0;
  let totalCredits = 0;
  const categoryCounts = {};

  expenses.forEach((item) => {
    const amount = Number(item.amount || 0);
    const type = item.type ? item.type.toLowerCase() : 'expense';
    const category = item.category || 'Uncategorized';

    if (type === 'credit' || type === 'income') {
      totalCredits += amount;
    } else {
      totalExpenses += amount;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  });

  const netSavings = totalCredits - totalExpenses;

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `${category} (${count})`)
    .slice(0, 3);

  const commonCategories = sortedCategories.length ? sortedCategories.join(', ') : 'No categories available';

  
  let dynamicTip = "Great job managing your cash flow! Consider investing your extra savings.";
  if (totalExpenses > totalCredits) {
    dynamicTip = "Your expenses are higher than your credits. We suggest cutting back on non-essential spending to balance your budget.";
  } else if (totalExpenses > totalCredits * 0.7) {
    dynamicTip = "Your spending is eating up more than 70% of your income. Focus on reducing recurring costs.";
  }

  return `Financial Summary:
- Total Credits: ₹${totalCredits.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Net Balance: ₹${netSavings.toFixed(2)}
- Top Categories: ${commonCategories}
- Tip: ${dynamicTip}`;
};

exports.generateExpenseSummary = async (expenses) => {

  let totalExpenses = 0;
  let totalCredits = 0;
  // 1. Format both credits and expenditures explicitly so the AI understands money flow
 const transactionDescriptions = expenses
    .map((item) => {
      const amount = Number(item.amount || 0);
      const type = item.type ? item.type.toUpperCase() : 'EXPENSE';
      
      if (type === 'CREDIT' || type === 'INCOME') {
        totalCredits += amount;
      } else {
        totalExpenses += amount;
      }

      return `Type: ${type}, Amount: ₹${amount}, Description: ${item.description}, Category: ${item.category || 'General'}`;
    })
    .join('\n');

    const netSavings = totalCredits - totalExpenses;

  // 2. Draft a prompt specifically targeting Cash Flow and Month-to-Month budgeting balance rules
  const prompt = `
    You are an expert personal financial advisor AI. 
    Analyze the user's recent financial logs:
    
    ${transactionDescriptions}
    
    CRUCIAL FINANCIAL METRICS:
    - Total Money Injected (Credits): ₹${totalCredits.toFixed(2)}
    - Total Money Spent (Expenses): ₹${totalExpenses.toFixed(2)}
    - Net Savings Margin (Credits - Expenses): ₹${netSavings.toFixed(2)}
    
    Please provide a concise, professional financial summary structured with markdown bold headers:
    1. **Cash Flow Overview**: State their Net Balance (₹${netSavings.toFixed(2)}). Clearly break down if they are saving or losing money this month.
    2. **Spending Patterns**: Point out their highest cost categories.
    3. **Actionable Suggestions**: Provide 2 explicit, practical suggestions tailored directly to their current credit-to-expense balance. If their expenses are high or their net balance is negative, tell them exactly how to cut spending. If they have healthy savings, give them smart tips on how to utilize that extra cash.
  `;
  
  if (!ai) {
    console.warn('GenAI API key not configured. Returning local fallback summary.');
    return buildFallbackSummary(expenses);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (response?.text) {
      return response.text.trim();
    }

    console.warn('GenAI returned no text, using fallback summary.');
    return buildFallbackSummary(expenses);
  } catch (error) {
    console.error('GenAI summary error, falling back to local summary:', error);
    return buildFallbackSummary(expenses);
  }
};
// Automatically categorizes an expense based on its text description and amount
exports.categorizeExpense = async (description) => {
  const prompt = `Categorize the following expense:\nDescription: ${description}\n\nProvide a single-word category for this expense (e.g., Food, Transportation, Entertainment, Miscellaneous).`;

  if (!ai) {
    console.warn('GenAI API key not configured for categorization. Returning Miscellaneous.');
    return 'Miscellaneous';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response?.text?.trim() || 'Miscellaneous';
  } catch (error) {
    console.error('Error categorizing expense:', error);
    return 'Miscellaneous';
  }
};

exports.generateFinancialAdvice = async (expenses) => {
  const expenseDescriptions = expenses
    .map(
      (expense) =>
        `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`
    )
    .join('\n');

  const prompt = `Based on the following expenses, provide personalized financial advice to help the user manage their spending better:\n${expenseDescriptions}\n\nOffer actionable tips and strategies for budgeting and saving money.`;

  if (!ai) {
    console.warn('GenAI API key not configured for financial advice. Returning fallback guidance.');
    return 'Review your expense categories, set a monthly budget, and cut back on your top spending categories to save more.';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response?.text || 'Unable to generate financial advice at this time.';
  } catch (error) {
    console.error('Error generating financial advice:', error);
    return 'Unable to generate financial advice at this time.';
  }
};



const express = require('express')
const app = express()
const path = require('path')
const { connectDatabase } = require('./util/database')

// import Database models
const Expense = require('./Model/expenseDataset')
const User = require('./Model/UserdataSetCreation')
const ForgotPasswordRequest = require('./Model/forgotPassword')
const UserExpense = require('./Model/userExpense')

require('dotenv').config()

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

app.get('/signup', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'singup.html'))
})

app.get('/user/login', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'login.html'))
})

app.get('/login', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'login.html'))
})

app.get('/expenses/addexpense', (req, res) => {
     res.sendFile(path.join(__dirname, 'View', 'expense.html'))
})

app.get('/user/forgotpassword', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'forgotpassword.html'))
})

app.get('/forgotpassword.html', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'forgotpassword.html'))
})

app.get('/resetpassword.html', (req, res) => {
     res.sendFile(path.join(__dirname, 'login', 'resetpassword.html'))
})

const Order = require('./Model/order')

// Start the server

async function startServer() {
    try {
        await connectDatabase();
        console.log('MongoDB collections are ready.');

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

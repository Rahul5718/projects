import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm'

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');

// Fetch and display existing expenses when the window loads
window.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
    checkPaymentResult();
    const buyPremiumBtn = document.getElementById('buyPremiumBtn');
    if (buyPremiumBtn) {
        buyPremiumBtn.addEventListener('click', handleBuyPremium);
    }
});

async function fetchExpenses() {
    try {
        // Clear previous entries
        expenseList.innerHTML = '';
        
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/expenses/getexpenses', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const expenses = response.data;

        expenses.forEach(expense => {
            renderExpenseOnWindow(expense);
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
    }
}

// Function to handle adding a new expense
expenseForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const token = localStorage.getItem('token')

        const expenseData = { amount, description, category };

        const response = await axios.post('http://localhost:3000/expenses/addexpense', expenseData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (response.status === 201) {
            // Render the newly created expense onto the window layout directly
            renderExpenseOnWindow(response.data);
            expenseForm.reset();
        }
    } catch (err) {
        console.error('Error adding expense:', err);
        alert('Failed to save expense');
    }
});

// Helper function to insert elements into the DOM window
function renderExpenseOnWindow(expense) {
    const li = document.createElement('li');
    li.style.background = '#f4f4f4';
    li.style.margin = '10px 0';
    li.style.padding = '10px';
    li.style.borderRadius = '5px';
    
    li.innerHTML = `
        <strong>₹${expense.amount}</strong> - ${expense.description} 
        <span style=" padding:2px 6px; border-radius:3px;">${expense.category}</span>
    `;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.background = '#ff4d4d';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.borderRadius = '3px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.float = 'right';

    deleteBtn.onclick = async function(){
        try{
            
            const token = localStorage.getItem('token')
            const response = await axios.delete(`http://localhost:3000/expenses/delete/${expense.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                if (li.parentNode === expenseList) {
                    expenseList.removeChild(li);
                } else {
                    // fallback: refresh list
                    fetchExpenses();
                }
            } else {
                alert('Failed to delete expense: ' + (response.data?.message || response.status));
            }
        }catch(err){
            
            if (err.response) {
                alert('Failed to delete expense: ' + (err.response.data?.message || err.response.status));
            } else {
                alert('Failed to delete expense (network or CORS error). See console for details.');
            }
        }
    }
    
    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
}

async function handleBuyPremium() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to buy premium membership.');
            return;
        }

        const response = await axios.get('http://localhost:3000/premium/membership', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { payment_session_id, order_id } = response.data;
        if (!payment_session_id) {
            throw new Error('Unable to start payment session');
        }

        const cashfreeSDK = window.Cashfree;
        if (!cashfreeSDK) {
            throw new Error('Cashfree SDK not loaded (window.Cashfree is undefined).');
        }

        // Cashfree v3 checkout call
        const cashfreeInstance = cashfreeSDK({ mode: 'sandbox' });
        await cashfreeInstance.checkout({
            paymentSessionId: payment_session_id,
            redirectTarget: '_self'
        });
    } catch (error) {
        console.error('Premium purchase failed:', {
            message: error?.message || error,
            response: error?.response?.data,
            stack: error?.stack
        });
        let detailedErrorMessage = 'Please try again.';
        if (error?.response?.data?.message) {
            detailedErrorMessage = error.response.data.message;
        } else if (error?.message) {
            detailedErrorMessage = error.message;
        }
        alert(`Unable to start premium purchase. ${detailedErrorMessage}`);
    }
}

function checkPaymentResult() {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const banner = document.getElementById('paymentResultBanner');

    if (paymentStatus === 'success') {
        if (banner) {
            banner.textContent = 'Transaction successful. You are now a premium user!';
            banner.className = 'payment-banner success';
        }
        alert('Transaction successful. You are now a premium user!');
    } else if (paymentStatus === 'fail') {
        if (banner) {
            banner.textContent = 'TRANSACTION FAILED. Please try again.';
            banner.className = 'payment-banner fail';
        }
        alert('TRANSACTION FAILED. Please try again.');
    }
}

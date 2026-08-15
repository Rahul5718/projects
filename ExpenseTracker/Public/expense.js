import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm'

async function handleRegisterSubmit(event){

     try{

          event.preventDefault()



          const name = document.getElementById('name').value

          const email = document.getElementById('email').value

          const phn = document.getElementById('phn').value

          const password = document.getElementById('password').value



          const formData = { name, email, phn, password };

          console.log(formData)



          const response = await axios.post('http://localhost:3000/user/register', formData);

          if (response.status === 201) {

               event.target.reset()

               alert('Registration Successful! Redirecting to login...')

               window.location.href = "/user/login"

          }

     } catch(err) {

          console.error('Error submitting form:', err)

          const errorHTML = `<div style="color:red; margin-top:10px;">Error: ${err.message || err}</div>`;

          document.body.insertAdjacentHTML('beforeend', errorHTML);

     }

}

async function handleLoginSubmit(event){

     try{

          event.preventDefault()

          const email = document.getElementById('email').value

          const password = document.getElementById('password').value

          const formData = { email, password };

          console.log(formData)



          const response = await axios.post('http://localhost:3000/user/login', formData);

          if (response.status === 200) {

               event.target.reset()

              localStorage.setItem('token', response.data.token)

               alert('Login Successful! Redirecting to expense page...')

               window.location.href = "/expenses/addexpense"

          }

     } catch(err) {

          console.error('Error submitting form:', err)

          const errorHTML = `<div style="color:red; margin-top:10px;">Error: ${err.message || err}</div>`;

          document.body.insertAdjacentHTML('beforeend', errorHTML);

     }

}

window.navigateToLogin = function(){

     window.location.href="/user/login"

}

const navigateToSignup = function() {

    window.location.href = "/user/register";
    console.log('clicked');
    

};

const signupButton = document.getElementById('signupButton');

if (signupButton) {
        console.log('clicked');
        
     signupButton.addEventListener('click', navigateToSignup);

}

const loginButton = document.getElementById('loginButton');

if (loginButton) {

     loginButton.addEventListener('click', navigateToLogin);

}

const regForm = document.getElementById('regForm');

if (regForm) {

     regForm.addEventListener('submit', handleRegisterSubmit);

}

const loginForm = document.getElementById('loginForm');

if (loginForm) {

     loginForm.addEventListener('submit', handleLoginSubmit);

}

const logout = document.getElementById('logout')

if(logout){
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.replace('/user/login');
    })
}


// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm'

const expenseForm = document.getElementById('expenseForm');

const expenseList = document.getElementById('expenseList');

const paginationControls = document.getElementById('paginationControls');

const leaderboardSection = document.getElementById('leaderboardSection');

const summaryResult = document.getElementById('summaryResult');

const downloadExpensesBtn = document.getElementById('downloadExpensesBtn');
const downloadExpenseHistoryBtn = document.getElementById('downloadExpenseHistoryBtn');

const expenseLimitDropdown = document.getElementById('expenseLimitDropdown');

const userExpenseBtn = document.getElementById('userExpenseBtn');
const summaryContainer = document.getElementById('summaryContainer');
const summaryTableBody = document.getElementById('summaryTableBody');
const yearlyExpenditureText = document.getElementById('yearlyExpenditureText');
const yearlyCreditText = document.getElementById('yearlyCreditText');


let currentPage = 1;

let totalPages = 1;

// Helper function to decode JWT token

function parseJwt(token) {

    try {

        var base64Url = token.split('.')[1];

        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {

            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);

        }).join(''));

        return JSON.parse(jsonPayload);

    } catch(e) {

        return null;

    }

}

// Check state and render interface access variables

window.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token');

    if (token) {

        await fetchCurrentUser();

    }



    // Expense limit dropdown (dynamic pagination)

    if (expenseLimitDropdown) {

        const allowed = [2, 5, 10, 20, 30];

        const stored = parseInt(localStorage.getItem('expenseLimit'), 10);

        const initial = allowed.includes(stored) ? stored : 10;

        expenseLimitDropdown.value = String(initial);



        // ensure initial UI works

        currentPage = 1;

        await fetchExpenses(1);



        expenseLimitDropdown.addEventListener('change', async (e) => {

            const nextLimit = parseInt(e.target.value, 10);

            localStorage.setItem('expenseLimit', String(nextLimit));

            currentPage = 1;

            await fetchExpenses(1);

        });

    } else {

        if (expenseList) {

            await fetchExpenses(currentPage);

        }

    }

    await checkPaymentResult();
    const buyPremiumBtn = document.getElementById('buyPremiumBtn');

    if (buyPremiumBtn) {

        buyPremiumBtn.addEventListener('click', handleBuyPremium);

    }

    const showLeaderboardBtn = document.getElementById('showLeaderboardBtn');

    if (showLeaderboardBtn) {

        showLeaderboardBtn.addEventListener('click', fetchLeaderboard);

    }

    const generateSummaryBtn = document.getElementById('generateSummaryBtn');

    if (generateSummaryBtn) {

        generateSummaryBtn.addEventListener('click', fetchExpenseSummary);

    }

    if (downloadExpensesBtn) {
        downloadExpensesBtn.addEventListener('click', handleDownloadExpenses);
    }

    if (downloadExpenseHistoryBtn) {
        downloadExpenseHistoryBtn.addEventListener('click', handleDownloadExpenseHistory);
    }

});

// fetching current user details to render

async function fetchCurrentUser() {

    try {

        const token = localStorage.getItem('token');

        if (!token) return;



        const response = await axios.get('http://localhost:3000/user/me', {

            headers: { Authorization: `Bearer ${token}` }

        });



        const userData = response.data;

        const welcomeEl = document.getElementById('welcomeUser');

        if (userData && userData.name && welcomeEl) {

            welcomeEl.textContent = `Welcome, ${userData.name}!`;

        }



        if (response.data && response.data.isPremiumUser) {

            showPremiumUI();

        } else {
            // keep download buttons hidden for non-premium users
            if (downloadExpensesBtn) downloadExpensesBtn.style.display = 'none';
            if (downloadExpenseHistoryBtn) downloadExpenseHistoryBtn.style.display = 'none';
        }


    } catch (error) {

        console.error('Error fetching current user:', error);

    }

}

function showPremiumUI() {

    const buyPremiumBtn = document.getElementById('buyPremiumBtn');

    const premiumUserTag = document.getElementById('premiumUserTag');

    if (buyPremiumBtn) {

        buyPremiumBtn.style.display = 'none';

    }

    if (premiumUserTag) {

        premiumUserTag.style.display = 'inline-block';

    }

    if (downloadExpensesBtn) {
        downloadExpensesBtn.style.display = 'inline-block';
    }

    if (downloadExpenseHistoryBtn) {
        downloadExpenseHistoryBtn.style.display = 'inline-block';
    }


}

function showLeaderboardSection() {

    const section = document.getElementById('leaderboardSection');

    if (section) {

        section.style.display = 'block';

    }

}

function showLeaderboardMessage(message, isError = true) {

    const messageEl = document.getElementById('leaderboardMessage');

    if (!messageEl) return;

    messageEl.style.display = message ? 'block' : 'none';

    messageEl.style.color = isError ? '#d9534f' : '#28a745';

    messageEl.textContent = message || '';

}

async function fetchExpenses(page = 1) {

    try {

        if (!expenseList) return;

        expenseList.innerHTML = '';



        const token = localStorage.getItem('token');

        const limit = expenseLimitDropdown

            ? parseInt(expenseLimitDropdown.value, 10)

            : (parseInt(localStorage.getItem('expenseLimit'), 10) || 10);





        const response = await axios.get(

            `http://localhost:3000/expenses/getexpenses?page=${page}&limit=${limit}`,

            {

                headers: { Authorization: `Bearer ${token}` }

            }

        );





        const data = response.data;

        currentPage = data.page || 1;

        totalPages = data.totalPages || 1;



        if (!data.expenses || !data.expenses.length) {

            expenseList.innerHTML = '<li style="color:#555;">No expenses found.</li>';

        } else {

            data.expenses.forEach(expense => renderExpenseOnWindow(expense));

        }



        renderPaginationControls();

    } catch (err) {

        console.error('Error fetching expenses:', err);

        if (expenseList) {

            expenseList.innerHTML = '<li style="color:#d9534f;">Unable to load expenses.</li>';

        }

    }

}

if (userExpenseBtn) {
    userExpenseBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Query our newly declared backend overview endpoint
            const response = await axios.get('http://localhost:3000/user/expense-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const { monthlyData, yearlyTotals } = response.data;
                
                // Clear out stale existing structural rows
                summaryTableBody.innerHTML = '';

                // Loop through and append rows into the table interface
                monthlyData.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.year}</td>
                        <td>${row.month}</td>
                        <td style="color: red;">$${row.totalExpenditure.toFixed(2)}</td>
                        <td style="color: green;">$${row.totalCredit.toFixed(2)}</td>
                    `;
                    summaryTableBody.appendChild(tr);
                });

                // Inject aggregate dynamic totals elements directly
                yearlyExpenditureText.innerText = yearlyTotals.totalExpenditure.toFixed(2);
                yearlyCreditText.innerText = yearlyTotals.totalCredit.toFixed(2);

                // Reveal table block to user layout interface wrapper
                summaryContainer.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching dashboard summary datasets:', error);
            alert('Failed to fetch financial details database records.');
        }
    });
}

if (expenseForm) {

    expenseForm.addEventListener('submit', async (event) => {

    try {

        event.preventDefault();

        const amount = document.getElementById('amount').value;

        const description = document.getElementById('description').value;

        const category = document.getElementById('category').value;

        const token = localStorage.getItem('token');

        const type = document.getElementById('transactionType').value;

        const response = await axios.post('http://localhost:3000/expenses/addexpense',
            { amount, description, category,type }, {

            headers: { Authorization: `Bearer ${token}` }

        });

       

        if (response.status === 201) {

            expenseForm.reset();

            await fetchExpenses(currentPage);

        }

    } catch (err) {

        alert('Failed to save expense');

    }

    });

}

function renderExpenseOnWindow(expense) {

    const li = document.createElement('li');

    li.style.background = '#f4f4f4';

    li.style.margin = '10px 0';

    li.style.padding = '10px';

    li.style.borderRadius = '5px';

    const isCredit = expense.type === 'credit';
    const amountColor = isCredit ? 'green' : 'red';
    const typeLabel = isCredit ? '[Credit / Income]' : `[${expense.category || 'Expense'}]`;
    const sign = isCredit ? '+' : '-';

   li.innerHTML = `
        <div>
            <strong style="color: ${amountColor};">${sign} ₹${Number(expense.amount).toFixed(2)}</strong> 
            - ${expense.description} <small style="color: #666; margin-left: 5px;">${typeLabel}</small>
        </div>
    `;

    // li.innerHTML = `<strong>₹${expense.amount}</strong> - ${expense.description} [${expense.category}]`;

   

    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';

    deleteBtn.style.background = '#ff4d4d';

    deleteBtn.style.color = 'white';

    deleteBtn.style.float = 'right';

    deleteBtn.onclick = async function() {

        try {

            const token = localStorage.getItem('token');

            await axios.delete(`http://localhost:3000/expenses/delete/${expense.id}`, {

                headers: { "Authorization": `Bearer ${token}` }

            });

            li.remove();
            await fetchExpenses(currentPage)

        } catch(err) {

            alert('Failed to delete expense');

        }

    }

    li.appendChild(deleteBtn);

    expenseList.appendChild(li);

}

async function handleBuyPremium() {

    try {

        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/premium/membership', {

            headers: { Authorization: `Bearer ${token}` }

        });



        const { payment_session_id } = response.data;

        const cashfreeSDK = window.Cashfree;

        const cashfreeInstance = cashfreeSDK({ mode: 'sandbox' });

        await cashfreeInstance.checkout({

            paymentSessionId: payment_session_id,

            redirectTarget: '_self'

        });

    } catch (error) {

        console.error(error);

        alert('Unable to initiate premium purchase.');

    }

}

async function handleDownloadExpenses() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login to download expenses.');
            return;
        }

        const rangeType = document.getElementById('downloadRangeType').value;
        const startDate = document.getElementById('downloadStartDate').value;
        const endDate = document.getElementById('downloadEndDate').value;

        let queryParams = `?rangeType=${rangeType}`

        if(rangeType === 'custom'){
            if(!startDate || !endDate){
                alert('please select both date')
                return 
            }
            queryParams += `&startDate=${startDate}&endDate=${endDate}`
        }

        // 1. Fetch the pre-signed S3 URL from your backend controller
        const response = await axios.get(`http://localhost:3000/expenses/download${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Backend returns response inside response.data (or response.data.url depending on your setup)
        const data = response.data;
        const downloadUrl = data.url;
        const filename = data.filename || 'expenses.csv';

        if (!downloadUrl) {
            alert('Could not retrieve a valid download link from the server.');
            return;
        }

        // 2. DIRECT HYPERLINK DOWNLOAD STRATEGY (Bypasses Frontend CORS Network Errors)
        // We create a hidden element pointing directly to the S3 URL
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Tells the browser to download the target instead of navigating to it
        link.setAttribute('download', filename);
        link.target = '_blank'; 

        // 3. Trigger the download automatically
        document.body.appendChild(link);
        link.click();
        
        // 4. Clean up the document object tree
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error downloading expenses:', error);
        
        const msg = error?.response?.data?.error || 
                    error?.response?.data?.message || 
                    error?.message || 
                    'Unable to process file download.';
        alert(msg);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const downloadExpensesBtn = document.getElementById('downloadExpensesBtn');
    if (downloadExpensesBtn) {
        downloadExpensesBtn.addEventListener('click', handleDownloadExpenses);
    }
})

document.getElementById('downloadRangeType').addEventListener('change', (e) => {
    const customDateWrapper = document.getElementById('customDateWrapper');
    if (e.target.value === 'custom') {
        customDateWrapper.style.display = 'block';
    } else {
        customDateWrapper.style.display = 'none';
    }
})

async function checkPaymentResult() {

    const params = new URLSearchParams(window.location.search);

    const paymentStatus = params.get('payment');

    const banner = document.getElementById('paymentResultBanner');



    if (paymentStatus === 'success') {

        await fetchCurrentUser();

        if (banner) {

            banner.textContent = 'Transaction successful. You are now a premium user!';

            banner.className = 'success';

        }

        alert('Transaction successful. You are now a premium user!');

    } else if (paymentStatus === 'fail') {

        if (banner) {

            banner.textContent = 'TRANSACTION FAILED. Please try again.';

            banner.className = 'fail';

        }

        alert('TRANSACTION FAILED. Please try again.');

    }

}

function downloadCsv(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

async function handleDownloadExpenseHistory() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to download expense history.');
            return;
        }

        const response = await axios.get('http://localhost:3000/expenses/download-history', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { url, filename } = response.data;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'expense_download_history.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Error downloading expense history:', error);
        const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Unable to download expense history.';
        alert(msg);
    }
}

async function renderPaginationControls() {

    if (!paginationControls) return;



    paginationControls.innerHTML = '';



    const prevButton = document.createElement('button');

    prevButton.textContent = 'Previous';

    prevButton.disabled = currentPage <= 1;

    prevButton.style.marginRight = '8px';

    prevButton.onclick = () => {

        if (currentPage > 1) {

            fetchExpenses(currentPage - 1);

        }

    };



    const nextButton = document.createElement('button');

    nextButton.textContent = 'Next';

    nextButton.disabled = currentPage >= totalPages;

    nextButton.style.marginLeft = '8px';

    nextButton.onclick = () => {

        if (currentPage < totalPages) {

            fetchExpenses(currentPage + 1);

        }

    };



    const pageInfo = document.createElement('span');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    pageInfo.style.marginLeft = '10px';



    paginationControls.appendChild(prevButton);

    paginationControls.appendChild(pageInfo);

    paginationControls.appendChild(nextButton);

}

async function fetchLeaderboard() {

    try {

        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/premium/leaderboard', {

            headers: { Authorization: `Bearer ${token}` }

        });

       

        const leaderboardBody = document.getElementById('leaderboardBody');

        leaderboardBody.innerHTML = '';

       

        response.data.forEach((userRecord, index) => {

            const tr = document.createElement('tr');

            tr.innerHTML = `

                <td>${index + 1}</td>

                <td>${userRecord.name}</td>

                <td>₹${userRecord.totalExpenses || 0}</td>

            `;

            leaderboardBody.appendChild(tr);

        });



        showLeaderboardMessage('', false);

        showLeaderboardSection();

    } catch (error) {

        console.error(error);

        if (error.response && error.response.data && error.response.data.message) {

            showLeaderboardMessage(error.response.data.message, true);

        } else {

            showLeaderboardMessage('Failed to fetch Leaderboard.', true);

        }

    }

}

async function fetchExpenseSummary() {

    try {

        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/expenses/summary', {

            headers: { Authorization: `Bearer ${token}` }

        });



        if (summaryResult) {

            summaryResult.textContent = response.data.summary || 'No summary available.';

            summaryResult.style.display = 'block';

        }

    } catch (error) {

        console.error('Error fetching expense summary:', error);

        const message = error.response?.data?.message || 'Unable to generate expense summary at this time.';

        if (summaryResult) {

            summaryResult.textContent = message;

            summaryResult.style.display = 'block';

        }

    }

}

// Bind login/forgot-password buttons after DOM is ready

document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  if (forgotPasswordForm) {
    // 1. Extract the 'id' parameter from the URL address bar
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    // 2. Set it to the hidden input value
    if (requestId) {
      document.getElementById('email').value = requestId;
    } else {
      alert('Invalid or missing authentication token link.');
    }

    forgotPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const id = document.getElementById('resetRequestId').value;
        const newPassword = document.getElementById('newPassword').value;

        // Make sure this route matches your update routing setup in backend
        const response = await axios.post('/password/updatepassword', { 
            id: id, 
            newPassword: newPassword 
        });

        if (response.status === 200) {
          alert('Password reset successfully. Redirecting to login page...');
          window.location.href = '/login'; // Redirects user back to login 
        }
      } catch (err) {
        console.error('Error submitting reset password form:', err);
        const msg = err.response?.data?.message || 'Unable to reset password.';
        alert(`Error: ${msg}`);
      }
    });
  }
});


//ForgotPassword ---

const forgotPasswordForm = document.getElementById('forgotPasswordForm')

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const messageBox = document.getElementById('messageBox');
        
        try {
            // Adjust this URL to match your server route mapping for sendResetEmail
            const response = await axios.post('/password/forgotpassword', { email });
            messageBox.innerHTML = `<p style="color: green;">${response.data.message}</p>`;
        } catch (err) {
            messageBox.innerHTML = `<p style="color: red;">Error sending email. Please try again.</p>`;
        }
    });
}

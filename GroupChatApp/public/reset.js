document.addEventListener('DOMContentLoaded', () => {
  // Target the specific form on the reset page
  const resetPasswordForm = document.getElementById('resetPasswordForm');

  if (resetPasswordForm) {
    // 1. Extract the 'id' parameter from the URL (?id=xxxx-xxxx...)
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    // 2. Set it to the hidden input value if it exists
    const hiddenInput = document.getElementById('resetRequestId');
    
    if (requestId && hiddenInput) {
      hiddenInput.value = requestId;
    } else {
      alert('Invalid or missing authentication token link. Please request a new email.');
      window.location.href = '/forgotpassword';
      return;
    }

    // 3. Handle form submission
    resetPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const id = document.getElementById('resetRequestId').value;
        const newPassword = document.getElementById('newPassword').value;

        if (!newPassword || newPassword.trim() === "") {
          alert('Please enter a valid password.');
          return;
        }

        // Send payload to backend database controller
        const response = await axios.post('/password/updatepassword', { 
            id: id, 
            newPassword: newPassword 
        });

        if (response.status === 200) {
          alert('Password reset successfully. Redirecting to login page...');
          window.location.href ='/login'; 
        }
      } catch (err) {
        console.error('Error submitting reset password form:', err);
        const msg = err.response?.data?.message || 'Unable to reset password.';
        alert(`Error: ${msg}`);
      }
    });
  }
});
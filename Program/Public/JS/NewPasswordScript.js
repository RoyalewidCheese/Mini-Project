const newPasswordForm = document.querySelector('.login-form');
const invalidCredentialsMessage = document.querySelector('.invalid-credentials');

newPasswordForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newPasswordInput = document.querySelector('input[name="password"]');
  const retypePasswordInput = document.querySelector('input[name="re-password"]');

  const newPassword = newPasswordInput.value;
  const retypePassword = retypePasswordInput.value;

  if (newPassword !== retypePassword) {
    // Passwords do not match
    displayErrorMessage('Passwords Mismatch');
  } else {
    // Passwords match
    hideErrorMessage();
    newPasswordForm.submit();
  }
});

const displayErrorMessage = (message) => {
  invalidCredentialsMessage.style.display = 'block';
  invalidCredentialsMessage.textContent = message;
};

const hideErrorMessage = () => {
  invalidCredentialsMessage.style.display = 'none';
};

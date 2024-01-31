document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const invalidCredentialsElement = document.querySelector('.invalid-credentials');

  invalidCredentialsElement.style.display = 'none';

  usernameInput.addEventListener('input', clearInvalidCredentials);
  passwordInput.addEventListener('input', clearInvalidCredentials);
  usernameInput.addEventListener('focus', clearInvalidCredentials);
  passwordInput.addEventListener('focus', clearInvalidCredentials);

  function clearInvalidCredentials() {
    invalidCredentialsElement.style.display = 'none';
  }

  const loginForm = document.querySelector('.login-form');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const password = passwordInput.value;

    console.log('Form submitted');

    if (password !== 'password') {
      invalidCredentialsElement.style.display = 'block';
    } else {
      loginForm.submit();
    }
  });
});

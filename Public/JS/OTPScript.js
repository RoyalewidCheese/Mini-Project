const input0 = document.querySelector("#zero");
const input1 = document.querySelector("#one");
const input2 = document.querySelector("#two");
const input3 = document.querySelector("#three");
const input4 = document.querySelector("#four");
const input5 = document.querySelector("#five");

const inputs = [input0, input1, input2, input3, input4, input5];

const moveFocusToNextInput = (eventOriginationInputNumber) => {
  if (eventOriginationInputNumber === 5) {
    return;
  }

  inputs[eventOriginationInputNumber + 1].focus();
};

const moveFocusToPreviousInput = (eventOriginationInputNumber) => {
  if (eventOriginationInputNumber === 0) {
    return;
  }
  inputs[eventOriginationInputNumber - 1].focus();
};

const onInputChange = (event) => {
  const inputNumber = parseInt(event.target.getAttribute("data-number"));

  if (event.key === "Backspace") {
    moveFocusToPreviousInput(inputNumber);
    hideInvalidOTPMessage();
    return;
  }

  moveFocusToNextInput(inputNumber);
};

inputs.forEach((input) => {
  input.addEventListener("keyup", onInputChange);
});

const checkOTP = () => {
  // Get the entered OTP
  const enteredOTP =
    input0.value +
    input1.value +
    input2.value +
    input3.value +
    input4.value +
    input5.value;

    const verifyOTP = (enteredOTP) => {
        return fetch('/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp: enteredOTP }),
        })
          .then((response) => response.json())
          .then((data) => {
            return data.result; // Assuming the server responds with a result indicating the OTP verification status (e.g., 'success' or 'failure')
          });
      };      

  // Send the entered OTP to the server for verification
  verifyOTP(enteredOTP)
    .then((response) => {
      // Handle the response from the server
      if (response === "success") {
        // OTP is correct
        console.log("OTP is correct");
        window.location.href = "/newpassword";
        // Redirect the user to the success page or perform any desired action
      } else {
        // OTP is incorrect
        console.log("OTP is incorrect");
        showInvalidOTPMessage();
        // Display an error message or perform any desired action
      }
    })
    .catch((error) => {
      console.error("Error verifying OTP:", error);
      // Display an error message or perform any desired action
    });
};

const showInvalidOTPMessage = () => {
  const invalidOTPMessage = document.querySelector('.invalid-credentials');
  invalidOTPMessage.style.display = 'block';
};

const hideInvalidOTPMessage = () => {
  const invalidOTPMessage = document.querySelector('.invalid-credentials');
  invalidOTPMessage.style.display = 'none';
};

input5.addEventListener("keyup", checkOTP);

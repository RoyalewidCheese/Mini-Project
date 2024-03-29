// <----------------------------------------------Borrowers Buttons-------------------------------------------------------->

$(document).ready(function () {
  $(".add-room-button").click(function () {
    $(".side-menu").addClass("active");
    $(".side-menu-overlay").fadeIn();
    $("header").addClass("inactive");
  });

  $(".cancel-button, .side-menu-overlay").click(function () {
    $(".side-menu").removeClass("active");
    $(".side-menu-overlay").fadeOut();
    $("header").removeClass("inactive");
  });

  $(".view-details-button").click(function () {
    $(".popup-overlay").addClass("active");
  });

  // <--------------------------------------------Borrowers View Details---------------------------------------------------->

  $(".popup-overlay").click(function (event) {
    if ($(event.target).hasClass("popup-overlay")) {
      $(this).removeClass("active");
    }
  });
});

$(document).ready(function () {
  // Event listener for the "CANCEL" button click
  $(".cancel-button").click(function () {
    // Clear the form fields
    $("#addStudentForm")[0].reset();
  });
});

const viewDetailsButtons = document.getElementsByClassName(
  "view-details-button"
);

for (let i = 0; i < viewDetailsButtons.length; i++) {
  viewDetailsButtons[i].addEventListener("click", function () {
    const borrowerId = this.getAttribute("data-borrower-id");
    console.log("Borrower ID:", borrowerId);
    fetch(`/borrowers/details/${borrowerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Borrower details:", data);
        // Populate the borrower details in the details table
        document.getElementById("student-name").textContent =
          data[0].student_name;
        document.getElementById("admission-number").textContent =
          data[0].admission_no;
        document.getElementById("phone-number").textContent =
          data[0].phone_number;
        document.getElementById("branch").textContent = data[0].branch;
        document.getElementById("semester").textContent = data[0].semester;
        document.getElementById("borrowed-on").textContent =
          data[0].borrower_date.split("T")[0];
        // Show the details popup
        console.log("Showing popup");
        document.querySelector(".popup-overlay").classList.add("active");
      })
      .catch((error) => {
        console.error("Error fetching borrower details:", error);
      });
  });
}

// <------------------------------------------------------------------------------------------------------------------------>

// Add an event listener to the user-icon
const userIcon = document.getElementById('user-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

userIcon.addEventListener('click', function() {
  dropdownMenu.classList.toggle('show');
});

// Close the dropdown menu when the user clicks outside
document.addEventListener('click', function(event) {
  if (!userIcon.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }
});

const returnedButtons = document.querySelectorAll(".cancel-button");

returnedButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const studentName = document.getElementById("student-name").textContent;
    console.log("Student Name:", studentName);

    if (confirm("Are you sure you want to mark this borrower as returned?")) {
      // Make an AJAX request to delete the borrower
      fetch(`/borrowers/delete/${studentName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Refresh the page after successful deletion
            location.reload();
          } else {
            console.error("Error deleting borrower");
            // Handle the error
          }
        })
        .catch((error) => {
          console.error("Error deleting borrower:", error);
          // Handle the error
        });
    }
  });
});


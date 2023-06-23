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

// <-------------------------------------Searching and Filter---------------------------------------------->

document.getElementById('search-button').addEventListener('click', function() {
  var filter = document.getElementById('filter-select').value;
  var searchQuery = document.getElementById('search-input').value;
  
  // Perform the search based on the selected filter and search query
  if (filter === 'name') {
    // Perform search by name
    // Code to filter and display data by name
  } else if (filter === 'category') {
    // Perform search by category
    // Code to filter and display data by category
  } else if (filter === 'location') {
    // Perform search by location
    // Code to filter and display data by location
  }
});

// <----------------------------------------------Buttons Function-------------------------------------------------------->

// Function to close the side menu
function closeSideMenu() {
  $('.custom-side-menu').removeClass('active');
  $('.custom-side-menu-overlay').fadeOut();
  $('header').removeClass('inactive');
}

$(document).ready(function() {
  $('.add-room-button').click(function() {
    $('.side-menu').addClass('active');
    $('.side-menu-overlay').fadeIn();
    $('header').addClass('inactive');
  });

  $('.popup-overlay').click(function(event) {
    if ($(event.target).hasClass('popup-overlay')) {   // IMPORTANT FOR CLOSING SIDE PANEL
      closePopup();
      closeSideMenu();
    }
  });

  $('.cancel-button, .side-menu-overlay').click(function() {
    $('.side-menu').removeClass('active');
    $('.side-menu-overlay').fadeOut();
    $('header').removeClass('inactive');
  });

  $('.popup-overlay').click(function(event) {
    if ($(event.target).hasClass('popup-overlay')) {
      closePopup();
    }
  });
});

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
  
  if (!event.target.closest('.popup-overlay') && !event.target.closest('.custom-side-menu')) {
    closePopup();
    closeSideMenu();
  }
});

// Function to close the popup
function closePopup() {
  $('.popup-overlay').fadeOut();
}

// Function to fetch user details from the server
function fetchUserDetails(userId) {
  console.log("Fetching user details for ID:", userId);
  fetch(`/user-details/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      // Populate the details table with the fetched data
      document.getElementById("name").textContent = data.name;
      document.getElementById("role").textContent = data.role_id;
      document.getElementById("username").textContent = data.username;
      document.getElementById("password").textContent = data.password;
      document.getElementById("email").textContent = data.email;
      document.getElementById("phone_number").textContent = data.phone_number;

      // Update the data-user-id attribute of the form with the fetched user ID
      document.getElementById("user-details-form").setAttribute("data-user-id", userId);
    })
    .catch(error => {
      console.error("Error fetching user details:", error);
      // Handle the error or display an error message
    });
}
$(document).ready(function() {
  // Handle click event of "View Details" button
  $(document).on("click", ".view-details-button", function(event) {
    event.preventDefault();
    const userId = $(this).data("user-id");
    console.log("User ID:", userId);
    fetchUserDetails(userId);
    $('.popup-overlay').fadeIn(); // Open the popup
  });

  // Handle click event of "CANCEL" button
$(document).on("click", ".cancel-button", function(event) {
  event.preventDefault();
  closePopup(); // Close the popup
  closeSideMenu(); // Close the side menu
});

  // Handle click event of "Update" button in the popup
// Handle click event of "Update" button in the popup
$('.popup-overlay').on('click', '#update-button', function(event) {
  event.stopPropagation(); // Stop the click event from propagating to the document level
  var userId = $('#user-details-form').attr('data-user-id');
  var formData = $(this).closest('.popup-overlay').find('#user-details-form').serialize();
  var formAction = '/update-user/' + userId; // Modify the form action dynamically
  $('#user-details-form').attr('action', formAction); // Set the form action
  handleUpdate(userId, formData);
  $('.custom-side-menu').addClass('active'); // Open the custom-side-menu
});

// Handle click event of "Update" button in the custom-side-menu
$('.custom-side-menu').on('click', '.save-button', function(event) {
  event.stopPropagation(); // Stop the click event from propagating to the document level
  var userId = $('#user-details-form').attr('data-user-id');
  var formData = $(this).closest('.custom-side-menu').find('#user-details-form').serialize();
  handleUpdate(userId, formData);
  $(this).closest('.custom-side-menu').removeClass('active'); // Close the custom-side-menu
});

// Function to handle the update action
function handleUpdate(userId, formData) {
  // Update logic here using the userId and formData parameters
  console.log("Update action triggered for user ID:", userId);
  console.log("Form data:", formData);
  // Make an AJAX reque st or perform any other necessary action to update the user details
}

  // Function to fetch user details from the server
  function fetchUserDetails(userId) {
    console.log('Fetching user details for ID:', userId);
    console.log(typeof userId !== 'undefined');
    fetch(`/user-details/${userId}`)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Error: ' + response.status + ' ' + response.statusText);
        }
        return response.json(); // Parse the response as JSON
      })
      .then(function(data) {
        // Populate the details table with the fetched data
        document.getElementById('name').textContent = data.name;
        document.getElementById('role').textContent = data.role_id;
        document.getElementById('username').textContent = data.username;
        document.getElementById('password').textContent = data.password;
        document.getElementById('email').textContent = data.email;
        document.getElementById('phone_number').textContent = data.phone_number;

        // Pre-fill the update form with the fetched user details
        document.getElementById('user-details-form').setAttribute('data-user-id', userId);
        document.getElementById('user-details-form').elements['username'].value = data.username;
        document.getElementById('user-details-form').elements['password'].value = data.password;
        document.getElementById('user-details-form').elements['category'].value = data.role_id;
        document.getElementById('user-details-form').elements['email'].value = data.email;
        document.getElementById('user-details-form').elements['phone_number'].value = data.phone_number;

        document.getElementById('delete-button').setAttribute('data-user-id', userId);
      })
      .catch(function(error) {
        console.error('Error fetching user details:', error);
        // Handle the error or display an error message
      });
  }

  // Handle click event of "DELETE" button
$('.popup-overlay').on('click', '#delete-button', function(event) {
  event.stopPropagation(); // Stop the click event from propagating to the document level
  var userId = $(this).data('user-id');
  console.log("Delete button clicked for user ID:", userId);
  handleDelete(userId);
});

// Function to handle the delete action
function handleDelete(userId) {
  // Perform the delete logic here using the userId parameter
  console.log("Delete action triggered for user ID:", userId);
  
  // Make an AJAX request or perform any other necessary action to delete the user
  fetch(`/delete-user/${userId}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      console.log("User deleted successfully:", data);
      // Handle the success case or display a success message
      closePopup(); // Close the popup
      location.reload(); // Refresh the page
    })
    .catch(error => {
      console.error("Error deleting user:", error);
      // Handle the error or display an error message
    });
}

});

// <----------------------------------------------Buttons Function-------------------------------------------------------->

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

  $('.cancel-button, .side-menu-overlay').click(function() {
    $('.side-menu').removeClass('active');
    $('.side-menu-overlay').fadeOut();
    $('header').removeClass('inactive');
  });


  $('.popup-overlay').click(function(event) {
    if ($(event.target).hasClass('popup-overlay')) {
      $(this).removeClass('active');
    }
  });
});

// <----------------------------------------------Item Details-------------------------------------------------------->

// Assuming you have jQuery available
$(document).on('click', '.view-details-button', function() {
  var itemId = $(this).data('item-id');
  
  // Make an AJAX request to fetch the item details
  $.ajax({
    url: '/api/items/' + itemId,
    method: 'GET',
    success: function(response) {
      console.log(response); // Debug statement to check the response data
      
      // Populate the overlay with the item details
      $('#details-table td#item_id').text(response.ItemID);
      $('#details-table td#category').text(response.Category);
      $('#details-table td#brand').text(response.Brand);
      $('#details-table td#model').text(response.Model);
      $('#details-table td#description').text(response.Description);
      $('#details-table td#warranty').text(new Date(response.Warranty).toLocaleDateString('en-US'));
      $('#details-table td#type').text(response.Type);
      $('#details-table td#lab_location').text(response.LabLocation);
      $('#details-table td#status').text(response.Status);
      $('#details-table td#quantity').text(response.Quantity);
      $('#details-table td#price_per_item').text(response.PricePerItem);
      $('#details-table td#total_price').text(response.TotalPrice);
      
      // Show the overlay
      $('.popup-overlay').addClass('active').fadeIn();

      // Pre-populate the update form with the item details
      $('#update-item [name="item_id"]').val(response.ItemID);
      $('#update-item [name="category"]').val(response.Category);
      $('#update-item [name="brand"]').val(response.Brand);
      $('#update-item [name="model"]').val(response.Model);
      $('#update-item [name="description"]').val(response.Description);

      var warrantyDate = new Date(response.Warranty);
      var warrantyFormatted = warrantyDate.getFullYear() + '-' + ('0' + (warrantyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + warrantyDate.getDate()).slice(-2);
      $('#update-item [name="warranty"]').val(warrantyFormatted);
      $('#update-item [name="type"]').val(response.Type);
      $('#update-item [name="lab"]').val(response.LabLocation);
      $('#update-item [name="status"]').val(response.Status);
      $('#update-item [name="quantity"]').val(response.Quantity);
      $('#update-item [name="price"]').val(response.PricePerItem);
      $('#update-item [name="totalprice"]').val(response.TotalPrice);
    },
    error: function(xhr, status, error) {
      console.error('Error fetching item details:', error);
    }
  });
});

// <----------------------------------------------------------------------------------------------------------------->

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

$(document).ready(function() {
  // Handle click event of Update button
  $('#update-button').click(function(event) {
    event.stopPropagation(); // Stop the click event from propagating to the document level
    $('.custom-side-menu').addClass('active');
    $('.custom-side-menu-overlay').fadeIn();
    $('header').addClass('inactive');
  });

  // Handle click event of Cancel button
  $('.custom-side-menu .cancel-button').click(function(event) {
    event.stopPropagation(); // Stop the click event from propagating to the document level
    closeSideMenu();
    closePopup();
  });

  // Handle click event on the overlay to close the side menu
  $('.custom-side-menu-overlay').click(function() {
    closeSideMenu();
    closePopup();
  });

  // Close the popup and side menu when clicked outside the box
  $(document).on('click', function(event) {
    var popupOverlay = $('.popup-overlay');
    var customSideMenu = $('.custom-side-menu');
  
    if (!$(event.target).closest('.popup').length && !$(event.target).closest('.custom-side-menu').length && popupOverlay.is(':visible')) {
      closeSideMenu();
      closePopup();
    }
  });

  // Function to close the side menu
  function closeSideMenu() {
    $('.custom-side-menu').removeClass('active');
    $('.custom-side-menu-overlay').fadeOut();
    $('header').removeClass('inactive');
  }

  // Function to close the popup
  function closePopup() {
    $('.popup-overlay').fadeOut();
  }
});

$(document).ready(function() {
  // Handle click event of Update button
  $('#update-button').click(function(event) {
    event.stopPropagation(); // Stop the click event from propagating to the document level
    $('.custom-side-menu').addClass('active');
    $('.custom-side-menu-overlay').fadeIn();
    $('header').addClass('inactive');
  });

  // Handle click event of Cancel button
  $('.custom-side-menu .cancel-button').click(function(event) {
    event.stopPropagation(); // Stop the click event from propagating to the document level
    closeEverything();
  });

  // Handle click event on the overlay to close everything
  $('.custom-side-menu-overlay').click(function() {
    closeEverything();
  });

  // Close everything when clicked outside the box
  $(document).on('click', function(event) {
    var target = $(event.target);
    var isCustomSideMenu = target.closest('.custom-side-menu').length > 0;
    var isPopup = target.closest('.popup').length > 0;

    if (!isCustomSideMenu && !isPopup) {
      closeEverything();
    }
  });

  // Function to close everything
  function closeEverything() {
    $('.custom-side-menu').removeClass('active');
    $('.custom-side-menu-overlay').fadeOut();
    $('header').removeClass('inactive');
    $('.popup-overlay').fadeOut();
  }
});

$(document).ready(function() {
  // Store the item ID when clicking the view details button
  var selectedItemId;

  $(document).on('click', '.view-details-button', function() {
    selectedItemId = $(this).data('item-id');
    console.log('Selected Item ID:', selectedItemId);
  });

  // Handle click event of Delete button
  $('#delete-button').click(function() {
    if (selectedItemId) {
      console.log('Deleting Item ID:', selectedItemId);

      // Make an AJAX request to delete the item
      $.ajax({
        url: '/api/items/' + selectedItemId,
        method: 'DELETE',
        success: function(response) {
          console.log(response); // Debug statement to check the response data
          // Redirect or perform any other necessary action
          location.reload();
        },
        error: function(xhr, status, error) {
          console.error('Error deleting item:', error);
        }
      });
    } else {
      console.log('No item selected.');
    }
  });
});


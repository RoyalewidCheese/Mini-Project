// Assuming you have jQuery available
function getItemDetails(itemId) {
  // Make an AJAX request to the server
  $.ajax({
    url: `/stockdetails/item-details/${itemId}`,
    type: 'GET',
    dataType: 'json',
    success: function (itemDetails) {
      console.log(itemDetails);
      if (itemDetails && itemDetails.item_id) {
        // Update the item details in the popup overlay
        $('#item_id').text(itemDetails.item_id);
        $('#cat_name').text(itemDetails.cat_name);
        $('#reference_page').text(itemDetails.reference_page);
        $('#invoice_id').text(itemDetails.invoice_id);
        $('#invoice_date').text(new Date(itemDetails.invoice_date).toLocaleDateString('en-US'));
        $('#supplier_name').text(itemDetails.supplier_name);
        $('#stock_type').text(itemDetails.stock_type);
        $('#sub_indent_no').text(itemDetails.sub_indent_no);
        $('#stock_no').text(itemDetails.stock_no);
        $('#indent_no').text(itemDetails.indent_no);
        
        // Pre-populate the update stock form with the item details
        $('#update-stock-form [name="indent_no"]').val(itemDetails.indent_no);
        $('#update-stock-form [name="sub_indent_no"]').val(itemDetails.sub_indent_no);
        $('#update-stock-form [name="stock_no"]').val(itemDetails.stock_no);
        $('#update-stock-form [name="invoice_id"]').val(itemDetails.invoice_id);
        $('#update-stock-form [name="invoice_date"]').val(new Date(itemDetails.invoice_date).toISOString().split('T')[0]);
        $('#update-stock-form [name="supplier_name"]').val(itemDetails.supplier_name);
        $('#update-stock-form [name="stock_type"]').val(itemDetails.stock_type);
        $('#update-stock-form [name="reference_page"]').val(itemDetails.reference_page);

        // Show the overlay
        $('.popup-overlay').addClass('active').fadeIn();
      } else {
        console.error('Error retrieving item details: Invalid response');
        // Handle the error appropriately
      }
    },
    // Error handling code
  });
}

// Example usage: Call the getItemDetails function when clicking the "View Details" button
$(document).on('click', '.view-details-button', function () {
  var itemId = $(this).data('item-id');
  getItemDetails(itemId);
});

// Handle form submission
$('#update-stock-form').submit(function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  let formData = $(this).serialize();

  // Get the item_id value separately
  const itemId = $('#item_id').text(); // Assuming item_id is a text element in the popup overlay

  // Append item_id to the form data
  formData += '&item_id=' + itemId;

  // Make an AJAX request to update the stock details
  $.ajax({
    url: '/update-stockdetails',
    type: 'POST',
    data: formData,
    success: function(response) {
      // Handle the success response
      console.log('Stock details updated successfully');
      closeSideMenu(); // Close the side menu
      closePopup();
      window.location.reload(); // Reload the page
      // Perform any additional actions or UI updates as needed
    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.error('Error updating stock details:', error);
      // Perform any error handling or display error messages to the user
    }
  });

  // Log the item_id value
  console.log('item_id:', itemId);
});

// Function to close the side menu
function closeSideMenu() {
  $('.custom-side-menu').removeClass('active');
  $('.custom-side-menu-overlay').fadeOut();
  $('header').removeClass('inactive');
}

// Function to close the popup overlay
function closePopup() {
  $('.popup-overlay').removeClass('active').fadeOut();
}
// <----------------------------------------------Buttons Function-------------------------------------------------------->

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

});

// <-----------------------------------------------------Item Details-------------------------------------------------------->

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
  });

  // Handle click event on the overlay to close the side menu
  $('.custom-side-menu-overlay').click(function() {
    closeSideMenu();
  });

  // Close the popup and side menu when clicked outside the box
  $(document).on('click', function(event) {
    var popupOverlay = $('.popup-overlay');
    var customSideMenu = $('.custom-side-menu');
  
    if (!$(event.target).closest('.popup').length && !$(event.target).closest('.custom-side-menu').length && popupOverlay.is(':visible')) {
      closeSideMenu();
      popupOverlay.fadeOut();
    }
  });
});

// <----------------------------------------------------Sorting-------------------------------------------------------------------->

// Variables to store the current sorting column and order
var currentSortColumn = 'indent_no';
var currentSortOrder = 'desc';

// Function to sort the table data
function sortTableData(column, order) {
  // Make an AJAX request to the server with the sorting parameters
  $.ajax({
    url: `/stockdetails/sort/${column}/${order}`,
    type: 'GET',
    dataType: 'json',
    success: function (sortedItems) {
      if (sortedItems && sortedItems.length > 0) {
        // Update the table body with the sorted data
        var tableBody = $('#table-body');
        tableBody.empty();

        sortedItems.forEach(function (Mainstock) {
          var row = $('<tr>');
          row.append($('<td>').text(Mainstock.indent_no));
          row.append($('<td>').text(Mainstock.sub_indent_no));
          row.append($('<td>').text(Mainstock.stock_no));
          row.append($('<td>').text(Mainstock.item_id));
          row.append($('<td>').append($('<button class="view-details-button" data-item-id="' + Mainstock.item_id + '">View Details</button>')));

          tableBody.append(row);
        });
      } else {
        console.error('Error retrieving sorted items: Invalid response');
        // Handle the error appropriately
      }
    },
  });
}

// Function to toggle the sort order
function toggleSortOrder() {
  currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
}

// Handle click events on the sort links
$(document).on('click', '.sort-link', function () {
  var column = $(this).data('column');

  if (column === currentSortColumn) {
    toggleSortOrder();
  } else {
    currentSortColumn = column;
    currentSortOrder = 'asc';
  }

  sortTableData(currentSortColumn, currentSortOrder);
});

// <----------------------------------------------------Deletion-------------------------------------------------------------------->

// Add click event handler to the "CANCEL" button
$('.close-button').click(function() {
  closeSideMenu(); // Close the side menu
  closePopup(); // Close the popup overlay
});

// Handle click event on the "DELETE" button
$('.cancel-button').click(function() {
  // Get the item_id value separately
  const itemId = $('#item_id').text(); // Assuming item_id is a text element in the popup overlay

  // Make an AJAX request to delete the item
  $.ajax({
    url: `/delete-item/${itemId}`,
    type: 'DELETE',
    success: function(response) {
      // Handle the success response
      console.log('Item deleted successfully');
      closePopup(); // Close the popup overlay
      location.reload(); // Refresh the page
    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.error('Error deleting item:', error);
      // Perform any error handling or display error messages to the user
      location.reload(); // Refresh the page
    },
    complete: function() {
      closePopup(); // Close the popup overlay regardless of success or error
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
});

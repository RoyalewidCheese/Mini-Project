// Get the canvas elements
const statusChartCanvas = document.getElementById("statusChart");
const statusChartCanvas2 = document.getElementById("statusChart2");

// Fetch data for first pie chart
fetch("/api/getStatusData")
  .then(response => response.json())
  .then(data => {
    const statusChart = new Chart(statusChartCanvas, {
      type: "doughnut",
      data: {
        labels: data.map(entry => entry.label),
        datasets: [
          {
            data: data.map(entry => entry.value),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#5e97f6", "#ff9f40"], // Customize the colors as desired
            borderWidth: 0, // Set the border width to 0 to create a hollow center
          }
        ],
      },
      options: {
        cutout: "50%", // Adjust the cutout percentage to control the size of the hollow center
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, // Set to false if you don't want to display the legend
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.raw || 0;
                return label + ": " + value;
              },
            },
          },
          datalabels: {
            display: true,
            font: {
              size: 14, // Adjust the font size of the status labels
            },
            color: "#fff", // Adjust the color of the status labels
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              return label + ": " + value;
            },
            align: "end", // Adjust the alignment of the status labels (start, center, end)
            anchor: "end", // Adjust the anchor position of the status labels (start, center, end)
          },
        },
      },
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

// Fetch data for second pie chart
fetch("/api/getItemStatusData")
  .then(response => response.json())
  .then(data => {
    const statusChart2 = new Chart(statusChartCanvas2, {
      type: "doughnut",
      data: {
        labels: data.map(entry => entry.label),
        datasets: [
          {
            data: data.map(entry => entry.value),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56","#ff9f40","#5e97f6"], // Customize the colors as desired
            borderWidth: 0, // Set the border width to 0 to create a hollow center
          }
        ],
      },
      options: {
        cutout: "50%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
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

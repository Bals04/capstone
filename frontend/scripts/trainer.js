
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sidebarToggle').addEventListener('click', function () {
        const sidebar = document.getElementById('logo-sidebar');
        sidebar.classList.toggle('-translate-x-full');
    });

    document.getElementById('userDropdownToggle').addEventListener('click', function () {
        const dropdown = document.getElementById('dropdown-user');
        dropdown.classList.toggle('hidden');
    });

    function setActive(link) {
        const links = document.querySelectorAll('a');
        links.forEach(l => {
            l.classList.remove('bg-customGray', 'text-white');
            l.classList.add('text-gray-900', 'dark:text-white');
        });
        link.classList.add('bg-customGray', 'text-white');
        link.classList.remove('text-gray-900', 'dark:text-white');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const dropdownButton = document.getElementById('dropdown-button');
        const dropdownMenu = document.getElementById('dropdown');

        dropdownButton.addEventListener('click', function () {
            dropdownMenu.classList.toggle('hidden');
        });

        // Close the dropdown if clicked outside
        window.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    });

    function toggleTab(tabId, activeButton) {
        // Hide all tab contents
        const tabs = document.querySelectorAll('#fullWidthTabContent > div');
        tabs.forEach(tab => {
            tab.classList.add('hidden');
        });

        // Show the selected tab content
        const activeTab = document.getElementById(tabId);
        activeTab.classList.remove('hidden');

        // Reset all button classes
        const buttons = document.querySelectorAll('#fullWidthTab button');
        buttons.forEach(button => {
            button.classList.remove('bg-customGray', 'dark:bg-customGray');
            button.classList.add('bg-div_color', 'dark:bg-div_color');
        });

        // Set the active button's background
        activeButton.classList.add('bg-customGray', 'dark:bg-customGray');
    }

    // Wait for the DOM to fully load
    document.addEventListener('DOMContentLoaded', function () {
        // Select the button
        const button = document.querySelector('.mt-4 button');
        // Select the modal
        const modal = document.getElementById('crud-modal');

        // Add click event listener to the button
        button.addEventListener('click', function () {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false'); // Update aria-hidden attribute
        });

        // Add click event listener to the close button in the modal
        const closeButton = modal.querySelector('button[data-modal-toggle]');
        closeButton.addEventListener('click', function () {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true'); // Update aria-hidden attribute
        });
    });


    // --------------------For the Chart----------------

    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Sales Amount',
                    data: [/* your sales data */],
                    backgroundColor: 'rgba(245, 127, 39, 0.5)',
                    borderColor: 'rgba(245, 127, 39, 1)',
                    borderWidth: 1,
                    yAxisID: 'y' // Associate this dataset with the first y-axis
                },
                {
                    label: 'Registered Members',
                    data: [/* your gym data */],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1' // Associate this dataset with the second y-axis
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left', // The first y-axis for sales
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right', // The second y-axis for gyms
                    grid: {
                        drawOnChartArea: false, // Prevent grid lines from overlapping
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    // Fetch data using Axios
    axios.get('http://localhost:3000/getTrainerSales')
        .then(response => {
            const salesData = response.data;

            // Initialize arrays for monthly sales and registered gyms with 12 slots (one for each month)
            const monthlySales = Array(12).fill(0);  // For sales amounts
            const membersRegistered = Array(12).fill(0);  // For gym registrations

            // Iterate over the API response to populate the respective months
            salesData.forEach(sale => {
                monthlySales[sale.month - 1] = parseFloat(sale.total_amount); // Assign total amount to correct month
                membersRegistered[sale.month - 1] = sale.member_count; // Assign gym count to correct month
            });

            // Ensure chart is updated after data fetch
            myChart.data.datasets[0].data = monthlySales;  // First bar: Sales amounts
            myChart.data.datasets[1].data = membersRegistered;  // Second bar: Gym registrations

            // Debugging: Check if the chart dataset is being updated correctly
            console.log("Updated Dataset for Gyms Registered: ", myChart.data.datasets[1].data);

            myChart.update();  // Refresh the chart with new data
        })
        .catch(error => {
            console.error("Error fetching sales data: ", error);
        });

    window.onload = fetchGymData;
  
})

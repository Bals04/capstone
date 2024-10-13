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

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: 'Number of Kupal',
        data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3], // manipulate here the data for the bars to show up
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Number of Kupalog',
        data: [10, 10, 10, 10, 10, 10, 12, 19, 3, 5, 2, 3],   // manipulate here the data for the bars to show up
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
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
  
})
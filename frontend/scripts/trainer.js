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

document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown');

    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
    });

    // Close the dropdown if clicked outside
    window.addEventListener('click', function(event) {
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


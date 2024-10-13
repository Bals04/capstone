const monthYearElement = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendarBody');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentDate = new Date();
let currentDay = currentDate.getDate(); // Get the current day of the month
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
    monthYearElement.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month));
    const firstDay = new Date(year, month, 1).getDay(); // Get the day of the week for the 1st day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = '';

    let row = '<tr>';
    // Adjust for correct starting position (if firstDay is 0, it means Sunday)
    for (let i = 0; i < (firstDay + 6) % 7; i++) { // Move to correct start of the week
        row += '<td></td>'; // Empty cells for days before the first day of the month
    }
    for (let day = 1; day <= daysInMonth; day++) {
        // Check if the day is the current day
        const isToday = day === currentDay && month === currentMonth && year === currentYear;
        row += `<td class="pt-6">
                    <div class="px-2 py-2 cursor-pointer flex w-full justify-center ${isToday ? 'bg-customOrange text-white rounded-full' : ''}">
                        <p class="text-base font-semibold">${day}</p>
                    </div>
                 </td>`;
        if ((day + firstDay + 6) % 7 === 0) {
            row += '</tr><tr>'; // New row after every week
        }
    }
    row += '</tr>'; // Closing the last row
    calendarBody.innerHTML = row;
}

prevButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// Initial render
renderCalendar(currentMonth, currentYear);
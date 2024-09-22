//sidebar
var btnContainer = document.getElementById("forActive");
var btns = btnContainer.getElementsByClassName("btn");

for(var i=0; i<btns.length; i++){
    btns[i].addEventListener('click', function(){
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active");
        this.className += " active";
    })
}

//calendar

const currentDate = document.querySelector(".current-date"),
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons span");

//getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), //first day
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), //last date sa month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), //last day sa month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); //last date previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { //previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // all days of current month

        //current day,month, year active
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { //next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}
renderCalendar();

//click event sa icons
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear(); //updates current year with new date year
            currMonth = date.getMonth(); //updates current month with new date month
        }else { //pass new date as date value
            date = new Date();
        }
        renderCalendar();
    });
}); //thank u chatgpt og yt lablats <3

document.getElementById('sidebarToggle').addEventListener('click', function () {
    const sidebar = document.getElementById('logo-sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

document.getElementById('userDropdownToggle').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown-user');
    dropdown.classList.toggle('hidden');
});
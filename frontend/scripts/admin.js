<<<<<<< HEAD

// --------------------For the Chart----------------

const ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
        datasets: [{
          label: 'Registered Gyms',
          data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3], // manipulate here the data for the bars to show up
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Pending Registrations',
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
=======
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
>>>>>>> 45980e6b99af736e7c84ca378a5641dc6aa21ea5

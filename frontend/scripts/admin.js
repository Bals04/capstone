
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

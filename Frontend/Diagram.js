let doctor = []
let patient = []
let backgroundColor = []

getData()

async function getData() {
  const response = await fetch("/get/statistic", {
      method: "GET",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
  })

  if (response.ok === true){
      const data = await response.json(); 
      data.forEach( Line => {
          doctor.push(Line.doctor)
          patient.push(Line.patients_count)
      })  
      diagram()         
  }
}

function diagram(){
  for (let i = 0; i < doctor.length; i++)
    backgroundColor.push('rgba(29, 233, 182, 0.6)')

  let ctx = document.getElementById('myChart').getContext('2d');
  let myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: doctor,
          datasets: [{
              label: 'Количество пациентов',
              data: patient,
              backgroundColor: backgroundColor,
              borderWidth: 1
          }]
      },
      options: {
          legend: {
              display: false
          },
          title: {
              display: true,
              text: 'Загруженность специалистов',
              position: 'top',
              fontSize: 16,
              padding: 20
          },
          scales: {
              yAxes: [{
                  ticks: {
                      min: 0
                  }
              }]
          }
      }
  });
}
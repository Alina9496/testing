document.querySelector('.data').style.visibility = 'hidden';
document.querySelector('.record').style.visibility = 'hidden';
let map = new Map()
getData();

async function getData() {
    const response = await fetch("/list/client", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    if (response.ok === true){
        const data = await response.json(); 
        data.forEach( Line => {
            $('#fio').append('<option value="' + Line.id + '">' + Line.fio + '</option>');
        })           
    }

    const responseDoctor = await fetch("/list/doctor", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    if (responseDoctor.ok === true){
        const data = await responseDoctor.json(); 
        data.forEach( Line => {
            map.set(Line.fio, Line.id)
            $('#doctor').append('<option value="' + Line.id + '">' + Line.fio + '</option>');
        })           
    }

}

async function Search(){
    document.querySelector('.data').style.visibility = 'visible';
    document.querySelector('.record').style.visibility = 'visible';

    let url = "?patientId=" + document.getElementById("fio").value;

    const response = await fetch("/client/card" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){
        const data = await response.json();
        document.getElementById("card").innerHTML = "";
        if (Object.keys(data).length === 0){
            alert('Ваша карточка на данный момент пуста!')
            $('#card').append('<h3>Карточка клиента</h3>');
            return;
        }
        
        $('#card').append('<h3>Карточка клиента</h3>');
        for (const doctor in data) {
            let line = '<li>' + doctor + '<ul>';
            data[doctor].forEach(dateArray => {
                dateArray.forEach(date => {
                    line += '<li>' + date + '</li>'
                });
            });
            $('#card').append(line + '</ul></li>');
        }
    }
}

async function Record(){
    if (document.getElementById("date").value == ""){
        alert('Введите дату!')
        return
    }

    let mapData = new Map();
    mapData.set(document.getElementById("doctor").value, [ document.getElementById("date").value ])
    const liElements = document.querySelectorAll('#card li');
    for (let i = 0; i < liElements.length; i++) {
        const doctor = liElements[i].innerText.split('\n')[0];
        const dates = Array.from(liElements[i].querySelectorAll('li'), li => li.innerText);
        if (map.get(doctor) !== undefined){
            let line = String(map.get(doctor))
            if (mapData.get(line) !== undefined){
                let array = [ document.getElementById("date").value ]
                for (let i = 0; i < dates.length; i++)
                    array.push(dates[i])
                mapData.set(map.get(doctor), array)
            }
            else
                mapData.set(map.get(doctor), dates)
        }
    }

    const response = await fetch("/edit/record", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            nameId: document.getElementById("fio").value,
            data: Object.fromEntries(mapData.entries())
        })
    });
    if (response.ok == true){
        alert("Вы успешно записались!")
        location.reload("http://127.0.0.1:3000/page/listClient");
    }
}
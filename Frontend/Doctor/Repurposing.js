const map = new Map()
getData()

async function getData() {
    const response = await fetch("/list/doctor", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    document.querySelector("tbody").innerHTML = ""; // Чистим
    if (response.ok === true){
        const data = await response.json(); 
        data.forEach( Line => {
            Print(Line);
        })           
    }

    const responseSpec = await fetch("/doctor/specialization", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    if (responseSpec.ok === true){
        const data = await responseSpec.json(); 
        data.forEach( Line => {
            map.set(Line.name, Line.id)
        })           
    }
}

function Print(Line) {
    $('#tbody').append('<tr>' + 
        '<td id="0' + Line.id + '">' + Line.fio + '</td>' + 
        '<td id="1' + Line.id + '">' + Line.name + '</td>' + 
        '<td>' + Line.telephone + '</td>' + 
        '<td><button id="' + Line.id + '" class="button" type="button" onclick="Change(id)">Изменить</button></td>' + 
        '</tr>'
    );
}

function Change(id){
    const key = map.get(document.getElementById('1' + id).innerHTML)
    $('#form').append('<form class="form">' +
                '<p>ФИО:</p>' +
                '<input id="fio" name="input" type="text" value="' + document.getElementById('0' + id).innerHTML + '" readonly>' +
                '<p>Специализация:</p>' +
                '<select id="specialization"><option value="' + key + '">' + document.getElementById('1' + id).innerHTML + '</option></select>' +
                '<p><button class="button" type="button" onclick="SendChange()">Изменить</button></p>' +
           '</form>'
    );

    for (let name of map.keys()) 
        if (name !== document.getElementById('1' + id).innerHTML)
            $('#specialization').append('<option value="' + map.get(name) + '">' + name + '</option>')

    document.querySelector('.data').style.visibility = 'hidden';
}

async function SendChange(){
    const response = await fetch("/edit/repurposing", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            special: document.getElementById('specialization').value,
            fio: document.getElementById('fio').value
        })
    })
    if (response.ok == true){
        alert("Ваша специализация изменена!")
        location.reload()
    }
}

async function Search(){
    let Line = document.forms.form.elements.input.value;
    if (Line == ''){
        getData();
        return;
    }
    Line = Line.toLowerCase();
    let ch = Line[0];
    Line = Line.replace(Line[0], ch.toUpperCase());
    
    let url = "?name=" + Line;

    const response = await fetch("/search/listDoctor" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){
        const data = await response.json();
        if (data.length == 0){
            alert('Данные не найдены!');
            return;
        }
        document.querySelector("tbody").innerHTML = "";
        data.forEach( Line => {
            Print(Line);
        })           
    }
}
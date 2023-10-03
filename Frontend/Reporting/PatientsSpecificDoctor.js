document.getElementById('data').style.visibility = 'hidden';
getData();

async function getData() {
    
    const response = await fetch("/list/doctor", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    
    if (response.ok === true){
        const data = await response.json();                                            
        data.forEach( Line => {
            $('#choice').append('<button id="' + Line.fio + '" class="but" type="button" onclick="Send(id)">' + Line.fio + '</button>');
        })           
    }
}

async function Send(name){
    let url = "?name=" + name;
    const response = await fetch("/report/patientsSpecificDoctor" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){
        const data = await response.json();
        if (data.length == 0){
            document.getElementById('data').style.visibility = 'hidden';
            alert('Данные не найдены!');
            return;
        }
        document.getElementById('data').style.visibility = 'visible';
        document.querySelector("tbody").innerHTML = ""; // Чистим
        data.forEach( Line => {
            Print(Line);
        })           
    }
}

function Print(Line){
    $('#tbody').append('<tr>' + 
        '<td>' + Line.fio       + '</td>' + 
        '<td>' + Line.telephone + '</td>' + 
        '<td>' + Line.address   + '</td>' + 
        '</tr>'
    );
}
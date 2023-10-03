document.getElementById('data').style.visibility = 'hidden';
getData();

async function getData() {
    
    const response = await fetch("/list/disease", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    
    if (response.ok === true){
        const data = await response.json();                                            
        data.forEach( Line => {
            $('#choice').append('<button id="' + Line.name + '" class="but" type="button" onclick="Send(id)">' + Line.name + '</button>');
        })           
    }
}

async function Send(name){
    let url = "?name=" + name;
    const response = await fetch("/report/patientsSpecificDisease" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){
        const data = await response.json();
        if (data.length == 0){
            alert('Данные не найдены!');
            return;
        }
        document.getElementById('data').style.visibility = 'visible';
        document.querySelector("tbody").innerHTML = "";
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
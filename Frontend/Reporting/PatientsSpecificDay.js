document.getElementById('data').style.visibility = 'hidden';

async function Viewing(){
    let url = "?date=" + document.getElementById("date").value;
    const response = await fetch("/report/patientsSpecificDay" + url, {
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
        '<td>' + Line.address + '</td>' + 
        '</tr>'
    );
}
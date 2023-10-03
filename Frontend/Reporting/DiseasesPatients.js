getData();

async function getData() {
    
    const response = await fetch("/report/diseasesPatients", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    document.getElementById("tbody").innerHTML = "";
    if (response.ok === true){
        const data = await response.json();                                            
        data.forEach( Line => {
            Print(Line)
        })           
    }
}

function Print(Line){
    $('#tbody').append('<tr>' + 
        '<td>' + Line.fio       + '</td>' + 
        '<td>' + Line.disease_name + '</td>' + 
        '</tr>'
    );
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

    const response = await fetch("/search/diseasesPatients" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){
        const data = await response.json();
        if (data.length == 0){
            alert('Данные не найдены!');
            return;
        }
        document.getElementById("tbody").innerHTML = "";
        data.forEach( Line => {
            Print(Line);
        })           
    }
}
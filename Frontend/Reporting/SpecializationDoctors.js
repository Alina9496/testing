getData();

async function getData() {
    
    const response = await fetch("/report/specializationDoctors", {
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
    let line = '<tr>' + 
        '<td>' + Line.doctor_name + '</td>' + 
        '<td>' + Line.specialization_name + '</td>';

    line += '<td>'
    Line.diseases_list.forEach( arr => {
        line += '<li>' + arr + '</li>';
    })
    line += '</td></tr>'
    $('#tbody').append(line);
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

    const response = await fetch("/search/specializationDoctors" + url, {
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
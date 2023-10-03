getData();

async function getData() {
    const response = await fetch("/list/doctor", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    document.querySelector("tbody").innerHTML = "";
    if (response.ok === true){
        const data = await response.json(); 
        data.forEach( Line => {
            Print(Line);
        })           
    }
}

function Print(Line) {
    $('#tbody').append('<tr>' + 
        '<td>' + Line.fio       + '</td>' + 
        '<td>' + Line.name + '</td>' + 
        '<td>' + Line.telephone + '</td>' + 
        '<td><button id="' + Line.id + '" class="button" type="button" onclick="Delete(id)">Уволить</button></td>' + 
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

async function Delete(id){
    const response = await fetch("/delete/dismiss", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            doctorId: Number(id)
        })
    })
    if (response.ok == true){
        alert("Специалист уволен")
        location.reload()
    }
}
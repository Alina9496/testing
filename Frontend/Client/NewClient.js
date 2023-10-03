async function Record(){
    if (document.getElementById("name").value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }
    if (document.getElementById("telephone").value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }
    if (document.getElementById("address").value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }
    if (document.getElementById("specialist").value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }

    const response = await fetch("/add/patient", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            telephone: document.getElementById("telephone").value,
            address: document.getElementById("address").value,
            doctor: document.getElementById("disease").value,
            disease: document.getElementById("specialist").value
        })
    });
    if (response.ok == true){
        alert("Вы зарегистрированы!")
        location.assign("http://127.0.0.1:3000/page/listClient");
    }
}

getDisease();

async function getDisease() {
    const response = await fetch("/list/disease", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })

    if (response.ok === true){
        const data = await response.json(); 
        data.forEach( Line => {
            $('#disease').append('<option value="' + Line.id + '">' + Line.name + '</option>')
        })
    }
    else
        console.log("Ошибка");
}

let count = 0;

function choice(){ 
    document.getElementById("specialist").value = "";
    count = 0;
}

async function getSpecialist() {
    let selectElement = document.getElementById("disease");
    let name = selectElement.options[selectElement.selectedIndex].text;

    if (count === 1) 
        return;
    let url = "?name=" + name;

    const response = await fetch("/report/specialistsSpecificDisease" + url, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (response.ok === true){   
        const data = await response.json();
        document.getElementById("specialist").innerHTML = ""; // Чистим
        data.forEach( Line => {
            $('#specialist').append('<option value="' + Line.id + '">' + Line.fio + '</option>');
        })          
        count++
    }
    else
        console.log("Ошибка");
}
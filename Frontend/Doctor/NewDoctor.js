getData();

async function getData() {
    const response = await fetch("/doctor/specialization", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
    })
    if (response.ok === true){
        const data = await response.json(); 
        data.forEach( Line => {
            $('#specialist').append('<option value="' + Line.id + '">' + Line.name + '</option>')
        })           
    }
}

async function Reception(){
    if ( document.getElementById('name').value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }
    if ( document.getElementById('telephone').value == ''){
        alert('Для регистрации заполните все поля!')
        return;
    }
    const response = await fetch("/add/doctor", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            telephone: document.getElementById('telephone').value,
            specialist: document.getElementById('specialist').value
        })
    });
    if (response.ok == true){
        alert("Вы приняты на работу!")
        location.assign("http://127.0.0.1:3000/page/listDoctor");
    }
}
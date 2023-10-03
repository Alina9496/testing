module.exports.listClient  = function(parameter){ 
    return 'select p.fio, p.telephone, p.address, doctor.fio as doctor ' +
    'from patient p '+
    'join doctor on doctor.id = p.doctor_id ' +
    "where p.fio like '" + parameter + "%' " +
    'order by p.fio ';
}

module.exports.listDoctor = function(parameter){
    return 'select fio, specialization.name, telephone ' +
    'from doctor, specialization ' +
    'where specialization_id = specialization.id ' +
        "and fio like '" + parameter + "%' " +
    'order by fio ';
}

module.exports.diseasesPatients = function(parameter){
    return 'SELECT fio, disease.name as disease_name ' +
    'FROM patient ' +
    'JOIN disease ON disease_id = disease.id ' +
        "and fio like '" + parameter + "%' ";
}

module.exports.specializationDoctors = function(parameter){
    return 'SELECT d.fio as doctor_name, s.name as specialization_name, array_agg(distinct di.name) as diseases_list ' +
    'FROM doctor d ' +
        'JOIN specialization s ON d.specialization_id = s.id ' +
        'JOIN diseasesprofile dp ON dp.specialization_id = s.id ' +
        'JOIN disease di ON di.id = dp.disease_id ' +
            "where d.fio like '" + parameter + "%' " +
    'GROUP BY d.id, s.name';
}
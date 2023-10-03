module.exports.addDoctor = 'INSERT INTO doctor ' +
    '(specialization_id, fio, telephone) ' +
    'VALUES($1, $2, $3) ';

module.exports.addPatient = 'insert  into patient ' +
    '(fio, telephone, address, doctor_id, disease_id) ' +
    'VALUES($1, $2, $3, $4, $5) ';

module.exports.dismiss = 'DELETE FROM doctor WHERE id = $1';

module.exports.repurposing = 'UPDATE doctor ' + 
    'SET specialization_id = ( ' +
        'select id from specialization where id=$1) ' + 
    'WHERE fio = $2';

module.exports.record = 'UPDATE patient ' +
    'SET reception = $1 ' +
    'WHERE id = $2';
    
module.exports.listDoctor = 'select doctor.id, fio, specialization.name, telephone ' +
    'from doctor, specialization ' +
    'where specialization_id = specialization.id ' +
    'order by fio ';

module.exports.listClient = 'select p.id, p.fio, p.telephone, p.address, doctor.fio as doctor ' +
    'from patient p ' +
    'join doctor on doctor.id = p.doctor_id ' +
    'order by p.fio ';

module.exports.patientsSpecificDisease = 'SELECT fio, disease.name as disease, telephone, address ' +
    'FROM patient ' +
    'JOIN disease ON disease_id = disease.id ' +
    'WHERE disease.name = $1';

module.exports.diseasesPatients = 'SELECT fio, disease.name as disease_name ' +
    'FROM patient ' +
    'JOIN disease ON disease_id = disease.id';

module.exports.specialistsSpecificDisease = 'SELECT doctor.id, doctor.fio, specialization.name as profession, disease.name as disease ' +
    'FROM doctor ' +
        'join specialization ON doctor.specialization_id = specialization.id ' +
        'join diseasesprofile on specialization.id = diseasesprofile.specialization_id ' +
        'join disease on diseasesprofile.disease_id = disease.id ' +
    'where disease.name = $1 '; 

module.exports.patientsSpecificDoctor = 'SELECT patient.fio, patient.telephone, patient.address, doctor.fio as doctor_name ' +
    'FROM patient ' +
    'JOIN doctor ON patient.doctor_id = doctor.id ' +
    'WHERE doctor.id = (select id from doctor where fio = $1 )';

module.exports.patientsSpecificDay = 'SELECT fio, telephone, address ' +
    'FROM patient ' + 
    "WHERE reception::jsonb->'visits' @> $1::jsonb";

module.exports.specializationDoctors = "" +
    'SELECT d.fio as doctor_name, s.name as specialization_name, array_agg(distinct di.name) as diseases_list ' +
    'FROM doctor d ' +
        'JOIN specialization s ON d.specialization_id = s.id ' +
        'JOIN diseasesprofile dp ON dp.specialization_id = s.id ' +
        'JOIN disease di ON di.id = dp.disease_id ' +
    'GROUP BY d.id, s.name';

module.exports.listDisease = "SELECT * from disease order by name";

module.exports.static = 'SELECT doctor.fio AS doctor, COUNT(p.id) AS patients_count ' +
    'FROM doctor ' +
        'LEFT JOIN patient p ON doctor.id = p.doctor_id ' +
    'GROUP BY doctor.id ' +
    'order by doctor.fio ';
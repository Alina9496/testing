const request = require("supertest")
const assert = require("assert")
const app = require("../Start").app
const connection = require("../Start").client

//Тестирование поисковой строки
describe('endpoint /search/listClient', function() {
    before(() => {
        const data = {
            fio        : 'test', 
            telephone  : 'telephoneTest', 
            address    : 'addressTest', 
            reception  : 'receptionTest', 
            doctor_id  : 1, 
            disease_id : 1
        }

        const value = [data.fio, data.telephone, data.address, data.doctor_id, data.disease_id]
        const sql = 'insert into patient ' +
        '(fio, telephone, address, doctor_id, disease_id) ' +
        'VALUES($1, $2, $3, $4, $5) ';

        connection.query(sql, value);
    });

    after(() => {
        connection.query("delete FROM patient WHERE fio = 'test'");
        process.exit(1)
    });
      
    it("data found", function(done){
        const result = [{
            fio       : 'test', 
            telephone : 'telephoneTest', 
            address   : 'addressTest', 
            doctor    : 'Иванов И.А.'
        }]
        request(app)
            .get("/search/listClient")
            .query({ name: "tes" })
            .expect(function(response){
                assert.deepEqual(response.body, result);
            })
            .end(done);
    });

    it("data not found", function(done){
        request(app)
            .get("/search/listClient")
            .query({ name: "not" })
            .expect(function(response){
                assert.deepEqual(response.body, []);
            })
            .end(done);
    });
  });

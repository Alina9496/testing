const request = require("supertest")
const assert = require("assert")
const app = require("../Start").app
const connection = require("../Start").client

// Тестирование поисковой строки
describe('endpoint /search/listClient', function() {
    before( async () => {
        const data = { name: 'test', telephone: "telephoneTest", address: "addressTest", doctor: "1", disease: "1"}
        const response = await request(app)
            .post('/add/patient')
            .send(data);
    });

    after(() => {
        connection.query("delete FROM patient WHERE fio = 'test'");
    });
      
    it("data found", async () => {
        const result = [{
            fio       : 'test', 
            telephone : 'telephoneTest', 
            address   : 'addressTest', 
            doctor    : 'Иванов И.А.',
        }]

        const response = await request(app)
            .get('/search/listClient')
            .query({ name: "tes" })
        
        assert.strict(response.body, result)
    });

    it("data not found", async () => {
        const response = await request(app)
            .get('/search/listClient')
            .query({ name: "not" })
        
        assert.strict(response.body, [])
    });
});

// Тестирование добавления клиента
describe('endpoint /edit/repurposing', function() {
    after(() => {
        connection.query("delete FROM patient WHERE fio = 'test'");
    });

  it('add client', async () => {
    const data = { name: 'test', telephone: "22-22-22", address: "address", doctor: "1", disease: "1"}
    const response = await request(app)
      .post('/add/patient')
      .send(data);
    
    assert.deepEqual(response.status, 200);
  });
});

// Тестирование записи на прием
describe('endpoint /edit/record', function() {
    before( async () => {
        const data = { name: 'test', telephone: "22-22-22", address: "address", doctor: "1", disease: "1"}
        const response = await request(app)
            .post('/add/patient')
            .send(data);
    });

    after(() => {
        connection.query("delete FROM patient WHERE fio = 'test'");
    });

    it('execute client record', async () => {
        const idTest = await connection.query("select id FROM patient WHERE fio = 'test'")
        const data = {
            nameId: idTest.rows[0].id,
            data  : { '1': [ '2023-12-25' ] }
        }

        const response = await request(app)
        .post('/edit/record')
        .send(data);
        
        assert.deepEqual(response.status, 200);
    });
});

// Изменение специальности врача
describe('endpoint /edit/repurposing', function() {
    before( async () => {
        const data = { specialist: '1', name: "test", telephone: "44-44-44"}
        const response = await request(app)
            .post('/add/doctor')
            .send(data);
    });

    after(() => {
        connection.query("delete FROM doctor WHERE fio = 'test'");
        process.exit(1)
    });

    it('change of specialization', async () => {
        const data = { special: '1', fio: 'test' }

        const response = await request(app)
            .post('/edit/repurposing')
            .send(data);
        
        assert.deepEqual(response.status, 200);
    });
});
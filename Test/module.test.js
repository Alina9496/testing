const nock   = require('nock')
const axios  = require('axios')
const expect = require('chai').expect

// Тестирование поисковой строки
describe("endpoint /search/listClient", function(){

    it('data found', async () => {
        const data = [{ id: 1, fio: 'name', telephone: "22-22-22", address: "address", doctor: "doctor"}]
        nock('https://localhost:3000')
            .get('/search/listClient')
            .query({ name: "name" })
            .reply(200, data);

        axios.get('https://localhost:3000/search/listClient').then(response => {
            expect(response.status).to.equal(200);
        })

        nock.cleanAll();
      })

      it('data not found', async () => {
        const data = []
        nock('https://localhost:3000')
            .get('/search/listClient')
            .query({ name: "name" })
            .reply(200, data);

        axios.get('https://localhost:3000/search/listClient').then(response => {
            expect(response.status).to.equal(200);
        })

        nock.cleanAll();
      })
});

// Тестирование добавления клиента
describe("endpoint /add/patient", function(){

    it('add client', async () => {
        const request = [{ name: 'name', telephone: "22-22-22", address: "address", doctor: "1", disease: "1"}]

        nock('https://localhost:3000')
            .post('/add/patient', request)
            .reply(200);

        axios.get('https://localhost:3000/add/patient').then(response => {
            expect(response.status).to.equal(200);
        })

        nock.cleanAll();
      })
});

// Тестирование записи на прием
describe("endpoint /edit/record", function(){

    it('execute client record', async () => {
        const request = {
            nameId: '20',
            data  : { '1': [ '2023-12-25' ] }
        }

        nock('https://localhost:3000')
            .post('/edit/record', request)
            .reply(200);

        axios.get('https://localhost:3000/edit/record').then(response => {
            expect(response.status).to.equal(200);
        })

        nock.cleanAll();
      })
});

// Изменение специальности врача
describe("endpoint /edit/repurposing", function(){

    it('change of specialization', async () => {
        const request = [{ special: 1, fio: 'test'}]
        nock('https://localhost:3000')
            .post('/edit/repurposing', request)
            .reply(200);

        axios.get('https://localhost:3000/edit/repurposing').then(response => {
            expect(response.status).to.equal(200);
        })

        nock.cleanAll()
      })
});
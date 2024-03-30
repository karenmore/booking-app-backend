const request = require('supertest');
const app = require('../app');

let id;
let token;

beforeAll(async () => {
    const res = await request(app).post('/users/login').send({
        email: "test@gmail.com",
        password: "test12345",
    });

    token = res.body.token;
});

test('GET /hotels should bring all the hotels', async() => {
    const res = await request(app)
    .get('/hotels')
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  
});

test('POST /hotels should create the hotels', async() => {
    const body = {
        name: "Segundo Hotel prueba",
        description: "El mejor Hotel de la ciudad",
        Price: "1000.50",
        Address: "En la esquna de la plaza Roma",
        lat: "11145241",
        lon: "56666565",
        cityId: 8
    }
    const res = await request(app).post('/hotels')
        .send(body)
        .set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
  
});

test('GETONE /hotels/:id should create the hotels by the id', async() =>{
    const res = await request(app).get(`/hotels/${id}`)
    id = res.body.id
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
});

test('PUT /hotels/:id should update the hotel by id',async() => {
    const body = {
            lat:"48.875838090473664",
            lon:"2.300348641089383"
    }
    const res = await request(app).put(`/hotels/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
});

test('DELETE /hotels/:id should delete the hotel by id', async() => {
    const res = await request(app).delete('/hotels/'+id)
    .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);

});
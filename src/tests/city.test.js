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
})

test('POST /cities should create the cities', async() => {
    const body = {
        name: "Buenos Aires prueba 3",
        country: "Argentina",
        countryId: "AR"
    }

    const res = await request(app).post('/cities').send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined()
    expect(res.body.name).toBe(body.name);
});

test('GETONE /cities/:id should bring a city by the id', async() => {
    const res = await request(app).get(`/cities/${id}`)
    id = res.body.id
    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
});

test('GET /cities should bring the cities', async() => {
    const res = await request(app).get('/cities')
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  
});


test('PUT /cities/:id should update the city by id', async() =>{
    const body = {
        name: "Buenos Aires prueba 4"
    }
    const res = await request(app).put(`/cities/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
});


test('DELETE /cities/:id should delete the city by id', async () => {
    const res = await request(app).delete(`/cities/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});
const request = require('supertest')
const app = require('../app');

let id;
let token;

beforeAll(async() => {
    const res = await request(app).post('/users/login').send({
        email: "test@gmail.com",
        password: "test12345",
    })

    token = res.body.token
});

test('GET /should bring all the reviews', async() => {
    const res = await request(app).get('/reviews')
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
});

test('POST /should create the reviews', async() => {

    const body = {
        rating: 5,
        comment: "Excelente servicio",
        hotelId: "2"
    };

    const res = await request(app).post('/reviews').send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();

});

test('PUT /bookings/:id should update the reviews', async() => {
    const body = {
            rating: 4
    }
    const res = await request(app).put(`/reviews/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
});

test('DELETE /bookings/:id should delete the reviews by the id', async () => {
    const res = await request(app).delete(`/reviews/${id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
});
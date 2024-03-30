const request = require('supertest');
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


test( 'GET /bookings Hotel reservations should be returned per user', async() => {
    const res = await request(app).get('/bookings').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /bookings You should create the users reservations, they must be logged in', async() => {
    const body = {
        checkIn: "03/24/2024",
        checkOut: "03/25/2024",
        hotelId: "2"
    }
    const res = await request(app).post('/bookings')
        .send(body)
        .set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

test('GETONE /bookings/:id bring reservations by id', async() => {
    const res = await request(app).get(`/bookings/${id}`).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(200);
});

test('PUT /bookings/:id should update the reservations by id', async() => {
    const body = {
        "checkIn": "04/29/2024",
        "checkOut": "04/30/2024"
    }
    const res = await request(app).put(`/bookings/${id}`).send(body).set('Authorization', `Bearer ${token}`)
    id = res.body.id
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
});

test('DELETE /bookings/:id should eliminate reservations by id', async () => {
    const res = await request(app).delete(`/bookings/${id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
})
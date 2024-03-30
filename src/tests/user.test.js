const request = require('supertest');
const app = require('../app');

let id;
let token;

test('POST /users should create the users', async() => {
    const body = {
        firstName: "Karen",
        lastName: "Moreno",
        email: "karen123@gmail.com",
        password: "karen123",
        gender: "FEMALE"
    }

    const res = await request(app).post('/users').send(body);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe(body.firstName);
    expect(res.body.id).toBeDefined()
});

test('POST /users/login should log in', async() => {
    const body = {
        email: "karen123@gmail.com",
        password: "karen123"
    }

    const res = await request(app).post('/users/login').send(body);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
});

test('GET /users should bring all the created users', async() => {
    const res = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  
});

test('PUT /users/:id should update the user', async () => {
    const body = {
        firstName: "Karen Actualizado"
    }
    const res = await request(app)
        .put(`/users/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        expect(res.body.firstName).toBe(body.firstName);
});

test('POST /users/login tests with invalid credentials', async() => {
    const body = {
        email: "karen1234@gmail.com",
        password: "karen123456"
    }

    const res = await request(app).post('/users/login').send(body);
    expect(res.status).toBe(401);
});

test('DELETE /users/:id should delete the user by passing the id', async () => {
    const res = await request(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
});
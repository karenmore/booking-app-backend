const request = require('supertest')
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

test('GET /images  ', async() => {
    const res = await request(app)
        .get('/images')
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  
});

test('Debería cargar una imagen con datos adicionales correctamente', async () => {
  const filePath = 'C:/Users/karen/Documents/Modulo-Back-end/ProyectoFinalBackend/hotels-app/src/public/descarga.jpg'; // Ruta al archivo de imagen
  const hotelId = '4';

  const res = await request(app)
    .post('/images')
    .set('Authorization', `Bearer ${token}`)
    .field('hotelId', hotelId) 
    .attach('image', filePath);

  expect(res.status).toBe(201);
});

test('Debería eliminar una imagen correctamente', async () => {
  const id = '34'; 

  const res = await request(app)
    .delete(`/images/${id}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
});
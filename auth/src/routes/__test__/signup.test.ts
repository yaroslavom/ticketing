import request from "supertest";

import app from "../../app";

it('Return a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('Return a 400 with an invalid email', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test',
        password: 'password'
    })
    .expect(400);
});

it('Return a 400 with an invalid password', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test',
        password: 'pass'
    })
    .expect(400);
});

it('Return a 400 with missing email or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com' })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({ password: 'password' })
        .expect(400);
});


it('Dissalows duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('Sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})
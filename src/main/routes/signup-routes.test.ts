import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  it('Should return 200 on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({ 
        name: 'Rafael',
        email: 'jordao.jardim@test.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  });
});
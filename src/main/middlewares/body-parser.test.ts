import request from 'supertest'
import app from '../config/app'

describe('Body parser middleware', () => {
  app.post('/test_body_parser', (req, res) => {
    res.send(req.body)
  })
  it('Should parse body as JSON', async () => {
    await request(app)
      .post('/test_body_parser')
      .send({name: 'Rafael'})
      .expect({name: 'Rafael'})
  });
});
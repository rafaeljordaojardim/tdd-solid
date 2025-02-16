import request from 'supertest'
import app from '../config/app'

describe('CORS middleware', () => {
  app.get('/test_cors', (req, res) => {
    res.send()
  })
  it('Should parse body as JSON', async () => {
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  });
});
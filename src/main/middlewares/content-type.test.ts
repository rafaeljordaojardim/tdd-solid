import request from 'supertest'
import app from '../config/app'

describe('Content Type middleware', () => {
  app.get('/test_content_type', (req, res) => {
    res.send('')
  })
  it('Should return default content type as json', async () => {
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
      
  });

  app.get('/test_content_type_xml', (req, res) => {
    res.type('xml')
    res.send('')
  })
  it('Should return xml content type when forced', async () => {
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
      
  });
});
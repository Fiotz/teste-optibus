const request = require('supertest');
const app = require('../../app');

describe('API', () => {
    it('GET /reports/short-report', () => {
        return request(app).get('/reports/short-report')
            .expect(200)
            .then((response) => {
            })
    });
});
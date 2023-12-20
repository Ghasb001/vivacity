import dotenv from 'dotenv';
dotenv.config();
import Pool from './db';
import request from 'supertest';
import app from './index';

describe('Initial test to confirm that Jest is working', () => {
  test('should be 2', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('Test Express Server Routes', () => {
  test('GET / should connect', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /awesome/applicant', async () => {
    const response = await request(app).get('/awesome/applicant');
    expect(response.status).toBe(200);
  });

  test('GET /hobbies', async () => {
    const response = await request(app).get('/hobbies');
    expect(response.status).toBe(200);
  });

  test('PATCH /hobbies no params', async () => {
    // No params error catch
    const response = await request(app).patch('/hobbies');
    expect(response.status).toBe(500);
  });

  test('PATCH /hobbies with params', async () => {
    // No params error catch
    await request(app).delete('/hobbies?hobby=sleep');
    const response = await request(app).patch('/hobbies?hobby=sleep');
    expect(response.status).toBe(200);
  });

  test('DELETE /hobbies with params', async () => {
    // No params error catch
    const test = await request(app).patch('/hobbies?hobby=coffee');
    const del = await request(app).delete('/hobbies?hobby=coffee');
    expect(del.status).toBe(204);
  });

  test('GET /hired', async () => {
    // currently no hired status
    const response = await request(app).get('/hired');
    expect(response.status).toBe(500);
  });

  test('POST /hired', async () => {
    // currently no hired status
    const response = await request(app).post('/hired?hired=true&notes=This guy is great!');
    expect(response.status).toBe(201);
    // clear the table for the next rounds of testing
    Pool.query("DROP TABLE IF EXISTS hired;")
  });

});

describe("Can make db queries", function () {
  test("Applicant Query Accesses data", async () => {
    return Pool.query('SELECT * FROM applicant')
      .then((data: any) => {
        expect(data.rows[0].applicant_name).toBe('Guillermo O. Hasbun Jr.');
      })
      .catch(err => console.log(err))
  });

  test("Hobby Query Accesses data", async () => {
    return Pool.query('SELECT * FROM hobbies')
      .then((data: any) => {
        expect(data.rows[0].hobby).toBe('Fishing');
      })
      .catch(err => console.log(err))
  });

  test("Hobby Query Returns an Array", async () => {
    return Pool.query(`
      SELECT ARRAY(
        SELECT hobby
        FROM hobbies
    );`)
      .then((data: any) => {
        expect(Array.isArray(data.rows[0].array)).toBe(true);
      })
      .catch(err => console.log(err))
  });
});

afterAll((done) => {
  Pool.end();
  done();
  console.log(request)
});
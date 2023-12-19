import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
// DBMS connection imports
import Pool from './db';

dotenv.config();

const app: Express = express();

// Parse JSON payloads
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get('/awesome/applicant', (req: Request, res: Response) => {
  Pool.query("SELECT * from applicant;")
    .then((data: any) => res.send(data.rows).status(201))
    .catch((err: any) => {
      console.log(err);
      res.sendStatus(500)
    })
})

app.get('/hired', async (req: Request, res: Response) => {
  Pool.query("SELECT * from hired;")
    .then((data: any) => res.send(data.rows).status(201))
    .catch((err: any) => res.status(500).send('There is no applicant hiring status at this time'))
})

app.post('/hired', async (req: Request, res: Response) => {
  //params should be {hired: boolean, text: string representing notes}
  let properParams: boolean = Object.values(req.query).length === 2;
  if (!properParams) { res.status(500).send('Please check query parameters'); return; }
  console.log(properParams)
  Pool.query(`
  DROP TABLE IF EXISTS hired;
  CREATE TABLE hired(hired_status BOOLEAN, notes TEXT);
  INSERT INTO hired(hired_status, notes) VALUES(${req.query.hired}, '${req.query.notes}');
  `)
    .then(() => res.status(200).send('Applicant Status has been updated!'))
    .catch((err: any) => res.sendStatus(500))
})

app.get('/hobbies', async (req: Request, res: Response) => {
  Pool.query("SELECT hobby from hobbies;")
    .then((data: any) => res.send(data.rows).status(201))
    .catch((err: any) => res.status(500).send('There is no applicant hiring status at this time'))
})

app.patch('/hobbies', async (req: Request, res: Response) => {
  //add a hobby param as {hobby: string}
  if (!req.query.hobby) {res.status(500).send('Please check query parameters'); return;}
  Pool.query(`INSERT INTO hobbies(hobby) VALUES ('${req.query.hobby}');`)
    .then(() => res.status(200).send('Hobby has been added!'))
    .catch((err: any) => res.sendStatus(500))
})


const port = process.env.PORT || 1128;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
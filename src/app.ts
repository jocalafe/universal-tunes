import dotenv from 'dotenv';
import express from 'express';
import * as tunesController from './tunes/controller';

dotenv.config();

const app = express();
const port = 3000;

app.get('/tracks', tunesController.getTracks);

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

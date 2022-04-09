import express from 'express';
import { initServer } from 'openwanderer-server';

const app = express();
app.use(express.static('public'));
initServer(app);

app.listen(3000);

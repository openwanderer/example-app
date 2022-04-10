import express from 'express';
import { initOWServer } from 'openwanderer-server';

const app = express();
app.use(express.static('public'));
const { initDao, panoRouter } = initOWServer(app);
app.use('/panorama', initDao, panoRouter);

app.listen(3000);

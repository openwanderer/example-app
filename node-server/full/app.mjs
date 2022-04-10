import express from 'express';
import { initOWServer } from 'openwanderer-server';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import db from 'openwanderer-server/db/index.mjs';
import fetch from 'node-fetch';

const app = express();

const pgSession = connectPgSimple(expressSession);

app.use(express.static('public'));

const { initDao, panoRouter } = initOWServer(app);
app.use('/panorama', initDao, panoRouter);

app.listen(3000);

app.use(expressSession({
    store: new pgSession({
        pool: db
    }),
    secret: 'BinnieAndClyde',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));

// Sample login route, in a real app you'd do some authentication against a
// database, here it lets you in with username admin, password admin
// You must return userid, username and isadmin fields in the JSON
app.post('/user/login', (req, res) => {
    if(req.body.username == 'admin' && req.body.password == 'admin') {
        const user = {
            userid: 1,
            username: 'admin',
            isadmin: 1
        };
        req.session.user = user;
        res.json(user);
    } else {
        res.status(401).json({error: 'Invalid login'});
    }
});

// GET login route must return the current user as a JSON object containing
// userid, username and isadmin fields, or 401 if not logged in
app.get('/user/login', (req, res) => {
    if(req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({error: 'Not logged in'});
    }
});

// Sample logout route
app.post('/user/logout', (req, res) => {
    req.session = null;
    res.json({success: 1});
});

// Sample signup route
app.post('/user/signup', (req, res) => {
    res.status(400).json({error: 'Signup functionality not implemented, please login with username admin, password admin'});
});

// Nominatim proxy
app.get('/nomproxy', async(req, res) => {
     const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${req.query.q}`, {         
        headers: {             
            'User-Agent': 'OpenWanderer test app',             
            'Referer': 'localhost'         
        }     
    });     

    res.set({'Content-Type': 'application/json'});     
    nominatimResponse.body.pipe(res); 
});
        
app.listen(3000);

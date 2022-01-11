import owServer from 'openwanderer-server';
import express from 'express';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import db from 'openwanderer-server/db/index.mjs';

const pgSession = connectPgSimple(expressSession);

// openwanderer-server exports a standard Express app object
owServer.use(express.static('public'));

owServer.use(expressSession({
    store: new pgSession({
        pool: db
    }),
    secret: 'BinnieAndClyde',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    createTableIfMissing: true,
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));

// Sample login route, in a real app you'd do some authentication against a
// database, here it lets you in with username admin, password admin
// You must return userid, username and isadmin fields in the JSON
owServer.post('/user/login', (req, res) => {
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
owServer.get('/user/login', (req, res) => {
    if(req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({error: 'Not logged in'});
    }
});

// Sample logout route
owServer.post('/user/logout', (req, res) => {
    req.session = null;
    res.json({success: 1});
});

// Sample signup route
owServer.post('/user/signup', (req, res) => {
    res.status(400).json({error: 'Signup functionality not implemented, please login with username admin, password admin'});
});

owServer.listen(3000);

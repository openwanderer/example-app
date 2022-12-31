import 'dotenv/config';

import express from 'express';
import expressSession from 'express-session';
import connectPg from 'connect-pg-simple';
const pgSession = connectPg(expressSession);
import fetch from 'node-fetch';
import fileUpload from 'express-fileupload';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserDao  from './dao/user.mjs';
import { Strategy as OpenStreetMapStrategy } from 'passport-openstreetmap';

import CustomAsyncSessionTokenStore from './asyncsessiontokenstore.js';
import { initOWServer } from 'openwanderer-server';

import mapRouter from './routes/map.mjs';
import userRouter from './routes/user.mjs';

import auth from './middleware/authcheck.mjs';
const { loginCheck, adminCheck, ownerOrAdminCheck } = auth;

const app = express();
app.set('trust proxy', 1);

app.use(express.static('public'));


const { initDao, panoRouter } = initOWServer(app);
app.use('/panorama', initDao);


app.use('/map', mapRouter);

import cors from 'cors';
app.use(cors());
import db from './db/index.mjs';

app.use(expressSession({
    store: new pgSession({
        pool: db
    }), 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    proxy: true, 
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async(username, password, done) => {
    const dao = new UserDao(db);
    try {
        const user = await dao.login(username, password);
        if(user === null) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    } catch(e) {
        return done(e);
    }
}));

passport.use(new OpenStreetMapStrategy({
    consumerKey:process.env.OSM_KEY,
    consumerSecret:process.env.OSM_SECRET,
    callbackUrl: '/osm/callback',
    requestTokenURL: 'https://www.openstreetmap.org/oauth/request_token',
    accessTokenURL: 'https://www.openstreetmap.org/oauth/access_token',
    userAuthorizationURL: 'https://www.openstreetmap.org/oauth/authorize',
    requestTokenStore: new CustomAsyncSessionTokenStore({key: 'oauth'})
    },
    (token, tokenSecret, profile, done) => {
    return done(null, { userid: `o${profile.id}`, username: profile.displayName, isadmin: 0, osm: true });
    }
));

passport.serializeUser((user, done) => {
    done(null, { id: user.userid, osmuser: user.osm ? user.username : null } );
});

passport.deserializeUser(async(user, done) => {
    try {
        if(user.osmuser) { 
            done(null, {userid: user.id, username: user.osmuser, isadmin: 0, osm: true });
        } else { 
            const userDao = new UserDao(db);
            const u = await userDao.findUserById(user.id);
            done(null, u);
        }
    } catch(e) {
        console.log(e);
        done(e);
    }
});
 
app.use('/user', userRouter);
app.post('/user/login', (req, res, next) => {
    if(req.body.username == "" || req.body.password == "") {
        res.status(400).json({error: 'Missing login details.'});
    } else {
        next();
    }
}, passport.authenticate('local'), (req, res, next) => {
    res.json(req.user);
});

app.post(['/panorama/:id(\\d+)/move',
        '/panorama/:id(\\d+)/rotate'], loginCheck, ownerOrAdminCheck);
app.delete('/panorama/:id', loginCheck, ownerOrAdminCheck);

app.post(['/panorama/upload',
        '/panorama/sequence/create'], loginCheck);

app.get('/panorama/unauthorised', adminCheck);
app.post('/panorama/moveMulti', adminCheck);

app.use('/panorama', panoRouter);

app.get('/osm/login', passport.authenticate('openstreetmap'));

app.get('/osm/callback', 
    passport.authenticate('openstreetmap', { failureRedirect: '/osm/login'}),
    (req, res) => {
        res.redirect('../..');
    }
);



app.get('/terrarium/:z(\\d+)/:x(\\d+)/:y(\\d+).png', async(req, res) => {
    const response = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${req.params.z}/${req.params.x}/${req.params.y}.png`); 
    res.set({'Content-Type': 'image/png'});
    response.body.pipe(res);
});

app.get('/nomproxy', async(req, res) => {

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${req.query.q}`, {
        headers: {
            'User-Agent': 'OpenTrailView 4',
            'Referer': 'https://opentrailview.org'
        }
    });
    res.set({'Content-Type': 'application/json'});
    response.body.pipe(res);
});

app.get('/geoapify/:z(\\d+)/:x(\\d+)/:y(\\d+).png', async(req, res) => {
    const resp = await fetch(`https://maps.geoapify.com/v1/tile/carto/${req.params.z}/${req.params.x}/${req.params.y}.png?&apiKey=${process.env.MAPS_API_KEY}`);
    res.set({'Content-Type': 'image/png'});
    resp.body.pipe(res);

});

app.listen(3000);

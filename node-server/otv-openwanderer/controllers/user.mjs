import validator from 'validator';
import UserDao from '../dao/user.mjs';

class UserController {

    constructor(db) {
        this.dao = new UserDao(db);
    }

    async logout(req, res) {
        req.session.user = null;
        req.session = null;
        res.json({loggedout: true});
    }

    async getLogin(req, res) {
        res.json(req.user ? req.user : {username: null, userid: 0, isadmin: 0});
    }

    async signup(req, res) {
        try {
            if(!req.body.username || !req.body.password) {
                res.status(400).json({error: 'Please enter a username and password.'});
            } else if (!validator.isEmail(req.body.username)) {
                res.status(400).json({error: 'Not a valid email address.'});
            } else if(req.body.password != req.body.ow_password2) {
                res.status(400).json({error: 'Passwords do not match.'});
            } else {
                const dbres = await this.dao.getUser(req.body.username);
                if(dbres !== null) {
                    res.status(400).json({error: 'This username is already taken.'});
                } else {
                    await this.dao.signup(req.body.username, req.body.password);
                    res.json({username: req.body.username});
                }
            }
        } catch(e) {
            res.status(500).json({error: e});
        }
    }
}

export default UserController;

export default {
    loginCheck(req, res, next) {
        if(req.user && req.user.userid) {    
            next();
        } else {
            res.status(401).json({error: "Must be logged in to perform this operation."});
        }
    },

    adminCheck(req, res, next) {
        if(req.user && req.user.isadmin === 1) {
            next();
        } else {
            res.status(401).json({error: "Must be administrator to perform this operation."});
        }
    },

    async ownerOrAdminCheck(req, res, next) {
        const panoInfo = await req.panoDao.findById(req.params.id);
        if(req.user.isadmin === 1 || (panoInfo && panoInfo.userid == req.user.userid)) {
            next();
        } else {
            res.status(401).json({error: "Not authorised to perform this operation."});
        }
    }
};

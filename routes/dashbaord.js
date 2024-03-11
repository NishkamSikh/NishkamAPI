const router = require('express').Router();
const pool = require('../db');
const authorization = require('../db/middleware/authorization');

router.get('/', authorization, async(req, res) => {
    try {
        
        //req.user has the payload
        const user = await db.query("SELECT email FROM users WHERE email = $1", [req.email]);
        res.json(user.rows[0]);

    } catch (err) {
        res.status(500).json('Server Error');
    }
});
module.exports = router;
const router = require('express').Router();

router.get("/",(req,res) => {
    res.send("server is active");
})

module.exports = router
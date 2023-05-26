const router = require("express").Router();
const controller = require("../controllers/userController.js");

router.get("/", (req, res) => {
  res.send("server is active");
});

module.exports = router;

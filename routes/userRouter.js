const router = require("express").Router();
const controller = require("../controllers/userController.js");

router.get("/", (req, res) => {
  res.send("server is active");
});
router.post("/login",(req,res)=>{});
router.post("/signup",(req,res)=>{});
router.post("/logout",(req,res)=>{})
router.put("/update-user/:id",(req,res)=>{});
router.delete("/delete-user/:id",(req,res)=>{});

module.exports = router;

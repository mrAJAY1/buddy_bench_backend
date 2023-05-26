const router = require('express').Router();
const controller = require('../controllers/userController.js');

// Routes for authentication
router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/logout', controller.logout);

// Routes for user management
router.put('/update-user/:id', controller.updateUser);
router.delete('/delete-user/:id', controller.deleteUser);

// Default route
router.get('/', (req, res) => {
  res.send('Server is active');
});

module.exports = router;

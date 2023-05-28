const router = require('express').Router();
const controller = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Routes for authentication
router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/logout', authMiddleware, controller.logout);

// Routes for user management
router.put('/update-user/:id', authMiddleware, controller.updateUser);
router.delete('/delete-user/:id', authMiddleware, controller.deleteUser);

// Default route
router.get('/', (req, res) => {
  res.send('Server is active');
});

module.exports = router;

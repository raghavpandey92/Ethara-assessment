const express = require('express');
const { getUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);

module.exports = router;

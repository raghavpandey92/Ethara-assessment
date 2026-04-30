const express = require('express');
const {
  addMember,
  createProject,
  getProjects,
  removeMember,
} = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.put('/:projectId/members', protect, adminOnly, addMember);
router.delete('/:projectId/members/:memberId', protect, adminOnly, removeMember);

module.exports = router;

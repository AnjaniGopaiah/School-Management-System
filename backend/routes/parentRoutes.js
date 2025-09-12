const express = require('express');
const router = express.Router();
const {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
  getParentDashboard
} = require('../controllers/ParentController');
const Parent = require('../models/Parent');
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect(['parent']), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user.id).populate('student');
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🛡️ Secure parent dashboard (only parent role can access)
router.get('/:id/dashboard', protect(['parent']), getParentDashboard);

// Admin or staff could have access to CRUD — add protect if needed
router.post('/', protect(['admin']), createParent);
router.get('/', protect(['admin']), getParents);
router.get('/:id', protect(['admin']), getParentById);
router.put('/:id', protect(['admin']), updateParent);
router.delete('/:id', protect(['admin']), deleteParent);

module.exports = router;

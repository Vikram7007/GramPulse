// routes/issues.js (पूर्ण updated – crash fix + order नीट)

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createIssue, 
  getIssues, 
  voteIssue, 
  getIssueById,
  approveIssue,
  rejectIssue,
  assignToGramSevak,
  getAllGramSevakIssues  // <--- हे function आहे आता
} = require('../controllers/issueController');

// 🔥 नवीन route - सर्व GramSevakIssue collection मधील data (admin साठी)
router.get('/gramsevek', getAllGramSevakIssues); // हे आधी ठेवा!

// बाकी specific routes
router.post('/', auth, createIssue);
router.get('/', getIssues);
router.post('/:id/vote', auth, voteIssue);

router.patch('/:id/approved', auth, approveIssue);
router.patch('/:id/rejected', auth, rejectIssue);
router.patch('/:id/in-progress', auth, assignToGramSevak);

// 🔥 शेवटी generic route (single issue by ID)
router.get('/:id', getIssueById);

module.exports = router;
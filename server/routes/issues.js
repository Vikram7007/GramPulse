// routes/issues.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer(); // important!
const { 
  createIssue, 
  getIssues, 
  voteIssue, 
  getIssueById,
  approveIssue,
  rejectIssue,
  assignToGramSevak,
  getAllGramSevakIssues
} = require('../controllers/issueController');

const { createGramSevakAssignedIssue,GramSevekStatusUpdate,GetAllGramsevekCompletedIssue } = require('../controllers/gramSevakController'); // correct

// Routes
router.get('/gramsevek', getAllGramSevakIssues);
router.get('/gramsevek/completed',GetAllGramsevekCompletedIssue)
router.patch('/gramsevek/:id/approval', createGramSevakAssignedIssue); // multer add केलं file साठी
router.patch('/gramsevek/:status/:id',GramSevekStatusUpdate)
router.post('/', auth, createIssue);
router.get('/', getIssues);
router.post('/:id/vote', auth, voteIssue);
router.patch('/:id/approved', auth, approveIssue);
router.patch('/:id/rejected', auth, rejectIssue);
router.patch('/:id/in-progress', auth, assignToGramSevak);
router.get('/:id', getIssueById);

module.exports = router;
const express = require('express');
const router = express.Router();
const { analyzeVideoController } = require('../controller/analyzeController');

/* POST /analyze - Analyze YouTube video */
router.post('/analyze', analyzeVideoController);


module.exports = router;

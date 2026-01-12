const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

router.get('/posts', optionalAuth, contentController.getPosts);
router.get('/posts/:idOrSlug', optionalAuth, contentController.getPost);
router.get('/categories', contentController.getCategories);
router.get('/events', optionalAuth, contentController.getEvents);

module.exports = router;

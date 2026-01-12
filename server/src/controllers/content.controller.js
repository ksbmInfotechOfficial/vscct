const wordpressService = require('../services/wordpress.service');

// Get Posts
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, per_page = 10, category } = req.query;
    const result = await wordpressService.getPosts(page, per_page, category);
    
    // If user not authenticated, limit content
    if (!req.user) {
      result.posts = result.posts.map(post => ({
        ...post,
        content: post.excerpt, // Only show excerpt for non-authenticated users
        isLocked: true,
      }));
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get Posts Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// Get Single Post
exports.getPost = async (req, res) => {
  try {
    const post = await wordpressService.getPost(req.params.idOrSlug);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // If user not authenticated, limit content
    if (!req.user) {
      post.content = post.excerpt;
      post.isLocked = true;
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
};

// Get Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await wordpressService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

// Get Events
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.query;
    const result = await wordpressService.getEvents(page, per_page);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

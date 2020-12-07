const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    isAuthenticated,
} = require('../middleware/auth');
const {
    isAdmin,
} = require('../validation');
const {
    getAllCategories,
    getCategory,
    postCategory,
    updateCategory,
} = require('../controllers/category');


// @Route            >   GET  /api/v1/category/
// @Description      >   Get all categories
// @Access Control   >   Public
router.get('/',
    getAllCategories
)

// @Route            >   GET  /api/v1/category/:category_id
// @Description      >   Get category
// @Access Control   >   Public
router.get('/:category_id',
    getCategory
)

// @Route            >   POST  /api/v1/category/:user_id
// @Description      >   Create category
// @Access Control   >   Admin
router.post('/:user_id',
    isAuthenticated,
    isAdmin,
    postCategory
)

// @Route            >   PUT  /api/v1/category/:user_id/:category_id
// @Description      >   Update category
// @Access Control   >   Admin
router.put('/:user_id/:category_id',
    isAuthenticated,
    isAdmin,
    updateCategory
)


module.exports = router;
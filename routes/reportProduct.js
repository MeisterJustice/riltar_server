const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    isAuthenticated,
    isAuthorized,
} = require('../middleware/auth');

const {
    getReports,
    postReport
} = require('../controllers/reportProduct');

const {
    isAdmin,
    isUserAlreadyInReport
} = require('../validation');

// @Route            >   GET  /api/v1/:user_id/:product_id/report
// @Description      >   Get all reports for a particular product
// @Access Control   >   Admin
router.get('/',
    isAuthenticated,
    isAdmin,
    getReports
)

// @Route            >   POST  /api/v1/:user_id/:product_id/report
// @Description      >   Report a product
// @Access Control   >   Private
router.post('/',
    isAuthenticated,
    isAuthorized,
    isUserAlreadyInReport,
    postReport
)



module.exports = router;
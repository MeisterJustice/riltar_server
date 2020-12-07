const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    signup,
    signin
} = require('../controllers/auth');
const {
    isUniquePhoneAndEmail,
    isUserDeletedOrSuspended
} = require('../validation');


// @Route            >   POST  /api/v1/auth/signup
// @Description      >   Register user
// @Access Control   >   Public
router.post('/signup',
    isUniquePhoneAndEmail,
    signup
);

// @Route            >   POST  /api/v1/auth/signin
// @Description      >   Login user
// @Access Control   >   Public
router.post('/signin',
    isUserDeletedOrSuspended, // checks if user has been banned or soft deleted
    signin
);

module.exports = router;
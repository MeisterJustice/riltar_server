const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    isAuthenticated,
    isAuthorized,
} = require('../middleware/auth');

const {
    getCoupons,
    postCoupon,
    updateCoupon,
    deleteCoupon,
    applyCoupon
} = require('../controllers/coupon');

const {
    isAdmin
} = require('../validation/index');



// @Route            >   GET  /api/v1/:user_id/coupon
// @Description      >   Get all coupons
// @Access Control   >   Admin
router.get('/',
    isAuthenticated,
    isAdmin,
    getCoupons
)

// @Route            >   GET  /api/v1/:user_id/coupon/
// @Description      >   Create coupon
// @Access Control   >   Admin
router.post('/',
    isAuthenticated,
    isAdmin,
    postCoupon
)

// @Route            >   GET  /api/v1/:user_id/coupon//:coupon_id
// @Description      >   Update coupon
// @Access Control   >   Admin
router.put('/:coupon_id',
    isAuthenticated,
    isAdmin,
    updateCoupon
)

// @Route            >   GET  /api/v1/:user_id/coupon//:coupon_id
// @Description      >   Delete coupon
// @Access Control   >   Admin
router.delete('/:coupon_id',
    isAuthenticated,
    isAdmin,
    deleteCoupon
)


module.exports = router;
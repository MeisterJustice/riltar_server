const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    isAuthenticated,
    isAuthorized,
} = require('../middleware/auth');
const {
    isAdmin,
    isGreaterSuspendDate,
    isSuperAdmin,
    isUniquePhoneAndEmail
} = require('../validation');
const {
    findAllUsers,
    createAdmin,
    suspendUser,
    removeUser,
    verifyBusiness,
    verifyIdentity,
    getAllProducts,
    deleteProductAsAdmin,
    getProductByReference,
    changeImageAndMakeProductLive,
    getOrderByReference,
    getOrders,
    getAllAdmins
} = require('../controllers/admin');


// @Route            >   GET  /api/v1/:user_id/admin/users
// @Description      >   Get all users
// @Access Control   >   Admin
router.get('/users',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    findAllUsers
);

// @Route            >   PUT  /api/v1/:user_id/admin/users/:customer_id/identification
// @Description      >   Verify identification
// @Access Control   >   Admin
router.put('/users/:customer_id/identification',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    verifyIdentity
);

// @Route            >   PUT  /api/v1/:user_id/admin/users/:customer_id/business
// @Description      >   Verify business
// @Access Control   >   Admin
router.put('/users/:customer_id/business',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    verifyBusiness
);

// @Route            >   PUT  /api/v1/:user_id/admin/users/:customer_id/suspend
// @Description      >   Suspend user
// @Access Control   >   Admin
router.put('/users/:customer_id/suspend',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    isGreaterSuspendDate,
    suspendUser
);

// @Route            >   PUT  /api/v1/:user_id/admin/users/:customer_id/remove
// @Description      >   Remove user
// @Access Control   >   Admin
router.put('/users/:customer_id/remove',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    removeUser
);

// @Route            >   GET  /api/v1/:user_id/admin/product
// @Description      >   Get all products
// @Access Control   >   Admin
router.get('/product',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    getAllProducts
)

// @Route            >   POST  /api/v1/:user_id/admin/reference
// @Description      >   Get product by reference
// @Access Control   >   Admin
router.post('/product/reference',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    getProductByReference
)

// @Route            >   PUT  /api/v1/:user_id/admin/product/:product_id
// @Description      >   Update product thumbnail and make live
// @Access Control   >   Admin
router.put('/product/:product_id',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    changeImageAndMakeProductLive
)

// @Route            >   DELETE  /api/v1/:user_id/admin/product/:product_id
// @Description      >   Delete product for admin
// @Access Control   >   Admin
router.delete('/product/:product_id',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    deleteProductAsAdmin
)


// @Route            >   GET  /api/v1/:user_id/admin/order
// @Description      >   Get all orders
// @Access Control   >   Admin
router.get('/order',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    getOrders
)

// @Route            >   POST  /api/v1/:user_id/admin/order/reference
// @Description      >   Get order by reference
// @Access Control   >   Admin
router.post('/order/reference',
    isAuthenticated,
    isAuthorized,
    isAdmin,
    getOrderByReference
)

// @Route            >   GET  /api/v1/:user_id/admin/superadmin
// @Description      >   Get all admins
// @Access Control   >   Super Admin
router.get('/superadmin',
    isAuthenticated,
    isAuthorized,
    isSuperAdmin,
    isUniquePhoneAndEmail,
    getAllAdmins
)

// @Route            >   POST  /api/v1/:user_id/admin/superadmin/create
// @Description      >   Create a new admin
// @Access Control   >   Super Admin
router.post('/superadmin/create',
    isAuthenticated,
    isAuthorized,
    isSuperAdmin,
    isUniquePhoneAndEmail,
    createAdmin
)


module.exports = router;    deleteProductAsAdmin

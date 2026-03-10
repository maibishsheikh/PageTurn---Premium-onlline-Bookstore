const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllOrders)
  .post(protect, createOrder);

router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;

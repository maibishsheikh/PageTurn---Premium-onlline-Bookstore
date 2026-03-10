const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.book}` });
      }
      if (book.stock < item.quantity && !book.isUpcoming) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${book.title}` });
      }

      orderItems.push({
        book: book._id,
        title: book.title,
        coverImage: book.coverImage,
        price: book.price,
        quantity: item.quantity
      });
      subtotal += book.price * item.quantity;

      // Update stock and sold count
      if (!book.isUpcoming) {
        book.stock -= item.quantity;
        book.soldCount += item.quantity;
        await book.save();
      }
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingCost = subtotal > 35 ? 0 : 4.99;
    const totalAmount = Math.round((subtotal + tax + shippingCost) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      isPaid: paymentMethod !== 'cod',
      paidAt: paymentMethod !== 'cod' ? Date.now() : undefined
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book', 'title coverImage author')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.book', 'title coverImage author');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book', 'title coverImage')
      .sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ success: true, count: orders.length, totalRevenue, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.status = req.body.status;
    if (req.body.status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

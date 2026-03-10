const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'server/uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpg|jpeg|png/;
        const mimetypes = /image\/jpeg|image\/png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only! (jpg/png)'));
        }
    }
});

// @route POST /api/orders/upload-payment
router.post('/upload-payment', upload.single('screenshot'), (req, res) => {
    if (req.file) {
        res.status(200).json({ imagePath: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// @route POST /api/orders
// @desc Create new order
router.post('/', async (req, res) => {
    try {
        const {
            user,
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus,
            paymentScreenshot,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        } else {
            const order = new Order({
                user,
                orderItems,
                shippingAddress,
                paymentMethod,
                paymentStatus: paymentMethod === 'COD' ? 'Pending' : (paymentStatus || 'Pending Verification'),
                paymentScreenshot,
                orderStatus: paymentMethod === 'COD' ? 'Processing' : 'Payment Verification Pending',
                deliveryEstimate: '2-3 Business Days',
                totalPrice,
                isPaid: paymentMethod !== 'COD' && paymentStatus === 'Success',
                paidAt: (paymentMethod !== 'COD' && paymentStatus === 'Success') ? Date.now() : undefined
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/orders/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

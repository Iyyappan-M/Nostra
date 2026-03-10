const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// @route GET /api/store
// @desc Get store details
router.get('/', async (req, res) => {
    try {
        const store = await Store.findOne();
        if (!store) {
            return res.status(404).json({ message: 'Store details not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route PUT /api/store
// @desc Update store details (Admin only - simplification for now)
router.put('/', async (req, res) => {
    try {
        let store = await Store.findOne();
        if (store) {
            store = await Store.findOneAndUpdate({}, req.body, { new: true });
        } else {
            store = await Store.create(req.body);
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

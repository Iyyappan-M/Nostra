const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route POST /api/chat/search
// @desc Search products via chatbot
router.post('/search', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const query = message.toLowerCase();
        let filter = {};

        // 1. Category Detection
        if (query.includes('men') && !query.includes('women')) {
            filter.category = 'Men';
        } else if (query.includes('women')) {
            filter.category = 'Women';
        } else if (query.includes('footwear') || query.includes('shoes') || query.includes('sneakers')) {
            filter.category = 'Footwear';
        } else if (query.includes('accessories') || query.includes('bag') || query.includes('watch')) {
            filter.category = 'Accessories';
        }

        // 2. Price Detection (e.g., "under 100", "below 500")
        const priceMatch = query.match(/(?:under|below|less than)\s*(\d+)/);
        if (priceMatch) {
            filter.price = { $lt: parseInt(priceMatch[1]) };
        }

        // 3. Keyword Detection (Name/Description)
        // Remove common words and focus on product keywords
        const keywords = query
            .replace(/show me|i want|find|search for|under \d+|below \d+|men|women/g, '')
            .trim()
            .split(' ')
            .filter(word => word.length > 2);

        if (keywords.length > 0) {
            filter.$or = [
                { name: { $regex: keywords.join('|'), $options: 'i' } },
                { description: { $regex: keywords.join('|'), $options: 'i' } }
            ];
        }

        // Search the database
        const products = await Product.find(filter).limit(5);

        if (products.length > 0) {
            res.json({
                reply: `I found ${products.length} products for you!`,
                products: products
            });
        } else {
            res.json({
                reply: "Sorry, I couldn't find any products matching that. Try searching for things like 'Black jackets' or 'Women dresses under 100'.",
                products: []
            });
        }

    } catch (error) {
        console.error('CHAT SEARCH ERROR:', error);
        res.status(500).json({ message: 'Chat service temporarily unavailable' });
    }
});

module.exports = router;

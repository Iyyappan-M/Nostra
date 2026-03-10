const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Store Context for LLM
const STORE_CONTEXT = `
You are "Nostra Assistant", an AI fashion expert for Nostra, a premium MERN e-commerce platform.
Your goals:
1. Help with navigation: Home (index.html), Collection (collection.html), Contact (contact.html), Login (login.html), Subscription (subscribe.html).
2. Subscription Plans: 
   - Basic (1 Month): ₹200
   - Popular (3 Months): ₹400
   - Professional (6 Months): ₹600
   - Best Value (Annual): ₹1000.
3. Order Help: Users can see orders in orders.html after login.
4. Product Info: We sell premium Men, Women clothes, Footwear, and Accessories.
5. Voice: Professional, helpful, stylish, and concise.

If the user asks for products, try to match categories (Men, Women, Footwear, Accessories). 
Always refer to the website in a premium way.
`;

// @route POST /api/chat/ask
// @desc Chat with Gemini AI
router.post('/ask', async (req, res) => {
    try {
        const { message, chatHistory } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                reply: "Gemini API Key is missing in the backend. Please add it to your .env file!",
                error: true 
            });
        }

        // Fetch products if user is asking about item types
        let products = [];
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('show') || lowerMsg.includes('find') || lowerMsg.includes('buy') || lowerMsg.includes('product') || lowerMsg.includes('shirt') || lowerMsg.includes('dress')) {
            let filter = {};
            if (lowerMsg.includes('men')) filter.category = 'Men';
            else if (lowerMsg.includes('women')) filter.category = 'Women';
            else if (lowerMsg.includes('footwear') || lowerMsg.includes('shoe')) filter.category = 'Footwear';
            
            products = await Product.find(filter).limit(3);
        }

        const prompt = `${STORE_CONTEXT}\n\nUser: ${message}\nAssistant:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            reply: text,
            products: products
        });

    } catch (error) {
        console.error('GEMINI CHAT ERROR:', error);
        res.status(500).json({ reply: "I'm having trouble connecting to my creative brain right now. Try again in a bit!" });
    }
});

module.exports = router;

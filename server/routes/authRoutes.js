const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is missing from .env');
        throw new Error('Server configuration error');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    console.log('--- Registration Started ---');
    console.log('Request Body:', req.body);

    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            console.log('Validation Failed: Missing fields');
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Validation Failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        console.log('Attempting to save user to MongoDB...');
        const user = new User({
            name,
            email,
            password,
        });

        await user.save();
        console.log('User saved successfully:', user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log('--- Login Started ---');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            console.log('Login successful for:', email);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted: user.profileCompleted,
                token: generateToken(user._id),
            });
        } else {
            console.log('Login failed: Invalid credentials');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// @route PUT /api/auth/profile
router.put('/profile', async (req, res) => {
    console.log('--- Profile Completion Started ---');
    try {
        const { userId, gender, ageCategory, preference } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.gender = gender;
        user.ageCategory = ageCategory;
        user.preference = preference;
        user.profileCompleted = true;

        await user.save();
        console.log('Profile completed for user:', user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
            gender: user.gender,
            ageCategory: user.ageCategory,
            preference: user.preference,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('PROFILE ERROR:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

module.exports = router;

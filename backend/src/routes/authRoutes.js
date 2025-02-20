const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(201)
            .set('Authorization', `Bearer ${token}`)
            .json({
                message: 'User created successfully',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                },
            });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found:", email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.hash(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        user.isLoggedIn = true;
        await user.save();
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isLoggedIn: user.isLoggedIn,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/logout', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isLoggedIn = false;
        await user.save();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET ;

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
                },
            });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;

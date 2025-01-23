const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

router.get('/userprofile/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; 

    try {
        if (req?.params?.id !== id) { 
            return res.status(403).json({ message: 'Access Denied. Unauthorized.' });
        }
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/userprofile', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.delete('/userprofile/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);   
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted.' });
    } catch (error) {   
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Server error.' });
    }
});



module.exports = router;



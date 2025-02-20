const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/Request');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

router.post('/friend-requests/:receiverId', authenticateToken, async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.receiverId;
        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ],
            status: { $ne: 'rejected' }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId
        });

        await friendRequest.save();

        res.status(201).json({ 
            message: 'Friend request sent', 
            request: friendRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error sending friend request', 
            error: error.message 
        });
    }
});

router.put('/friend-requests/:requestId/accept', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.params.requestId;
        const friendRequest = await FriendRequest.findOne({
            receiver: requestId,
            status: 'pending'
        });

        console.log(friendRequest);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.receiver }
        });

        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ 
            message: 'Friend request accepted', 
            request: friendRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error accepting friend request', 
            error: error.message 
        });
    }
});

router.get('/friend-requests/received', authenticateToken, async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            status: 'pending'
        });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching friend requests', 
            error: error.message 
        });
    }
});

module.exports = router;
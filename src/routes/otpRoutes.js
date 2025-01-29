const express = require('express');
const Otp = require('../models/otp');
const otpGenerator = require('../utils/otpGenerator');
const { sendOTPEmail } = require('../config/email');


const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    const otp = otpGenerator();
  
    try {
      const otpEntry = new Otp({ email, otp });
      await otpEntry.save();
      await sendOTPEmail(email, otp);
  
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      res.status(500).json({ error: "Error sending OTP" });
    }
  });
  

  router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
  
    try {
      const otpEntry = await Otp.findOne({ email, otp });
  
      if (!otpEntry) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      res.status(200).json({ message: "OTP verified successfully" });
  
      await Otp.deleteOne({ _id: otpEntry._id });
    } catch (error) {
      res.status(500).json({ error: "Error verifying OTP" });
    }
  });
  


module.exports = router;

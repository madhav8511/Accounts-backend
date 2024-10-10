const twilio = require('twilio');
const express = require('express');

const accountSid = `${process.env.TWILIO_ACCOUNTSID}`;  // Replace with your Twilio Account SID
const authToken = `${process.env.TWILIO_AUTHTOKEN}`;    // Replace with your Twilio Auth Token

const client = new twilio(accountSid, authToken);

const router = express.Router();

router.post('/send-sms', (req, res) => {
    const { to, amount } = req.body;  // Get recipient phone number and message from request body
  
    // Send SMS using Twilio
    client.messages
      .create({
        body: `Hi, This is a gentle remainder that you have to a sum of Rs. ${amount} to Ganapati General Store as your left out balance`,   // The message content
        from: `${process.env.TWILIO_NUMBER}`,  // Your Twilio phone number (Replace with your Twilio number)
        to: to
      })
      .then(message => {
        res.status(200).json({ success: true, sid: message.sid });
      })
      .catch(err => {
        console.error('Error sending SMS:', err);
        res.status(500).json({ success: false, error: 'Failed to send SMS' });
      });
  });

exports.router = router;
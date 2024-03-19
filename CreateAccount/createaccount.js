// JavaScript source code
// app.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/novo_social_network', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phoneNumber: String,
    zipCode: String,
});

const User = mongoose.model('User', userSchema);

// User Registration
app.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if passwords match
        if (req.body.password !== req.body.repeatPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check phone number format (assuming US format: XXX-XXX-XXXX)
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(req.body.phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Check zip code format (assuming US format: XXXXX or XXXXX-XXXX)
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(req.body.zipCode)) {
            return res.status(400).json({ message: 'Invalid zip code format' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login, Protected route, Authenticate token middleware - same as previous code

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

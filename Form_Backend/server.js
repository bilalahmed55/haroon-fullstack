// server.js
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Record from './models/Record.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all requests
app.use(cors());

// More specific CORS settings as middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// For debugging requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Could not connect to MongoDB Atlas:', err);
        console.error('Please check your MongoDB URI in the .env file');
    });

// Validation middleware
const validateRecord = (req, res, next) => {
    const { name, email, phoneNumber } = req.body;
    const errors = [];

    // Name validation
    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Email validation
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    // Phone number validation
    if (!phoneNumber || phoneNumber.trim() === '') {
        errors.push('Phone number is required');
    } else if (phoneNumber.length < 5) {
        errors.push('Phone number must be at least 5 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Test route to check server connectivity
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working correctly',
        timestamp: new Date()
    });
});

// CRUD Routes
// Get all records
app.get('/api/records', async (req, res) => {
    try {
        const records = await Record.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create a new record - temporarily bypass validation for testing
app.post('/api/records', async (req, res) => {
    console.log('POST request to /api/records');
    console.log('Request body:', req.body);

    try {
        // Check if the body is empty or not well-formed
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Empty request body or invalid JSON format'
            });
        }

        const record = new Record({
            name: req.body.name || 'Default Name',
            email: req.body.email || 'default@example.com',
            phoneNumber: req.body.phoneNumber || '0000000000'
        });

        const savedRecord = await record.save();
        console.log('Record saved successfully:', savedRecord);

        res.status(201).json({
            success: true,
            message: 'Record created successfully',
            data: savedRecord
        });
    } catch (error) {
        console.error('Error saving record:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get a record by ID
app.get('/api/records/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        res.json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update a record
app.put('/api/records/:id', validateRecord, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber
            },
            { new: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        res.json({
            success: true,
            message: 'Record updated successfully',
            data: updatedRecord
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete a record
app.delete('/api/records/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const deletedRecord = await Record.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            });
        }

        res.json({
            success: true,
            message: 'Record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Database connection
mongoose.connect('mongodb://localhost:27017/woodworks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schemas
const sellerSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
});

const Seller = mongoose.model('Seller', sellerSchema);
const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Auth middleware
const authenticateSeller = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Authentication required');

        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.seller = await Seller.findById(decoded.sellerId);
        if (!req.seller) throw new Error('Seller not found');
        
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Routes
app.post('/api/sellers/login', async (req, res) => {
    try {
        const seller = await Seller.findOne({ username: req.body.username });
        if (!seller || seller.password !== req.body.password) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { sellerId: seller._id },
            'YOUR_SECRET_KEY',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Protected routes
app.get('/seller.html', authenticateSeller, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seller.html'));
});

app.post('/api/products', authenticateSeller, upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            seller: req.seller._id,
            image: req.file.path
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
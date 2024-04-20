const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const insight = require('./models/url-shortner');
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define route to serve index.html
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST requests to shorten URLs
app.post('/shorten', async (req, res) => {
    const { originalurl } = req.body;
    const shorturl = shortid.generate();
  
    const newUrl = new insight({ originalurl, shorturl });
    await newUrl.save();
  
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${shorturl}`;
  
    res.json({ originalurl, shorturl: fullShortUrl });
});

// Redirect to the original URL when the short URL is visited
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
  
    try {
        const url = await insight.findOne({ shorturl: shortUrl });
      
        if (url) {
            res.redirect(url.originalurl);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error("Error retrieving URL from database:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

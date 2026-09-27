const { execSync } = require('child_process');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const { sortHackerNewsArticles } = require('../index.js');

app.use(express.static(path.join(__dirname, '../frontend')));

//Get files from the test-data folder when the user downloads JSON or CSV
app.use('/test-data', express.static(path.join(__dirname, '../test-data')));

app.use(cors({
    origin: 'https://hackernewsscraper.netlify.app'
}));

//Make sure Playwright browsers are installed before running the page on Render
const browserDirectory = path.join(__dirname, 'node_modules', '.playwright');

if (!fs.existsSync(browserDirectory)) {
    try {
        execSync(`node "${path.join(__dirname, '../node_modules/playwright/cli.js')}" install chromium`, { stdio: 'inherit' });
    } catch (error) {
        console.error(error);
    }
};

app.get('/articles', async (_, res) => {
    try {
        const articles = await sortHackerNewsArticles();
        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not fetch articles.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
});
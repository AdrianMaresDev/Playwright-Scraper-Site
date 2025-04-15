const { execSync } = require('child_process');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;
const { sortHackerNewsArticles } = require('../index.js');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors({
    origin: 'https://hackernewsscraper.netlify.app/'
}));

try {
    execSync('npx playwright install', { stdio: 'inherit' });
} catch (error) {
    console.error(error);
}

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
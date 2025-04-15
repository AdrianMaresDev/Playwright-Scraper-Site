const path = require('path');
const { writeToFile } = require('./writeToFile.js');

const generateJson = (articles) => {
    const jsonFilePath = path.join(__dirname, '../test-data/articles.json');
    writeToFile(jsonFilePath, articles);
};

module.exports = { generateJson };
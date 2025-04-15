const path = require('path');
const { createObjectCsvStringifier } = require('csv-writer');
const { writeToFile } = require('./writeToFile.js');

const generateCsv = (articles) => {
    const csvStringify = createObjectCsvStringifier({
        header: [
            { id: 'title', title: 'Title' },
            { id: 'url', title: 'URL' },
            { id: 'unixDate', title: 'Unix Date' },
            { id: 'isoDate', title: 'ISO Date' },
            { id: 'poster', title: 'Poster' }
        ],
        alwaysQuote: true
    });

    const csvData = csvStringify.getHeaderString() + csvStringify.stringifyRecords(articles);

    const csvFilePath = path.join(__dirname, '../test-data/articles.csv');
    writeToFile(csvFilePath, csvData, false);
}

module.exports = { generateCsv };
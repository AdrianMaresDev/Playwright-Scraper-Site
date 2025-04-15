const { test, expect } = require('@playwright/test');
const {  sortArticles } = require('../index.js');
const fs = require('fs');
const path = require('path');

const ARTICLES_JSON_FILE = path.join(__dirname, '../test-data/articles.json');
const ARTICLES_CSV_FILE = path.join(__dirname, '../test-data/articles.csv');
let articles = [];

//Running node index.js will generate a test-data folder with a JSON and CSV file
//To fetch new data, run node index.js again

test.beforeAll(async () => {
    articles = JSON.parse(fs.readFileSync(ARTICLES_JSON_FILE, 'utf-8'));
});

test('Verify the length of articles is 100', async () => {
    expect(articles.length).toBe(100);
});

test('Verify the articles are sorted from newest to oldest', async () => {
    const isSorted = sortArticles(articles);
    expect(isSorted).toBeTruthy();
});

test('Verify all articles are unique', async () => {
    const uniqueArticles = new Set(articles.map(article => `${article.title}_${article.timestamp}`));
    expect(uniqueArticles.size).toBe(articles.length);
});

test('Verify all articles have valid fields', async () => {
    articles.forEach(article => {
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('isoDate');
        expect(article).toHaveProperty('unixDate');
        expect(article).toHaveProperty('poster');
        expect(article).toHaveProperty('index');
    });
});

test('Verify the CSV file is created and contains data', async () => {
    expect(fs.existsSync(ARTICLES_CSV_FILE)).toBeTruthy();
    const data = fs.readFileSync(ARTICLES_CSV_FILE, 'utf-8');
    expect(data.length).toBeGreaterThan(0);
});
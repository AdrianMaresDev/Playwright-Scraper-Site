const { chromium } = require("playwright");
const { generateJson } = require('./utils/generateJson.js');
const { generateCsv } = require('./utils/generateCsv.js');

const waitForArticle = async (page) => {
    const firstArticle = await page.locator('tr.athing').first();
    await firstArticle.waitFor({ state: 'visible', timeout: 5000 });
};

//Go to Hacker News and retry loading the page if tr.athing isn't visible
const loadPage = async (page) => {
    let retryCount = 0;

    while (retryCount < 3) {
        await page.goto('https://news.ycombinator.com/newest', { waitUntil: 'domcontentloaded' });

        const isLoaded = await waitForArticle(page);
        if (isLoaded) return true;
        retryCount++;
    }
};

const getTitle = async (article) => {
    const titleElement = article.locator('span.titleline > a');

    const title = (await titleElement.innerText()).trim();
    const url = await titleElement.getAttribute('href');

    return { title, url };
}

const getPoster = async (article) => {
    const posterElement = await article.evaluateHandle(el => el.nextElementSibling);
    return await posterElement.evaluate(el => el.querySelector('a.hnuser')?.innerText.trim()) || 'Unknown';
};

const getTimestamp = async (article, index) => {
    const timestampElement = await article.evaluateHandle(el => el.nextElementSibling);
    const timestamp = await timestampElement.evaluate(el => el.querySelector('span.age').getAttribute('title'));

    if (!/\d+/.test(timestamp)) {
        throw new Error(`Invalid date format: ${timestamp} at index ${index}`);
    }

    const unixDate = parseInt(timestamp.split(' ')[1], 10);
    const isoDate = new Date(unixDate * 1000).toISOString();

    return { unixDate, isoDate };
};

const getArticleData = async (page, articles, index) => {
    const articleElements = await page.locator('tr.athing').all();

    for (let i = 0; i < articleElements.length; i++) {
            const article = articleElements[i];

            const { title, url } = await getTitle(article, i);
            const { unixDate, isoDate } = await getTimestamp(article, i);
            const poster = await getPoster(article, i);

            articles.push({ title, url, unixDate, isoDate, poster, index });
            index++;

            if (articles.length >= 100) break;
    }
    return index;
};

const loadNewPage = async (page, articles) => {
    if (articles.length < 100) {
        const moreButton = page.getByRole('link', { name: 'More', exact: true });

        await Promise.all([
            page.waitForURL('**', { waitUntil: 'domcontentloaded' }),
            moreButton.click()
        ]);

        await waitForArticle(page);
    }
    return true;
};

const sortArticles = (articles) => {
    for (let i = 0; i < articles.length - 1; i++) {
        const a = articles[i];
        const b = articles[i + 1];

       if (a.unixDate < b.unixDate) {
        return false;
       }
    }
    return true;
};

async function sortHackerNewsArticles() {

    //Launch browser
    const browser = await chromium.launch({

        //Only run headed mode in development
        headless: process.env.NODE_ENV === 'production'
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    let articles = [];
    let index = 0;

    try {

        await loadPage(page);

        while (articles.length < 100) {
            try {
                index = await getArticleData(page, articles, index);

                await loadNewPage(page, articles);

            } catch (error) {
                console.error(error);
                break;
            }
        }

        if (articles.length !== 100) {
            console.error(`Received ${articles.length} articles, expected 100.`);
            return;
        }

        //Fail the script if the articles aren't sorted
        const isSorted = sortArticles(articles);
        if (!isSorted) {
            throw new Error('Articles are not sorted from newest to oldest.');

        } else {
            generateJson(articles);
            generateCsv(articles);
            console.log('Articles are sorted from newest to oldest.');
        }

    } catch (error) {
        console.error(error);
        articles = [];

    } finally {
        await browser.close();
        return articles;
    }
}   

if (require.main === module) {
    sortHackerNewsArticles();
};

module.exports = { sortHackerNewsArticles, sortArticles };
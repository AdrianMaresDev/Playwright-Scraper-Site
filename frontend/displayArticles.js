const fetchButton = document.getElementById('fetch-button');
const articleList = document.getElementById('article-list');
const articleContainer = document.querySelector('.article-container');
const loadMessage = document.getElementById('load-message');

const BASE_URL = window.location.origin || 'https://scraper-site.onrender.com';

fetchButton.addEventListener('click', () => {
    loadMessage.style.display = 'block';
    fetchArticles();
    fetchButton.textContent = 'Refresh Articles';
});

async function fetchArticles() {
    try {
        const res = await fetch(`${BASE_URL}/articles`);
        const articles = await res.json();

        articleList.innerHTML = '';

        articles.forEach(article => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item');
            const date = new Date(article.isoDate);
            const formattedDate = date.toLocaleString();

            listItem.innerHTML = `
            <h2>${article.index + 1}. <a href="${article.url}" target="_blank">${article.title}</a></h2>
            <p>Date: ${formattedDate}</p>
            <p>Poster: ${article.poster}</p>
            `;

            articleList.appendChild(listItem);
        });

        loadMessage.style.display = 'none';
        articleContainer.style.display = 'block';
    } catch (error) {
        console.error('Could not fetch articles.', error);
        loadMessage.textContent = 'Could not load articles. Please try again.';
    }
};
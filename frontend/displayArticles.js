const fetchButton = document.getElementById('fetch-button');
const articleList = document.getElementById('article-list');
const articleContainer = document.querySelector('.article-container');
const loadMessage = document.getElementById('load-message');
const downloadButtons = document.querySelector('.download-buttons');

//Netlify only hosts the frontend, so point it at the Render backend. Otherwise use the local or Render origin
const BASE_URL = window.location.hostname.endsWith('netlify.app')
    ? 'https://scraper-site.onrender.com'
    : window.location.origin;

downloadButtons.querySelectorAll('a').forEach(link => {
    link.href = `${BASE_URL}${link.getAttribute('href')}`;
});

fetchButton.addEventListener('click', () => {
    loadMessage.style.display = 'block';
    displayArticles();
});

async function displayArticles() {
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
        downloadButtons.style.display = 'flex';
        fetchButton.textContent = 'Refresh Articles';

    } catch (error) {
        console.error('Could not fetch articles.', error);
        loadMessage.textContent = 'Could not load articles. Please try again.';
    }
};
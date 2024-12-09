const newsFile = "news.json";

var converter = new showdown.Converter();

document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById("current-time").innerHTML = new Date().toLocaleString('de-DE');
    let filteredNews = await getNewsList();
    processNews(filteredNews);

});

async function getNewsList() {
    const response = await fetch(newsFile);
    const data = await response.json();
    const today = new Date();
    let filteredNews = data.filter(item => new Date(item.date) <= today);
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filteredNews;
    // ...existing code...
}

async function processNews(filteredNews) {

    for (let item of filteredNews) {
        item.content = await getSingleNews(item.file);
        console.log("Content of " + item.file + " is:");
        console.log(item.content);
    }

    fillNewsElement(filteredNews);
}

async function getSingleNews(filename) {
    const response = await fetch("news/" + filename);
    const text = await response.text();
    console.log(text);
    return text;
}

function fillNewsElement(news) {
    const columns = [
        document.getElementById('column1'),
        document.getElementById('column2'),
        document.getElementById('column3')
    ];

    columns.forEach(column => column.innerHTML = ''); // Clear existing content

    news.forEach((item, index) => {
        const column = columns[index % 3];
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div>${markdownToHtml(item.content)}</div><br>
            <time style="font-weight: normal">${new Date(item.date).toLocaleDateString('de-DE')}</time> | ${item.author}
        `;
        column.appendChild(newsItem);
    });
}

function markdownToHtml(text) {
    return converter.makeHtml(text);
}
const newsFile = "news.json";

var converter = new showdown.Converter();

document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById("current-time").innerHTML = new Date().toLocaleString('de-DE');
    let filteredNews = await getNewsList();
    console.log("Im Eventlistener");
    console.log(filteredNews);
    processNews(filteredNews);

});

async function getNewsList() {
    const response = await fetch(newsFile);
    const data = await response.json();
    const today = new Date();
    let filteredNews = data.filter(item => new Date(item.date) <= today);
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(filteredNews);
    return filteredNews;
    // ...existing code...
}

async function processNews(filteredNews) {
    
    console.log("In der Funktion processNews:");
    console.log(filteredNews);

    for (let item of filteredNews) {
        item.content = await getSingleNews(item.file);
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
            <time>${new Date(item.date).toLocaleDateString('de-DE')}</time>
            <div>${markdownToHtml(item.content)}</div>
        `;
        column.appendChild(newsItem);
    });
}

function markdownToHtml(text) {
    return converter.makeHtml(text);
}
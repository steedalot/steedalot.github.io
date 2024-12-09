const newsFile = "news.json";

var converter = new showdown.Converter();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("current-time").innerHTML = new Date().toLocaleString('de-DE');
});

function getNews() {
    fetch(newsFile)
        .then(response => response.json())
        .then(data => {
            const today = new Date();
            const filteredNews = data.filter(item => new Date(item.date) <= today);
            filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            fillNewsElement(filteredNews);


        });
    // ...existing code...
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
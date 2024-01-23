javascript:(function() {
    var rawFileUrl = 'https://raw.githubusercontent.com/LoganStraly/mc-image-scraper/main/image-scraper.js';
    fetch(rawFileUrl)
        .then(response => response.text())
        .then(code => {
            eval(code);
        })
        .catch(error => console.error('Error fetching code:', error));
})();

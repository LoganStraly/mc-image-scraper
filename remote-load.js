javascript:(function() {
    var rawFileUrl = 'https://raw.githubusercontent.com/lake-straly/mc-image-scraper/main/iamge-scraper.js';
    fetch(rawFileUrl)
        .then(response => response.text())
        .then(code => {
            eval(code);
        })
        .catch(error => console.error('Error fetching code:', error));
})();

const proxyUrl = 'https://www.stralyfamily.com/proxy/';
function startScraper() {
    function startAlert() {
        const alertDiv = document.createElement("div");
        alertDiv.setAttribute('id', 'alertDiv');
        let firstDiv = document.querySelector('body').firstElementChild;
        document.body.insertBefore(alertDiv, firstDiv);
        let alertText = document.createElement("p");
        alertText.innerHTML = 'Marketing Center Image Scraper Started<br>It may take some time!<br>This alert will disappear when it is finised.<br><div class="cssLoader"></div>';
        alertDiv.appendChild(alertText);
        alertText.style.margin = '0';
        alertDiv.style.fontFamily = '"Open Sans", sans-serif';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '5em';
        alertDiv.style.right = '1em';
        alertDiv.style.zIndex = '999';
        alertDiv.style.textAlign = 'center';
        alertDiv.style.borderRadius = '2px';
        alertDiv.style.minHeight = '48px';
        alertDiv.style.lineHeight = '1.5em';
        alertDiv.style.padding = '1.5em';
        alertDiv.style.boxShadow = '0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12), 0 3px 1px -2px rgba(0, 0, 0, .2)';
        alertDiv.style.maxHeight = '150px';
        alertDiv.style.maxWidth = '400px';
        alertDiv.style.fontSize = '15px';
        alertDiv.style.color = 'white';
        alertDiv.style.backgroundColor = 'rgb(163, 190, 140)';
        alertDiv.style.cursor = 'pointer';
        alertDiv.style.transition = 'opacity 3s ease-in-out';
        alertDiv.style.opacity = '1';
        alertDiv.addEventListener('click', () => {
            alertDiv.remove();
        });

        var css = `.cssLoader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin-inline: auto;
            margin-top: 1em;
        }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
    }

    function clearAlert() {
        let alertDiv = document.getElementById('alertDiv');
        if (alertDiv) {
            alertDiv.style.transition = 'opacity 1s ease-in-out';
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }
    }

    /* Get all the div containers with the class "gallery-photo-container" within "div.row.main-gallery" */
    var containers = document.querySelectorAll('div.row.main-gallery div.gallery-photo-container.ng-scope');
    /* Create placeholder vars */
    var imageInfo = [];
    var imageNameCounts = {};
    /* Iterate through each container and collect unique image information */
    containers.forEach((container) => {
        var image = container.querySelector('img');
        var nameElement = container.querySelector('p.image-name span');

        if (image && nameElement) {
            if (image) { };
            /* Replace "/numberXnumber/" with "/5000x5000/" */
            var newSrc = image.src.replace(/\/\d+x\d+\//, '/5000x5000/');
            /* Extract the image name from the text content of the span tag within the p tag. Remove anything past the "." */
            var originalName = nameElement.textContent.trim().replace(/\.[^.]+$/, '');

            /* Check if the image name has been encountered before */
            if (!imageNameCounts.hasOwnProperty(originalName)) {
                imageNameCounts[originalName] = 1;
            } else {
                /* Append the index to the image name if it is not an original name */
                imageNameCounts[originalName]++;
                originalName = `${originalName}_${imageNameCounts[originalName]}`;
            }

            imageInfo.push({
                src: newSrc,
                name: originalName
            });
        }
    });

    async function downloadAllImages() {
        if (imageInfo.length >= 1) {
            startAlert();
            for (let info of imageInfo) {
                await downloadImage(info);
            }
        } else {
            throw 'Zero images found.';
        }
    }

    function downloadImage(info) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', `${proxyUrl}?target=${encodeURIComponent(info.src)}`, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var contentType = xhr.getResponseHeader('Content-Type');
                var a = document.createElement('a');
                var blob = new Blob([xhr.response], { type: contentType });
                a.href = URL.createObjectURL(blob);
                a.download = info.name + getFileExtension(contentType);
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                resolve();
            };
            xhr.onerror = function () {
                reject(new Error('Failed to download image: ' + info.src));
            };
            xhr.send();
        });
    }
    function getFileExtension(contentType) {
        if (contentType.startsWith('image/')) {
            if (contentType.includes('svg')) {
                return '.svg';
            } else {
                return '.' + contentType.split('/')[1];
            }
        } else {
            return '.jpg';
        }
    }
    async function downloadAndClearAlert() {
        try {
            await downloadAllImages();
            clearAlert();
            window.alert('Marketing Center Image Scraper finished.');
        } catch (error) {
            window.alert('Marketing Center Image Scraper:\nI wasn\'t able to find any photo divs. Make sure you\'ve clicked "See all".');
            console.error('Error downloading images:', error);
        }
    }
    downloadAndClearAlert();
}

function isValidURL(url) {
    var pattern = /^https:\/\/mc\.realpage\.com\/propertyPhotos\/.*$/;
    return pattern.test(url);
}
if (isValidURL(window.location.href)) {
    startScraper();
} else {
    window.alert('Make sure you\'re running this from a Marketing Center\n"/propertyPhotos/" URL.');
}

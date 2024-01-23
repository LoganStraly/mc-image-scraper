javascript:(function() {
    /*
      Get all the div containers with the class "gallery-photo-container" within "div.row.main-gallery"
    */
    var containers = document.querySelectorAll('div.row.main-gallery div.gallery-photo-container.ng-scope');
    
    /*
      Create placeholder vars
    */
    var imageInfo = [];
    var imageNameCounts = {};
    
    /*
      Iterate through each container and collect unique image information
    */
    containers.forEach(function(container, index) {
      var image = container.querySelector('img');
      var nameElement = container.querySelector('p.image-name span');
      
      if (image && nameElement) {
        /*
          Replace "/numberXnumber/" with "/5000x5000/"
        */
        var newSrc = image.src.replace(/\/\d+x\d+\//, '/5000x5000/');
        
        /*
          Extract the image name from the text content of the span tag within the p tag
          Remove ".jpg" from the end
        */
        var originalName = nameElement.textContent.trim().replace('.jpg', '');
        
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
    
    /*
      Function to trigger download for all images using XMLHttpRequest
    */
    function downloadAllImages() {
      imageInfo.forEach(function(info, index) {
        setTimeout(function() {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', info.src, true);
          xhr.responseType = 'blob';
  
          xhr.onload = function() {
            var a = document.createElement('a');
            var blob = new Blob([xhr.response], { type: 'image/jpeg' });
            a.href = URL.createObjectURL(blob);
            
            a.download = info.name + '.jpg'; /* Set the name */
            
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
  
          xhr.send();
        }, 300 * index); /* 300ms delay for each image */
      });
    }
  
    /*
      Trigger the download function
    */
    downloadAllImages();
  })();
  

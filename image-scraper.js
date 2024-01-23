javascript:(function() {
    /*
      Get all the image tags within the specified div
    */
    var images = document.querySelectorAll('div.row.main-gallery img');
    
    /*
      Create an array to store image sources
    */
    var imageSources = [];
    
    /*
      Iterate through each image and collect image sources
    */
    for (var i = 0; i < images.length; i++) {
      /*
        Replace old image size with "/5000x5000/"
      */
      var newSrc = images[i].src.replace(/\/\d+x\d+\//, '/5000x5000/');
      imageSources.push(newSrc);
    }
    
    /*
      Function to trigger download for all images using XMLHttpRequest
    */
    function downloadAllImages() {
      imageSources.forEach(function(src, index) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        xhr.responseType = 'blob';
  
        xhr.onload = function() {
          var a = document.createElement('a');
          var blob = new Blob([xhr.response], { type: 'image/jpeg' });
          a.href = URL.createObjectURL(blob);
          a.download = 'image_' + index + '.jpg'; /* The names of the files "image_X" */
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
  
        xhr.send();
      });
    }
  
    /*
      Trigger the download function
    */
    downloadAllImages();
  })();
  
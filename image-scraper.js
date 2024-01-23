javascript:(function() {
    /*
      Get all the image tags
    */
    var images = document.querySelectorAll('div.row.main-gallery div div img');
    
    /*
      Create an array to store image sources
    */
    var imageSources = [];
    
    /*
      Iterate through each image and collect image sources
    */
    for (var i = 0; i < images.length; i++) {
      /*
        Replace "/numberXnumber/" with "/5000x5000"
      */
      var newSrc = images[i].src.replace(/\/\d+x\d+\//, '/5000x5000/');
      imageSources.push(newSrc);
    }
    
    /*
      Function to trigger download for all images using XMLHttpRequest with a delay
    */
    function downloadAllImages() {
      var index = 0;
  
      function downloadNextImage() {
        if (index < imageSources.length) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', imageSources[index], true);
          xhr.responseType = 'blob';
  
          xhr.onload = function() {
            var a = document.createElement('a');
            var blob = new Blob([xhr.response], { type: 'image/jpeg' });
            a.href = URL.createObjectURL(blob);
            a.download = 'image_' + index + '.jpg'; /* File name */
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
  
            index++;
            setTimeout(downloadNextImage, 100); /* Adjust the delay in milliseconds */
          };
  
          xhr.send();
        }
      }
  
      /*
        Trigger the download function
      */
      downloadNextImage();
    }
  
    /*
      Trigger the download function immediately
    */
    downloadAllImages();
  })();
  

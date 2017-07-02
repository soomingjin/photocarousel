//Array that stores the sources of images
var images = ['http://thecatapi.com/api/images/get.php?api_key=MTAx&id=cfc',
  'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?h=350&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?h=350&auto=compress&cs=tinysrgb'
];

/**Controls how the left button behaves when clicked
 *@param {Number} index of image
 */
function leftButton(currentIndex) {
  $('#output').text("Left Button Clicked");
  var nextIndex = currentIndex;
  if (currentIndex <= 0) {
    nextIndex = images.length - 1;
  } else {
    nextIndex -= 1;
  }
  $('#indexOutput').text(nextIndex);
  showImage(nextIndex);
  return;
}

/**
  *Controls how the right button behaves when clicked
  *@param {Number} index of image
  */
function rightButton(currentIndex) {
  $('#output').text("Right Button Clicked");
  var nextIndex = currentIndex;
  if (currentIndex >= (images.length - 1)) {
    nextIndex = 0;
  } else {
    nextIndex += 1;
  }
  $('#indexOutput').text(nextIndex);
  showImage(nextIndex);
  return;
}

/**
  *Modifies the source attribute of the container to display the next image
  *@param {Number} index of image
  */
function showImage(index) {
  var nextSource = images[index];
  var img = $('#image-container');
  img.attr('src', nextSource);
  return;
}

/**
 *Returns the index of the image in image array
 *
 *@return index of image
 */
function getImageIndex() {
  var img = $('#image-container');
  var source = img.attr('src');
  return images.indexOf(source);
}

//Run this function when the website is loaded for the first time
//To show the first image in the array
function init() {
  var currIndex;
  currIndex = 0;
  $('#indexOutput').text(currIndex);
  showImage(currIndex);
}

$(function() {

  init();

});

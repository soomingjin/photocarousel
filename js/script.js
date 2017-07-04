//Array that stores the sources of images
var images = ['http://thecatapi.com/api/images/get.php?api_key=MTAx&id=cfc',
  'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?h=350&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?h=350&auto=compress&cs=tinysrgb',
  'https://static.pexels.com/photos/236603/pexels-photo-236603.jpeg',
  'https://static.pexels.com/photos/209800/pexels-photo-209800.jpeg',
  'https://static.pexels.com/photos/199449/pexels-photo-199449.jpeg',
  'https://static.pexels.com/photos/87413/animal-cat-domestic-eye-87413.jpeg',
  'https://static.pexels.com/photos/64147/cat-young-cat-playful-pet-64147.jpeg'
];

var localImages = [
// 'images/cate1.jpg',
'images/cate2.jpeg',
'images/cate3.jpeg',
'images/cate4.jpg',
// 'images/cate5.jpg',
'images/cate6.jpg',
'images/cate7.jpg',
// 'images/cate8.jpg'
];

/**
 *Controls how the carousell buttons behave when clicked
 *@param {Number} index of image
 */
function carousellButtonHandler(event){
  //obtain the current index
  //find the name of the button being pressed
  var nextIndex = getImageIndex();
  var buttonType = this.name;

  //check which button is being pressed
  if (buttonType === "next"){
    if (nextIndex >= (localImages.length - 1)) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
  } else {
    if (nextIndex <= 0) {
      nextIndex = localImages.length - 1;
    } else {
      nextIndex -= 1;
    }
  }

  showImage(nextIndex);
  return;
}

/**
 *Returns the index of the image in image array
 *
 *@return {Number} index of image
 */
function getImageIndex() {
  var img = $('#image-container');
  var source = img.attr('src');
  return localImages.indexOf(source);
}

/**
 *Modifies the source attribute of the container to display an image
 *@param {Number} index of image
 */
function showImage(index) {
  // var nextSource = images[index];

  var nextSource = localImages[index];
  var img = $('#image-container');
  img.hide('slide', { direction: "left" }, 100, function(){
    img.attr('src', nextSource);
  }).show('slide', { direction: "right" }, 100);
  // img.show('slide', { direction: "right" }, 100);
  // $('.carousellButton').height($('#image-container').height()); // supposed to dynamically change the height, but not in use anymore
  $('#indexOutput').text(index);
  return;
}



//Run this function when the website is loaded for the first time
//To show the first image in the array
function init() {
  var currIndex;
  currIndex = 0;
  showImage(currIndex);
  //tag event handlers to buttons
  $('.carousellButton').click(carousellButtonHandler);
  $('.carousellButton').height($('#image-container').height());
}

$(function() {

  init();

});

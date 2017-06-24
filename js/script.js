
var images = [ 'http://thecatapi.com/api/images/get.php?api_key=MTAx&id=cfc',
  'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?h=350&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?h=350&auto=compress&cs=tinysrgb' ];


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

function showImage(index) {
  var nextSource = images[index];
  var img = $('#image-container');
  img.attr('src', nextSource);
  return;
}

function getImageIndex(){
  var img = $('#image-container');
  var source = img.attr('src');
  return images.indexOf(source);
}

function init(){
  var currIndex;
  currIndex = 0;
  $('#indexOutput').text(currIndex);
  showImage(currIndex);
}

$(function() {

  init();

});

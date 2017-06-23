$(function() {

  images = [];

  function leftButton(currentIndex) {
    var nextIndex;
    if (currentIndex <= 0) {
      nextIndex = images.length - 1;
    } else {
      nextIndex -= 1;
    }
    changeImage(nextIndex);
    return;
  }

  function rightButton(currentIndex) {
    if (currentIndex >= (images.length - 1)) {
      nextIndex = 0;
    } else {
      nextIndex += 1;
    }
    changeImage(nextIndex);
    return;
  }

  function changeImage(index) {
    var nextSource = images[index];

  }
});
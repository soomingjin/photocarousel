$(function() {
  // image array to store all the properties of the cat images, namely the path
  // and the caption.
  const images = [{
    path: "images/cate2.jpeg",
    caption: "Curious grey kitten"
  },{
    path: "images/cate3.jpeg",
    caption: "Cat licking off the last bits of his meal from its paw"
  },{
    path: "images/cate4.jpg",
    caption: "The cat stays still, keeping in mind not to startle its prey"
  },{
    path: "images/cate6.jpg",
    caption: "After destroying its toy, it looks for a new target"
  },{
    path: "images/cate7.jpg",
    caption: "The white furred cat stares into the camera lens, admiring its beautiful coloured green eyes"
  }
  ];



  /**
   *Controls how the carousell buttons behave when clicked
   *@param {Number} index of image
   */
  function carousellButtonHandler(event) {
    //obtain the current index
    //find the name of the button being pressed
    let nextIndex = getImageIndex();
    const buttonType = event.target.name;
    const $img = $('#cat-image');

    //check which button is being pressed
    if (buttonType === "next") {
      if (nextIndex >= images.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex += 1;
      }
    } else {
      if (nextIndex <= 0) {
        nextIndex = images.length - 1;
      } else {
        nextIndex -= 1;
      }
    }
    $img.data('current-index', nextIndex);
    showImage(nextIndex);
    return;
  }

  /**
   *Returns the index of the image in image array
   *
   *@return {Number} index of image
   */
  function getImageIndex() {
    const $img = $("#cat-image");
    return $img.data('current-index');
  }

  /**
   *Modifies the source attribute of the container to display an image
   *@param {Number} index of image
   */
  function showImage(index) {
    const nextSource = images[index].path;
    const $img = $("#cat-image");
    const $caption = $(".carousel-caption");
    $img
      .hide({
        effect: "fade",
        duration: 100,
        complete: function() {
          $img.attr("src", nextSource);
          $caption.text(images[index].caption);
          $(".carousell-button").height($img.height());
        }
      })
      .show({
        effect: "fade",
        duration: 100
      });
    return;
  }

  //Run this function when the website is loaded for the first time
  //To show the first image in the array
  function init() {
    const currIndex = 0;
    const $img = $("#cat-image");
    $img.data('current-index', currIndex);
    //show first image
    showImage($img.data('current-index'));
    //tag event handlers to buttons
    $(".carousell-button").click(carousellButtonHandler);
  }

  init();
});

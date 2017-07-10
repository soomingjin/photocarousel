$(() => {
  // image array to store all the properties of the cat images, namely the path
  // and the caption.
  const images = [{
      path: "images/cate2.jpeg",
      caption: "Curious grey kitten"
    },
    {
      path: "images/cate3.jpeg",
      caption: "Cat licking off the last bits of his meal from its paw"
    },
    {
      path: "images/cate4.jpg",
      caption: "The cat stays still, keeping in mind not to startle its prey"
    },
    {
      path: "images/cate6.jpg",
      caption: "After destroying its toy, it looks for a new target"
    },
    {
      path: "images/cate7.jpg",
      caption: "The white furred cat stares into the camera lens, admiring its beautiful coloured green eyes"
    }
  ];



  /**
   *Controls how the carousell buttons behave when clicked
   *@param {Number} index of image
   */
  // function photocarouselButtonHandler(event) {
  //   //obtain the current index
  //   //find the name of the button being pressed
  //   let nextIndex = getImageIndex();
  //   const buttonType = event.target.name;
  //   const $img = $('.cat-image');
  //
  //   //check which button is being pressed
  //   if (buttonType === "next") {
  //     if (nextIndex >= images.length - 1) {
  //       nextIndex = 0;
  //     } else {
  //       nextIndex += 1;
  //     }
  //   } else {
  //     if (nextIndex <= 0) {
  //       nextIndex = images.length - 1;
  //     } else {
  //       nextIndex -= 1;
  //     }
  //   }
  //   $img.data('current-index', nextIndex);
  //   showImage(nextIndex);
  //   return;
  // }
  // function photocarouselButtonHandler(event) {
  //   //obtain the current index
  //   //find the name of the button being pressed
  //   let nextIndex = getImageIndex();
  //   const buttonType = event.target.name;
  //   const $img = $('.cat-image');
  //
  //   //check which button is being pressed
  //   if (buttonType === "next") {
  //
  //   } else {
  //
  //   }
  //   $img.data('current-index', nextIndex);
  //   showImage(nextIndex);
  //   return;
  // }

  /**
   *Returns the index of the image in image array
   *
   *@return {Number} index of image
   */
  function getImageIndex() {
    const $img = $(".cat-image");
    return $img.data('current-index');
  }

  /**
   *Modifies the source attribute of the container to display an image
   *@param {Number} index of image
   */
  // function showImage(index) {
  //   const nextSource = images[index].path;
  //   const $img = $(".cat-image");
  //   const $caption = $(".photocarousel-caption");
  //   $img
  //     .hide({
  //       effect: "fade",
  //       duration: 100,
  //       complete: () => {
  //         $img.attr("src", nextSource);
  //         $caption.text(images[index].caption);
  //         // dictate the height of the button to be the same aas the image
  //         $('.photocarousel-button').height($img.height());
  //       }
  //     })
  //     .show({
  //       effect: "fade",
  //       duration: 100
  //     });
  //
  //   return;
  // }

  function fetchImageHandler(event) {
    event.preventDefault();
    alert("Search button clicked");
    return;
  }

  function generateDOMforImages() {
    const $imageContainer = $('.image-container');
    let newImg = $("<img>", {
      class: 'cat-image'
    });
    // alert(images.length);

    for (let i = 0; i < images.length; i++) {}
    return;
  }


  //Run this function when the website is loaded for the first time
  //To show the first image in the array
  function init() {
    const currIndex = 0;
    const $img = $(".cat-image");
    // $img.data('current-index', currIndex);
    $img.first().toggleClass('active');
    //show first image
    // showImage($img.data('current-index'));
    generateDOMforImages();
    //tag event handlers to buttons
    $(".photocarousel-button").click(photocarouselButtonHandler);
    $('.fetch-image-form').submit(fetchImageHandler);
  }

  init();
});

$(() => {


  function photocarouselButtonHandler(event) {
    // current index is stored on the wrapper div
    // each div inside the wrapper has an index
    // by default, all the divs are on the right side of the wrapper
    // when the button is clicked, check which button is being pressed
    // using the current index, calculate the next index of the div to move in
    // if the right button was pressed, move in from the right
    // if the left button was pressed, move the next image to the left side of the
    // active slide and the move in from the left.
    // from here, we need some knowledge on css transitions and animations

    const active = $('.active');
    const buttonType = event.target.name;

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

    return;
  }

  function init() {
    $catimage = $('.cat-image');
    for (let i = 0; i < $catimage.length; i++) {
      $catimage[i];
    }


    }

});

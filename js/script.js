$(() => {
  const caption = [
    "Curious grey kitten",
    "Cat licking off the last bits of his meal from its paw",
    "The cat stays still, keeping in mind not to startle its prey",
    "After destroying its toy, it looks for a new target",
    "The white furred cat stares into the camera lens, admiring its beautiful coloured green eyes"
  ];
  /*
   * handles the logic for clicking the buttons
   */
  function photocarouselButtonHandler(event) {
    const buttonType = event.currentTarget.name;
    const $catdivs = $('.cat-div');
    $imagecontainer = $('.image-container');
    const currentIndex = $imagecontainer.data('current-index');
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonType === "next") {
      if (nextIndex >= $catdivs.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex += 1;
      }
    } else {
      if (nextIndex <= 0) {
        nextIndex = $catdivs.length - 1;
      } else {
        nextIndex -= 1;
      }
    }
    $imagecontainer.data('current-index', nextIndex);
    render(nextIndex, buttonType);
    return;
  }
  /*
   * Handles the logic of the next slide to be displayed
   */
  function render(nextIndex, buttonType = 'init') {
    const $catdivs = $('.cat-div');
    const $active = $('.active');
    const $nextSlide = $catdivs.eq(nextIndex);
    if (buttonType === 'init') {
      $('.cat-div').eq(nextIndex).toggleClass('active');
    } else {
      animateSlide($active, $nextSlide, buttonType);
    }

    return;
  }
  /*
   * Animates the carousel sliding
   *
   */
  function animateSlide($active, $nextSlide, command) {
    $photocarouselbutton = $(".photocarousel-button");
    $photocarouselbutton.off('click');
    if (command === "next") {
      $active.animate({
        left: "-100%"
      }, {
        duration: 300,
        complete: function() {
          $(this).removeAttr('style');
          $(this).toggleClass('active');
          return;
        }
      });
      $nextSlide.animate({
        left: "0px"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('active');
          $photocarouselbutton.one('click', photocarouselButtonHandler);
          $(this).removeAttr('style');
          return;
        }
      });
    } else {
      $active.animate({
        left: "100%"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('active');
          $(this).removeAttr('style');
          return;
        }
      });
      $nextSlide.animate({
        left: "-100%"
      }, duration = 0).animate({
        left: "0px"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('active');
          $photocarouselbutton.one('click', photocarouselButtonHandler);
          $(this).removeAttr('style');
          return;
        }
      });
    }

    return;
  }
  // feature not ready yet
  function fetchImageHandler(event) {
    event.preventDefault();
    alert("Search button clicked");
    return;
  }
  /*
   * Initialises which slide to be displayed first
   *
   */
  function init() {
    const startingIndex = 0;
    $('.image-container').data('current-index', startingIndex);

    render(startingIndex);
    $(".photocarousel-button").one('click', photocarouselButtonHandler);
    // $('.fetch-image-form').submit(fetchImageHandler);
    return;
  }

  init();
});

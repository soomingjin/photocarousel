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

    const buttonType = event.target.name;
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



  }
  /*
   * Animates the carousel sliding
   *
   */
  function animateSlide($active, $nextSlide, command) {
    $photocarouselbutton = $(".photocarousel-button");
    $active.css({
      "animation-name": "hide" + command,
      "animation-duration": "1s"
    });
    $nextSlide.css({
      "animation-name": "show" + command,
      "animation-duration": "1s"
    });
    $photocarouselbutton.unbind('click');
    setTimeout(() => {
      $active.toggleClass('active');
      $nextSlide.toggleClass('active');
      $photocarouselbutton.click(photocarouselButtonHandler);
    }, 1000);
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
    $(".photocarousel-button").click(photocarouselButtonHandler);
    // $('.fetch-image-form').submit(fetchImageHandler);
    return;
  }

  init();
});

$(function() {

  // image array to store all the properties of the cat images, namely the path
  // and the caption.
  const images = [{
    path: "cate2.jpeg",
    caption: "Curious grey kitten"
  }, {
    path: "cate3.jpeg",
    caption: "Cat licking off the last bits of his meal from its paw"
  }, {
    path: "cate4.jpg",
    caption: "The cat stays still, keeping in mind not to startle its prey"
  }, {
    path: "cate6.jpg",
    caption: "After destroying its toy, it looks for a new target"
  }, {
    path: "cate7.jpg",
    caption: "The white furred cat stares into the camera lens, admiring its beautiful coloured green eyes"
  }];

  /**
   * This function builds the path for the image
   * @param {String} name name of the picture in images directory
   * @returns {String} formatted string to the path of the image
   */
  function buildLocalPath(name) {
    return `images/${name}`;
  }

  /**
   * render
   * This function builds photocarousel-divs
   * @param {Number} nextIndex name of the picture in images directory
   * @param {jQuery} $photocarousel name of the picture in images directory
   * @param {String} buttonType name of the button being pressed
   */
  function render(nextIndex, $photocarouselContainer, buttonType = 'init') {
    let $photocarousel = $photocarouselContainer.children('.photocarousel');
    let $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    let $active = $photocarousel.children('.activeSlide');
    let $nextSlide = $photocarouselDivs.eq(nextIndex);
    const validBuildButtons = ['init', 'fetch', 'reset'];
    const validAnimationButtons = ['previous', 'next'];
    try {
      if (validBuildButtons.includes(buttonType)) {
        buildDOM($photocarouselContainer, buttonType);
        $photocarousel = $photocarouselContainer.children('.photocarousel');
        $photocarouselDivs = $photocarousel.children('.photocarousel-div');
        $active = $photocarousel.children('.activeSlide');
        $nextSlide = $photocarouselDivs.eq(nextIndex);
        $nextSlide.toggleClass('activeSlide');
      } else if (validAnimationButtons.includes(buttonType)) {
        animateSlide($active, $nextSlide, buttonType, $photocarouselContainer);
      } else {
        throw (buttonType);
      }
    } catch (error) {
      console.error("buttonType = " + error);
      console.log("Error. Unrecognised buttonType referenced");
    }
    $photocarousel.attr('title', $nextSlide.attr('title'));

    return;
  }

  /**
   * buildDOM
   * This function builds photocarousel-divs
   * @param {JQuery} $photocarousel The container to be appended to
   * @param {String} buttonType Name of button that is being pressed
   */
  function buildDOM($photocarouselContainer, buttonType) {
    let $photocarousel = $photocarouselContainer.children('.photocarousel');
    const $removedDivs = $photocarousel.children('.photocarousel-div').detach();
    const settings = $photocarouselContainer.settings;
    if (buttonType === 'init') {
      createPhotocarousel($photocarouselContainer);
      createButtons(settings.numberOfSlides, $photocarouselContainer);
      createLoaderDiv($photocarouselContainer);
      createPhotocarouselDivs(settings.numberOfSlides, $photocarouselContainer);
      createSearchFunction(settings.searchFunction, $photocarouselContainer);
    } else if (buttonType === 'fetch') {
      const data = $photocarouselContainer.photocarouselData.imageData;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let photo = data[i];
          let id = photo.id;
          let farmId = photo.farm;
          let serverId = photo.server;
          let secret = photo.secret;
          let photoTitle = photo.title;
          let mstzb = 'z'; //photosize
          let photoURL = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${mstzb}.jpg`;
          // (secondary) loading gif added over the container
          // make elements to be added into the dom
          // remove current images (possibly store them)
          // reset the index -> display the images

          // div -> background-image

          createSinglePhotocarouselDiv(photoURL, photoTitle, $photocarousel);
        }
        createButtons(data.length, $photocarouselContainer);
      }
      if (data.length === 1){
        removeButtons($photocarouselContainer);
      }
    } else if (buttonType === 'reset'){
      createButtons(settings.numberOfSlides, $photocarouselContainer);
      createPhotocarouselDivs(settings.numberOfSlides, $photocarouselContainer);
    }
    return;
  }

  /**
   * createPhotocarousel
   * This function creates photocarousel to be attached to the DOM
   * @param {JQuery} $photocarouselContainer The container to be appended to
   */
  function createPhotocarousel($photocarouselContainer){
    $(document.createElement('div'))
      .attr({class: 'photocarousel col-md-12 col-lg-12'})
      .appendTo($photocarouselContainer);
    return;
  }

  /**
   * createButtons
   * This function creates buttons to attach to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   * @param {JQuery} $photocarousel The container to be appended to
   */
  function createButtons(numberOfSlides, $photocarouselContainer){
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    if (!$photocarouselContainer.settings.buttonsCreated){
      const $prevButton = $(document.createElement('button')).attr({class: 'left photocarousel-button noselect', name: 'previous'}).appendTo($photocarousel);
      const $prevButtonSymbol = $(document.createElement('span')).attr({class: 'glyphicon glyphicon-chevron-left', 'aria-hidden': true}).appendTo($prevButton);
      const $prevButtonName = $(document.createElement('span')).text('Previous').attr({class: 'sr-only'}).appendTo($prevButton);
      const $nextButton = $(document.createElement('button')).attr({class: 'right photocarousel-button noselect', name: 'next'}).appendTo($photocarousel);
      const $nextButtonSymbol = $(document.createElement('span')).attr({class: 'glyphicon glyphicon-chevron-right', 'aria-hidden': true}).appendTo($nextButton);
      const $nextButtonName = $(document.createElement('span')).text('Next').attr({class: 'sr-only'}).appendTo($nextButton);
      $photocarouselContainer.settings.buttonsCreated = true;
    } else if ($photocarouselContainer.settings.buttonsCreated && numberOfSlides > 1){
      $photocarousel.find('.photocarousel-button').show();
    }
    if (numberOfSlides < 2){
      $photocarousel.find('.photocarousel-button').hide();
    }

    return;
  }

  /**
   * createPhotocarouselDivs
   * This function creates photocarousel divs to be attached to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   * @param {JQuery} $photocarousel The container to be appended to
   */
  function createPhotocarouselDivs(numberOfSlides, $photocarouselContainer){
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    for (let i = 0; i < numberOfSlides; i++) {
      let imagePath = buildLocalPath(images[i].path);
      let imageCaption = images[i].caption;
      createSinglePhotocarouselDiv(imagePath, imageCaption, $photocarousel);
    }
  }

  /**
   * createSinglePhotocarouselDiv
   * This function creates a single photocarousel div to be attached to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   * @param {JQuery} $photocarousel The container to be appended to
   */
  function createSinglePhotocarouselDiv(photoURL, photoTitle, $photocarousel) {
    // $(document.createElement('div')) is about 20% faster than $('<div>')
    // source: http://jsben.ch/bgvCV
    $(document.createElement('div'))
      .css('background-image', `url(${photoURL})`)
      .attr({class: 'photocarousel-div', title: photoTitle})
      .appendTo($photocarousel);
    return;
  }

  /**
   * createLoaderDiv
   * This function creates a loader div to be attached to the DOM
   * @param {JQuery} $photocarousel The container to be appended to
   */
  function createLoaderDiv($photocarouselContainer) {
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    $(document.createElement('div'))
      .attr('class', 'wait')
      .appendTo($photocarousel);
    $(document.createElement('img'))
      .attr({class: 'loader', src: 'images/ajax-loader.gif'})
      .appendTo($photocarousel.children('.wait'));

    return;
  }

  /**
   * createSearchFunction
   * This function creates a search bar div to be attached to the DOM
   * @param {boolean} searchFunction create search bar or not
   * @param {JQuery} $photocarousel The container to be appended to
   */
  function createSearchFunction(searchFunction, $photocarouselContainer) {
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    if (searchFunction && !$photocarouselContainer.settings.searchFunctionCreated) {
    const $fetchImageDiv = $(document.createElement('div')).attr('class', 'fetch-image col-md-12 col-lg-12').insertAfter($photocarousel);
    const $fetchImageForm = $(document.createElement('form'))
      .attr({class: 'fetch-image-form', action: ""});
    const $labelTitle = $(document.createElement('label'))
      .text('Search Terms');
    const $inputGroup = $(document.createElement('div'))
      .attr({class: 'input-group'});
    const $fetchKeywords = $(document.createElement('input'))
      .attr({type: 'text', class: 'form-control fetch-keywords', name: 'search-term', placeholder: 'Keywords to search for...'});
    const $inputGroupBtn = $(document.createElement('div'))
      .attr({class: 'input-group-btn'});
    const $submitBtn = $(document.createElement('button'))
      .attr({class: 'btn btn-default', type: 'submit'});
    const $submitBtnLogo = $(document.createElement('i'))
      .attr({class: 'fa fa-search', 'aria-hidden': true});
    const $resetBtn = $(document.createElement('button'))
      .text('Reset Images')
      .attr({class: 'btn btn-default reset', type: 'reset'});
    // const $resetBtnLogo = $(document.createElement('span'))
    //   .attr({class: 'glyphicon glyphicon-search'});
    $fetchImageDiv.append($fetchImageForm.append($labelTitle, $inputGroup.append($fetchKeywords, $inputGroupBtn.append($submitBtn.append($submitBtnLogo), $resetBtn))));
    $photocarouselContainer.settings.searchFunctionCreated = true;
    }
  }

  /**
   * removeButtons
   * This function hides the buttons when the number of slides is less than 2
   * @param {JQuery} $photocarousel The container to be referenced
   */
  function removeButtons($photocarousel){
    $photocarousel.find('button').hide();
  }

  /**
   * animateSlide
   * This function handles the logic for animation for the sliding transition
   * @param {JQuery} $active the current slide in the view
   * @param {JQuery} $nextSlide the next slide to be shown
   * @param {String} $command name of the command to determine direction of animation
   * @param {JQuery} $photocarousel The container to be referenced
   */
  function animateSlide($active, $nextSlide, command, $photocarouselContainer) {
    if (command === "next") {
      $active.animate({
        left: "-100%"
      }, {
        duration: 300,
        complete: function() {
          $(this).css('left', "");
          $(this).toggleClass('activeSlide');
          return;
        }
      });
      $nextSlide.animate({
        left: "0px"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('activeSlide');
          $(this).css('left', "");
          $photocarouselContainer.photocarouselData.active = true;
          return;
        }
      });
    } else {
      $active.animate({
        left: "100%"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('activeSlide');
          $(this).css('left', "");
          return;
        }
      });
      $nextSlide.animate({
        left: "-100%"
      }, {
        duration: 0
      }).animate({
        left: "0px"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('activeSlide');
          $(this).css('left', "");
          $photocarouselContainer.photocarouselData.active = true;
          return;
        }
      });
    }
    return;
  }

  /**
   * fetchImageHandler
   * This handler determines how the flickr api is being used
   * @param {event} event event object when clicked
   */
  function fetchImageHandler(event) {
    event.preventDefault();
    const $photocarouselContainer = event.data.photocarouselContainer;
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    const keywords = $(this).find(".fetch-keywords").val().trim().split(/\s+/).join(',');
    const $loader = $photocarousel.children('.wait');
    try {
      if (!keywords){
        throw('Empty keywords not allowed');
      }
    } catch (e) {
      alert(`Error: ${e}`);
      return;
    }
    const apiKey = "fd5f20a53c009a33506904c2ab164800";
    const flickrurl = "https://api.flickr.com/services/rest/";
    $loader.show();
    var xhr = $.ajax({
      dataType: "json",
      url: flickrurl,
      data: {
        method: "flickr.photos.search",
        api_key: apiKey,
        format: 'json',
        nojsoncallback: 1,
        tags: keywords,
        safe_search: 1,
        content_type: 4,
        per_page: 20
      }
    }).done(function(rsp, textStatus, jqXHR) {
      if (rsp.stat !== 'ok') {
        console.log(rsp.stat + rsp.code + rsp.message);
        console.log('not ok');
        return;
      } else {
        const data = rsp.photos.photo;
        $photocarouselContainer.photocarouselData.imageData = data;
        $photocarouselContainer.photocarouselData.currentIndex = 0;
        render(0, $photocarouselContainer, 'fetch');
      }
      return;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('fail');
      console.log('textStatus = ' + textStatus);
      console.log('errorThrown = ' + errorThrown);
    }).always(function(){
      $loader.hide();
    });

    return;
  }

  function showLoader(xhr){

  }

  /**
   * photocarouselButtonHandler
   * This handler determines which slide is to be chosen next for transition
   * @param {event} event event object when clicked
   */
  function photocarouselButtonHandler(event) {
    const $photocarouselContainer = event.data.photocarouselContainer;
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    const $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    const buttonType = this.name;
    const buttonActive = $photocarouselContainer.photocarouselData.active;
    const currentIndex = $photocarouselContainer.photocarouselData.currentIndex;
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonActive) {
      $photocarouselContainer.photocarouselData.active = false;
      if (buttonType === "next" && $photocarouselDivs.length > 1) {
        if (nextIndex >= $photocarouselDivs.length - 1) {
          nextIndex = 0;
        } else {
          nextIndex += 1;
        }
      } else if (buttonType === "previous" && $photocarouselDivs.length > 1) {
        if (nextIndex <= 0) {
          nextIndex = $photocarouselDivs.length - 1;
        } else {
          nextIndex -= 1;
        }
      } else {
        // TODO: allow the user to know that there is only one slide in the
        // carousel, perhaps by adding dots to indicate the current slide
        console.log("only 1 image displayed");
        return;
      }
    } else {
      return;
    }

    // $photocarousel.data('current-index', nextIndex);
    $photocarouselContainer.photocarouselData.currentIndex = nextIndex;
    render(nextIndex, $photocarouselContainer, buttonType);
    return;
  }

  /**
   * resetFetchHandler
   * This handler determines how to reset the photocarousel
   * @param {event} event event object when clicked
   */
  function resetFetchHandler(event){
  const $photocarouselContainer = event.data.photocarouselContainer;
  const $photocarousel = $photocarouselContainer.children('.photocarousel');
  const settings = $photocarouselContainer.settings;
  render(settings.startingIndex, $photocarouselContainer, this.type);
  }

  /**
   * bindHandlers
   * This function handles the logic for binding the handlers to the buttons
   * @param {JQuery} $photocarousel The container to be referenced
   */
  function bindHandlers($photocarouselContainer){
    const $photocarousel = $photocarouselContainer.children('.photocarousel');
    const $fetchImageForm = $photocarousel.siblings('.fetch-image').find('.fetch-image-form');
    const $photocarouselButton = $photocarousel.children('.photocarousel-button');
    const $resetButton = $photocarousel.siblings().find('.reset');
    $photocarouselButton.click({
      photocarouselContainer: $photocarouselContainer
    }, photocarouselButtonHandler);
    $fetchImageForm.submit({
      photocarouselContainer: $photocarouselContainer
    }, fetchImageHandler);
    $resetButton.click({
      photocarouselContainer: $photocarouselContainer
    }, resetFetchHandler);
    return;
  }


  /**
   * init
   * This function transforms the selected div into a photocarousel
   * @param {Object} options The options for the photocarousel
   * @param {String} photocarouselContainer The selector for the container to be referenced
   */
  $.fn.photocarousel = function(options){
    const $photocarouselContainer = this;
    const defaults = {
      startingIndex: 0,
      numberOfSlides: 5,
      searchFunction: false
    };

    const settings = $.extend(defaults, options);
    const startingIndex = settings.startingIndex;
    const numberOfSlides = settings.numberOfSlides;
    const searchFunction = settings.searchFunction;

    $photocarouselContainer.toggleClass('photocarousel-container');
    try {
      if (options.startingIndex >= options.numberOfSlides){
        throw('Index out of range of number of slides to be displayed');
      }
      if ($photocarouselContainer === undefined || $photocarouselContainer === "" || !$photocarouselContainer.length) {
        throw('Please provide a valid selector for photocarouselContainer');
      }
      if (options.startingIndex > (images.length - 1) || options.startingIndex < 0){
        throw('index out of range of local images');
      }
      if (options.numberOfSlides > images.length){
        throw('numberOfSlides is more than local images size, consider choosing a smaller number');
      }
    } catch (e) {
      console.error(e);
    }

    //appending settings and photocarousel data to the jquery object
    $photocarouselContainer.settings = settings;
    $photocarouselContainer.photocarouselData = {
      currentIndex: startingIndex,
      active: true,
      imageData: undefined,
      buttonsCreated: false,
      searchFunctionCreated: false,
      originalImages: true
    };
    render(startingIndex, $photocarouselContainer, 'init');
    bindHandlers($photocarouselContainer);
    return;
  };

  const options0 = {
    startingIndex: 0,
    numberOfSlides: 1,
    searchFunction: true
  };
  const options1 = {
    startingIndex: 1,
    numberOfSlides: 5,
    searchFunction: true
  };


  $("#photocarousel0").photocarousel(options0);
  $("#photocarousel1").photocarousel(options1);
});
// User initialise with their own images
// endpoint modification
// less strict on the fetch image, can be placed somewhere else
// dots to indicate the number of slides inside the carousel
// this reference to the object for oop
// add row to the photocarousel div class
// loading gif should only show for its own photocarousel

$(() => {

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
   * This function builds photocarousel-divs
   * @param {Object} opts name of the picture in images directory
   * @param {Number} nextIndex name of the picture in images directory
   * @param {jQuery} $photocarousel name of the picture in images directory
   * @param {String} buttonType name of the picture in images directory
   */
  function render(opts, nextIndex, $photocarousel, buttonType = 'init') {
    let $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    let $active = $photocarousel.children('.activeSlide');
    let $nextSlide = $photocarouselDivs.eq(nextIndex);
    try {
      if (buttonType === 'init' || buttonType === 'fetch') {
        buildDOM($photocarousel, buttonType, opts);
        $photocarouselDivs = $photocarousel.children('.photocarousel-div');
        $active = $photocarousel.children('.activeSlide');
        $nextSlide = $photocarouselDivs.eq(nextIndex);
        $nextSlide.toggleClass('activeSlide');
      } else if (buttonType === "previous" || buttonType === "next") {
        animateSlide($active, $nextSlide, buttonType, $photocarousel);
      } else {
        throw (buttonType);
      }
    } catch (error) {
      console.log("buttonType = " + error);
      console.log("Error. Unrecognised buttonType referenced");
    }
    $photocarousel.attr('title', $nextSlide.attr('title'));

    return;
  }
  /**
   * This function builds photocarousel-divs
   * @param {JQuery} $photocarousel The container to be appended to
   * @param {String} buttonType Name of button that is being pressed
   * @param {Object} opts options for the number of slides to be built
   * @returns {boolean} success/fail
   */
  function buildDOM($photocarousel, buttonType, opts) {
    const $removedDivs = $photocarousel.children('.photocarousel-div').detach();
    if (buttonType === 'init') {
      createButtons(opts.numberOfSlides, $photocarousel);
      createLoaderDiv($photocarousel);
      for (let i = 0; i < opts.numberOfSlides; i++) {
        let imagePath = buildLocalPath(images[i].path);
        let imageCaption = images[i].caption;
        createPhotocarouselDiv(imagePath, imageCaption, $photocarousel);
      }
      createSearchFunction(opts.searchFunction, $photocarousel);
    } else if (buttonType === 'fetch') {
      const data = opts.data;
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

        createPhotocarouselDiv(photoURL, photoTitle, $photocarousel);
      }

    }
    return ;
  }

  function createButtons(numberOfSlides, $photocarousel){
    if (numberOfSlides > 1){
      const $prevButton = $(document.createElement('button')).attr({class: 'left photocarousel-button noselect', name: 'previous'}).appendTo($photocarousel);
      const $prevButtonSymbol = $(document.createElement('span')).attr({class: 'glyphicon glyphicon-chevron-left', 'aria-hidden': true}).appendTo($prevButton);
      const $prevButtonName = $(document.createElement('span')).text('Previous').attr({class: 'sr-only'}).appendTo($prevButton);
      const $nextButton = $(document.createElement('button')).attr({class: 'right photocarousel-button noselect', name: 'next'}).appendTo($photocarousel);
      const $nextButtonSymbol = $(document.createElement('span')).attr({class: 'glyphicon glyphicon-chevron-right', 'aria-hidden': true}).appendTo($nextButton);
      const $nextButtonName = $(document.createElement('span')).text('Next').attr({class: 'sr-only'}).appendTo($nextButton);
    }
    return;
  }

  function createPhotocarouselDiv(photoURL, photoTitle, $photocarousel) {
    // $(document.createElement('div')) is about 20% faster than $('<div>')
    // source: http://jsben.ch/bgvCV
    $(document.createElement('div'))
      .css('background-image', `url(${photoURL})`)
      .attr('class', 'photocarousel-div')
      .attr('title', photoTitle)
      .appendTo($photocarousel);
    return;
  }

  function createLoaderDiv($photocarousel) {

    $(document.createElement('div'))
      .attr('class', 'wait')
      .appendTo($photocarousel);
    $(document.createElement('img'))
      .attr('class', 'loader')
      .attr('src', 'images/ajax-loader.gif')
      .appendTo($photocarousel.children('.wait'));

    return;
  }

  function createSearchFunction(searchFunction, $photocarousel) {
    if (searchFunction) {
    const $fetchImageDiv = $(document.createElement('div')).attr('class', 'fetch-image col-md-12 col-lg-12').insertAfter($photocarousel);
    // const $fetchImageDiv = $photocarousel.siblings('.fetch-image');
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
    const $submitBtnLogo = $(document.createElement('span'))
      .attr({class: 'glyphicon glyphicon-search'});
    const $resetBtn = $(document.createElement('button'))
      .text('Reset Images')
      .attr({class: 'btn btn-default reset', type: 'button', disabled: true});
    // const $resetBtnLogo = $(document.createElement('span'))
    //   .attr({class: 'glyphicon glyphicon-search'});
    $fetchImageDiv.append($fetchImageForm.append($labelTitle, $inputGroup.append($fetchKeywords, $inputGroupBtn.append($submitBtn.append($submitBtnLogo), $resetBtn))));
    }
  }

  /*
   * Animates the carousel sliding
   *
   */
  function animateSlide($active, $nextSlide, command, $photocarousel) {
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
          // $photocarousel.data('active', true);
          $photocarousel.photocarouselData.active = true;
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
          // $photocarousel.data('active', true);
          $photocarousel.photocarouselData.active = true;
          return;
        }
      });
    }
    return;
  }

  /** fetches images from flickr and displays them in the image container
    *
    */
  function fetchImageHandler(event) {
    event.preventDefault();
    const $photocarousel = event.data.photocarousel;
    const keywords = $(this).find(".fetch-keywords").val().trim().split(/\s+/).join(',');
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
      console.log('done');
      if (rsp.stat !== 'ok') {
        console.log(rsp.stat + rsp.code + rsp.message);
        console.log('not ok');
        return;
      } else {
        // const $removedDivs = $photocarousel.children('.photocarousel-div').detach();
        const data = rsp.photos.photo;
        // $photocarousel.data('current-index', 0);
        $photocarousel.photocarouselData.currentIndex = 0;
        render({
          data: data
        }, 0, $photocarousel, 'fetch');
      }
      return;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('fail');
      console.log('textStatus = ' + textStatus);
      console.log('errorThrown = ' + errorThrown);
    });

    return;
  }

  /*
   * handles the logic for clicking the buttons
   */
  function photocarouselButtonHandler(event) {
    const $photocarousel = event.data.photocarousel;
    const $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    const buttonType = this.name;
    const buttonActive = $photocarousel.photocarouselData.active;
    const currentIndex = $photocarousel.photocarouselData.currentIndex;
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonActive) {
      $photocarousel.photocarouselData.active = false;
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
    $photocarousel.photocarouselData.currentIndex = nextIndex;
    render({}, nextIndex, $photocarousel, buttonType);
    return;
  }


  function resetFetchHandler(event){
    console.log('reset clicked');
    const $photocarousel = event.data.photocarousel;
    const opts = $photocarousel.settings;
    render(opts, opts.startingIndex, $photocarousel, 'init');
  }

  function bindHandlers($photocarousel){
    const $fetchImageForm = $photocarousel.siblings('.fetch-image').find('.fetch-image-form');
    const $photocarouselButton = $photocarousel.children('.photocarousel-button');
    const $resetButton = $photocarousel.siblings().find('.reset');
    $photocarouselButton.click({
      photocarousel: $photocarousel
    }, photocarouselButtonHandler);
    $fetchImageForm.submit({
      photocarousel: $photocarousel
    }, fetchImageHandler);
    $resetButton.click({
      photocarousel: $photocarousel
    }, resetFetchHandler);
    return;
  }

  function bindLoader(className) {
    $(document).ajaxStart(function() {
      $(className).show();
    }).ajaxComplete(function() {
      $(className).hide();
    });
    return;
  }
  /*
   * Initialises which slide to be displayed first
   *
   */
  function init(options, photocarouselContainer) {
    const defaults = {
      startingIndex: 0,
      numberOfSlides: 5,
      searchFunction: false
    };

    const settings = $.extend(defaults, options);
    const startingIndex = settings.startingIndex;
    const numberOfSlides = settings.numberOfSlides;
    const searchFunction = settings.searchFunction;

    const $photocarouselContainer = $(photocarouselContainer);
    const $photocarousel = $photocarouselContainer.children('.photocarousel');

    try {
      if (options.startingIndex >= options.numberOfSlides){
        throw('Index out of range of number of slides to be displayed');
      }
      if (photocarouselContainer === undefined || photocarouselContainer === "" || !$photocarouselContainer.length) {
        throw('Please provide a valid selector for photocarouselContainer');
      }
    } catch (e) {
      console.error(e);
    }
    $photocarousel.settings = settings;
    $photocarousel.photocarouselData = {
      currentIndex: startingIndex,
      active: true
    };
    render(settings, startingIndex, $photocarousel, 'init');
    bindLoader('.wait');
    bindHandlers($photocarousel);
    return;
  }

  const options0 = {
    startingIndex: 0,
    numberOfSlides: 5,
    searchFunction: true
  };
  const options1 = {
    startingIndex: 1,
    numberOfSlides: 2,
  };
  init(options0, '#photocarousel0');
  init(options1, '#photocarousel1');
  // TODO: parameterise the photocarousel divs in init function
  // store states in memory instead of on the dom
  // create the divs using one single function

  // Implement visual demarcation of photocarousels
});

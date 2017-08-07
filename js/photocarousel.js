;(function($, window, document) {

  // initialise defaults
  const pluginName = "Photocarousel";
  const defaults = {
    startingIndex: 0,
    numberOfSlides: 5,
    searchFunction: false,
    isUserImages: true
  };
  const defaultPhotocarouselData = {
    currentIndex: undefined,
    nextIndex: undefined,
    active: true,
    imageData: undefined,
    buttonsCreated: false,
    searchFunctionCreated: false,
    originalImages: true
  };
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

  // constructor
  function Photocarousel(element, options) {
    const _ = this;
    _._defaults = defaults;
    _._name = pluginName;
    _.$photocarouselContainer = $(element);
    _.$photocarousel = _.$photocarouselContainer.children('.photocarousel');
    _.options = $.extend({}, defaults, options);

    _.photocarouselData = $.extend({}, defaultPhotocarouselData);
    _.photocarouselData.currentIndex = options.startingIndex;
    _.init();
  }

  Photocarousel.prototype.init = function() {
    const _ = this;
    const options = _.options;
    const startingIndex = options.startingIndex;
    const numberOfSlides = options.numberOfSlides;
    const searchFunction = options.searchFunction;
    const isUserImages = options.isUserImages;
    _.photocarouselData.currentIndex = startingIndex;
    _.photocarouselData.nextIndex = startingIndex;
    _.$photocarouselContainer.toggleClass('photocarousel-container');
    _.$photocarouselContainer.toggleClass('row');
    try {
      if (startingIndex >= numberOfSlides) {
        throw ('Index out of range of number of slides to be displayed');
      }
      if (_.$photocarouselContainer === undefined || _.$photocarouselContainer === "" || !_.$photocarouselContainer.length) {
        throw ('Please provide a valid selector for photocarouselContainer');
      }
      if (startingIndex > (images.length - 1) || startingIndex < 0) {
        throw ('index out of range of local images');
      }
      if (numberOfSlides > images.length) {
        throw ('numberOfSlides is more than local images size, consider choosing a smaller number');
      }
      if (isUserImages) {
        if (_.$photocarouselContainer.children('img').length < 1) {
          throw ('Photocarousel Container must contain img tags');
        }
      }

    } catch (e) {
      console.error(e);
    }
    _.render('init');
    _.bindHandlers();
    return;
  };

  /**
   * render
   * This function is responsible for how the DOM should be displayed
   * @param {String} buttonType name of the button being pressed
   */
  Photocarousel.prototype.render = function(buttonType = 'init') {
    const _ = this;
    const $photocarouselContainer = _.$photocarouselContainer;
    const validBuildButtons = ['init', 'fetch', 'reset'];
    const validAnimationButtons = ['previous', 'next'];
    let currentIndex = _.photocarouselData.currentIndex;
    let nextIndex = _.photocarouselData.nextIndex;
    let $photocarousel = _.$photocarousel;
    let $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    let $active = $photocarousel.children('.activeSlide');
    let $nextSlide = $photocarouselDivs.eq(nextIndex);
    if (validBuildButtons.includes(buttonType)) {
      _.buildDOM(buttonType);
      $photocarouselDivs = _.$photocarousel.children('.photocarousel-div');
      $nextSlide = $photocarouselDivs.eq(nextIndex);
      $nextSlide.toggleClass('activeSlide');
    } else if (validAnimationButtons.includes(buttonType)) {
      _.animateSlide($active, $nextSlide, buttonType);
      _.photocarouselData.currentIndex = nextIndex;
    } else {
      console.error("buttonType = " + error);
      return;
    }
    $photocarousel.attr('title', $nextSlide.attr('title'));

    return;
  };

  /**
   * buildDOM
   * This function builds photocarousel-divs
   * @param {String} buttonType Name of button that is being pressed
   */
  Photocarousel.prototype.buildDOM = function(buttonType) {
    const _ = this;
    const $removedDivs = _.$photocarousel.children('.photocarousel-div').detach();
    if (buttonType === 'init') {
      _.createPhotocarousel();
      _.createButtons();
      _.createLoaderDiv();
      _.createPhotocarouselDivs();
      _.createSearchFunction();
    } else if (buttonType === 'fetch') {
      const data = _.photocarouselData.imageData;
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

          _.createSinglePhotocarouselDiv(photoURL, photoTitle);
        }
        _.createButtons();
      }
      if (data.length === 1) {
        _.$photocarousel.find('.photocarousel-button').hide();
      }
    } else if (buttonType === 'reset') {
      _.createButtons();
      _.createPhotocarouselDivs();
    }
    return;
  };

  /**
   * createPhotocarousel
   * This function creates photocarousel to be attached to the DOM
   */
  Photocarousel.prototype.createPhotocarousel = function() {
    const _ = this;
    _.$photocarousel = $(document.createElement('div'))
      .attr({
        class: 'photocarousel col-md-12 col-lg-12'
      })
      .appendTo(_.$photocarouselContainer);
    return;
  };

  /**
   * createButtons
   * This function creates buttons to attach to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   */
  Photocarousel.prototype.createButtons = function() {
    const _ = this;
    const options = _.options;
    if (!_.photocarouselData.buttonsCreated) {
      const $prevButton = $(document.createElement('button')).attr({
        class: 'left photocarousel-button noselect',
        name: 'previous'
      }).appendTo(_.$photocarousel);
      const $prevButtonSymbol = $(document.createElement('span')).attr({
        class: 'glyphicon glyphicon-chevron-left',
        'aria-hidden': true
      }).appendTo($prevButton);
      const $prevButtonName = $(document.createElement('span')).text('Previous').attr({
        class: 'sr-only'
      }).appendTo($prevButton);
      const $nextButton = $(document.createElement('button')).attr({
        class: 'right photocarousel-button noselect',
        name: 'next'
      }).appendTo(_.$photocarousel);
      const $nextButtonSymbol = $(document.createElement('span')).attr({
        class: 'glyphicon glyphicon-chevron-right',
        'aria-hidden': true
      }).appendTo($nextButton);
      const $nextButtonName = $(document.createElement('span')).text('Next').attr({
        class: 'sr-only'
      }).appendTo($nextButton);
      _.photocarouselData.buttonsCreated = true;
    } else if (_.photocarouselData.buttonsCreated && _.options.numberOfSlides > 1) {
      _.$photocarousel.find('.photocarousel-button').show();
    }
    if (_.options.numberOfSlides < 2) {
      _.$photocarousel.find('.photocarousel-button').hide();
    }

    return;
  };

  /**
   * createPhotocarouselDivs
   * This function creates photocarousel divs to be attached to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   */
  Photocarousel.prototype.createPhotocarouselDivs = function() {
    const _ = this;
    if (!_.options.isUserImages) {
      for (let i = 0; i < _.options.numberOfSlides; i++) {
        let imagePath = buildLocalPath(images[i].path);
        let imageCaption = images[i].caption;
        _.createSinglePhotocarouselDiv(imagePath, imageCaption);
      }
    } else {
      const $imgs = _.$photocarouselContainer.children('img').detach();
      _.photocarouselData.imageData = $imgs;
      $imgs.each(function(i){
        let imagePath = $(this).attr('src');
        let imageCaption = $(this).attr('title');
        _.createSinglePhotocarouselDiv(imagePath, imageCaption);
      });
    }
  };

  /**
   * createSinglePhotocarouselDiv
   * This function creates a single photocarousel div to be attached to the DOM
   * @param {Number} numberOfSlides number of slides to be displayed
   */
  Photocarousel.prototype.createSinglePhotocarouselDiv = function(photoURL, photoTitle) {
    // $(document.createElement('div')) is about 20% faster than $('<div>')
    // source: http://jsben.ch/bgvCV
    const _ = this;
    $(document.createElement('div'))
      .css('background-image', `url(${photoURL})`)
      .attr({
        class: 'photocarousel-div',
        title: photoTitle
      })
      .appendTo(_.$photocarousel);
    return;
  };

  /**
   * createLoaderDiv
   * This function creates a loader div to be attached to the DOM
   */
  Photocarousel.prototype.createLoaderDiv = function() {
    const _ = this;
    $(document.createElement('div'))
      .attr('class', 'wait')
      .appendTo(_.$photocarousel);
    $(document.createElement('img'))
      .attr({
        class: 'loader',
        src: 'images/ajax-loader.gif'
      })
      .appendTo(_.$photocarousel.children('.wait'));
    return;
  };

  /**
   * createSearchFunction
   * This function creates a search bar div to be attached to the DOM
   * @param {boolean} searchFunction create search bar or not
   */
  Photocarousel.prototype.createSearchFunction = function() {
    const _ = this;
    const $photocarousel = _.$photocarousel;
    if (_.options.searchFunction && !_.photocarouselData.searchFunctionCreated) {
      const $fetchImageDiv = $(document.createElement('div'))
        .attr('class', 'fetch-image col-md-12 col-lg-12')
        .insertAfter(_.$photocarousel);
      const $fetchImageForm = $(document.createElement('form'))
        .attr({
          class: 'fetch-image-form',
          action: ""
        });
      const $labelTitle = $(document.createElement('label'))
        .text('Search Terms');
      const $inputGroup = $(document.createElement('div'))
        .attr({
          class: 'input-group'
        });
      const $fetchKeywords = $(document.createElement('input'))
        .attr({
          type: 'text',
          class: 'form-control fetch-keywords',
          name: 'search-term',
          placeholder: 'Keywords to search for...'
        });
      const $inputGroupBtn = $(document.createElement('div'))
        .attr({
          class: 'input-group-btn'
        });
      const $submitBtn = $(document.createElement('button'))
        .attr({
          class: 'btn btn-default',
          type: 'submit'
        });
      const $submitBtnLogo = $(document.createElement('i'))
        .attr({
          class: 'fa fa-search',
          'aria-hidden': true
        });
      const $resetBtn = $(document.createElement('button'))
        .text('Reset Images')
        .attr({
          class: 'btn btn-default reset',
          type: 'reset'
        });
      // const $resetBtnLogo = $(document.createElement('span'))
      //   .attr({class: 'glyphicon glyphicon-search'});
      $fetchImageDiv.append($fetchImageForm.append($labelTitle, $inputGroup.append($fetchKeywords, $inputGroupBtn.append($submitBtn.append($submitBtnLogo), $resetBtn))));
      _.photocarouselData.searchFunctionCreated = true;
    }
  };


  /**
   * animateSlide
   * This function handles the logic for animation for the sliding transition
   * @param {JQuery} $active the current slide in the view
   * @param {JQuery} $nextSlide the next slide to be shown
   * @param {String} $command name of the command to determine direction of animation
   */
  Photocarousel.prototype.animateSlide = function($active, $nextSlide, command) {
    const _ = this;
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
          _.photocarouselData.active = true;
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
          _.photocarouselData.active = true;
          return;
        }
      });
    }
    return;
  };

  /**
   * bindHandlers
   * This function handles the logic for binding the handlers to the buttons
   */
  Photocarousel.prototype.bindHandlers = function(){
    const _ = this;
    const $photocarousel = _.$photocarousel;
    const $fetchImageForm = $photocarousel.siblings('.fetch-image').find('.fetch-image-form');
    const $photocarouselButton = $photocarousel.children('.photocarousel-button');
    const $resetButton = $photocarousel.siblings().find('.reset');
    // pass the context 'this' into the event data
    $photocarouselButton.click({
      _: _
    }, photocarouselButtonHandler);
    $fetchImageForm.submit({
      _: _
    }, fetchImageHandler);
    $resetButton.click({
      _: _
    }, resetFetchHandler);
    return;
  };

  /**
   * fetchImageHandler
   * This handler determines how the flickr api is being used
   * @param {event} event event object when clicked
   */
  function fetchImageHandler(event) {
    event.preventDefault();
    const _ = event.data._;
    const $photocarouselContainer = _.$photocarouselContainer;
    const keywords = $(this).find(".fetch-keywords").val().trim().split(/\s+/).join(',');
    const $loader = _.$photocarousel.children('.wait');
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
        _.photocarouselData.imageData = data;
        _.photocarouselData.currentIndex = 0;
        _.render('fetch');
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

  /**
   * photocarouselButtonHandler
   * This handler determines which slide is to be chosen next for transition
   * @param {event} event event object when clicked
   */
  function photocarouselButtonHandler(event) {
    const _ = event.data._;
    const $photocarouselContainer = _.$photocarouselContainer;
    const $photocarousel = _.$photocarousel;
    const $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    const buttonType = this.name;
    const buttonActive = _.photocarouselData.active;
    const currentIndex = _.photocarouselData.currentIndex;
    let nextIndex = currentIndex;
    //check which button is being pressed and determine the next index
    if (buttonActive) {
      _.photocarouselData.active = false;
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
    _.photocarouselData.nextIndex = nextIndex;
    _.render(buttonType);
    return;
  }

  /**
   * resetFetchHandler
   * This handler determines how to reset the photocarousel
   * @param {event} event event object when clicked
   */
  function resetFetchHandler(event){
  const _ = event.data._;
  const $photocarouselContainer = _.photocarouselContainer;
  const $photocarousel = _.$photocarousel;
  _.render(this.type);
  }
  /**
   * photocarouselDotHandler
   * This handler determines which image to jump to when the dots are being pressed
   *
   * @param {event} event event object when clicked
   */
  function photocarouselDotHandler(event) {
    const _ = event.data._;
    const $buttonPressed = $(this);
    const indexOfButton = $buttonPressed.index();
    // TODO:
    // fetch the index of the buttonPressed
    // check against the current index on the photocarousel
    // determine the next index of the photo that is to be pressed
    // update index
    // tweak to
  }

  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Photocarousel(this, options));
      }
    });
  };
  // TODO:
  // User initialise with their own images
  // dots to indicate the number of slides inside the carousel
  // endpoint modification
  // less strict on the fetch image, can be placed somewhere else
  // this reference to the object for oop
  // add row to the photocarousel div class

})(jQuery, window, document);

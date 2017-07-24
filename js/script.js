$(() => {
  // TODO:
  // Make this script into plug-in like
  // The init function would take in the id of the element
  // subsequent functions are dependent on the id of that


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

  function buildLocalPath(name) {
    return `images/${name}`;
  }
  /*
   * handles the logic for clicking the buttons
   */
  function photocarouselButtonHandler(event) {
    const $photocarousel = event.data.photocarousel;
    const $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    const buttonType = this.name;
    const buttonActive = $photocarousel.data('active');
    const currentIndex = $photocarousel.data('current-index');
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonActive) {
      $photocarousel.data('active', false);
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

    $photocarousel.data('current-index', nextIndex);
    render(nextIndex, $photocarousel, buttonType);
    return;
  }

  /*
   * Handles the logic of the next slide to be displayed
   */
  function render(nextIndex, $photocarousel, buttonType = 'init') {
    const $photocarouselDivs = $photocarousel.children('.photocarousel-div');
    const $active = $photocarousel.children('.active');
    const $nextSlide = $photocarouselDivs.eq(nextIndex);
    try {
      if (buttonType === 'init') {
        $nextSlide.toggleClass('active');
        $.each($photocarouselDivs, function(i, v) {
          let imagePath = buildLocalPath(images[i].path);
          let imageCaption = images[i].caption;
          $(this).css('background-image', `url(${imagePath})`);
          $(this).attr('title', imageCaption);
        });
      } else if (buttonType === 'fetch') {
        $nextSlide.toggleClass('active');
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
          $(this).css('left', "");
          $photocarousel.data('active', true);
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
          $(this).toggleClass('active');
          $(this).css('left', "");
          $photocarousel.data('active', true);
          return;
        }
      });
    }
    return;
  }

  // fetches images from flickr and displays them in the image container
  function fetchImageHandler(event) {
    event.preventDefault();
    const $photocarousel = event.data.photocarousel;
    const keywords = $(this).find(".fetch-keywords").val().trim().split(/\s+/).join(',');
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
        per_page: 50
      }
    }).done(function(rsp, textStatus, jqXHR) {
      console.log('done');
      if (rsp.stat !== 'ok') {
        console.log(rsp.stat + rsp.code + rsp.message);
        console.log('not ok');
        return;
      } else {
        const $removedDivs = $photocarousel.children('.photocarousel-div').detach();
        for (let i = 0; i < rsp.photos.photo.length; i++) {
          let photo = rsp.photos.photo[i];
          let id = photo.id;
          let farmId = photo.farm;
          let serverId = photo.server;
          let secret = photo.secret;
          let photoTitle = photo.title;
          let mstzb = 'z'; //photosize
          let photoURL = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${mstzb}.jpg`
          // (secondary) loading gif added over the container
          // make elements to be added into the dom
          // remove current images (possibly store them)
          // reset the index -> display the images

          // div -> background-image
          // $photocarousel append(div)
          let div = document.createElement('div');
          $div = $(div);
          $div.css('background-image', `url(${photoURL})`);
          $div.attr('class', 'photocarousel-div');
          $div.attr('title', photoTitle);
          $photocarousel.append(div);
        }
        $photocarousel.data('current-index', 0);
        render(0, $photocarousel, 'fetch');
      }
      return;
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('fail');
      console.log('textStatus = ' + textStatus);
      console.log('errorThrown = ' + errorThrown);
    });

    return;
  }

  function bindLoader(className) {
    $(document).ajaxStart(function() {
      $(className).show();
    }).ajaxComplete(function() {
      $(className).hide();
    });
  }

  /*
   * Initialises which slide to be displayed first
   *
   */
  function init(startingIndex, photocarousel) {
    const $photocarouselButton = $(`${photocarousel} .photocarousel .photocarousel-button`);
    const $photocarousel = $(photocarousel).children('.photocarousel');
    const $fetchImage = $(photocarousel).children('.fetch-image');
    $photocarousel.data('current-index', startingIndex);
    $photocarousel.data('active', true);
    $photocarouselButton.click({photocarousel: $photocarousel}, photocarouselButtonHandler);
    $fetchImage.find('.fetch-image-form').submit({photocarousel: $photocarousel}, fetchImageHandler);
    bindLoader('.wait');
    render(startingIndex, $photocarousel);
    return;
  }
  init(0, '#photocarousel0');
  init(1, '#photocarousel1');
});

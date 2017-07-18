$(() => {
  /*
   * handles the logic for clicking the buttons
   */
  function photocarouselButtonHandler(event) {
    $photocarouselbutton = $('.photocarousel-button');
    $imagecontainer = $('.image-container');
    const buttonType = event.currentTarget.name;
    const buttonActive = $photocarouselbutton.data('active');
    const $catdivs = $('.cat-div');
    const currentIndex = $imagecontainer.data('current-index');
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonActive) {
      $photocarouselbutton.data('active', false);
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
    } else {
      return;
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
    const $imageContainer = $('.image-container');
    const containerHeight = $imageContainer.height();
    const containerWidth = $imageContainer.width();
    if (buttonType === 'init') {
      // $.each($catdivs, function(i, v) {
      //   let $that = $(this);
      //   const ratio = calculateAspectRatioFit($that.width(), $that.height(), containerWidth, containerHeight);
      //   $that.width(ratio.width);
      //   $that.height(ratio.height);
      // });
      $('.cat-div').eq(nextIndex).toggleClass('active');
    } else {
      animateSlide($active, $nextSlide, buttonType);
    }

    return;
  }

  /**
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @return {Object} { width, heigth }
 */
  function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

     var ratio = Math.floor(Math.min(maxWidth / srcWidth, maxHeight / srcHeight));

     return { width: srcWidth*ratio, height: srcHeight*ratio };
  }


  /*
   * Animates the carousel sliding
   *
   */
  function animateSlide($active, $nextSlide, command) {
    $photocarouselbutton = $(".photocarousel-button");
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
          $(this).removeAttr('style');
          $photocarouselbutton.data('active', true);
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
      }, {
        duration: 0
      }).animate({
        left: "0px"
      }, {
        duration: 300,
        complete: function() {
          $(this).toggleClass('active');
          $(this).removeAttr('style');
          $photocarouselbutton.data('active', true);
          return;
        }
      });
    }

    return;
  }

  // feature not ready yet
  function fetchImageHandler(event) {
    event.preventDefault();
    const keywords = $("#fetch-keywords").val().trim().split(/\s+/).join(',');
    const apiKey = "fd5f20a53c009a33506904c2ab164800";
    const flickrurl = "https://api.flickr.com/services/rest/";
    console.log('execute');
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
      if (rsp.stat !== 'ok'){
        console.log(rsp.stat + rsp.code + rsp.message);
        console.log('not ok');
        return;
      } else {
        const $removedDivs = $('.cat-div').detach();
        const $imageContainer = $('.image-container');
        for (let i = 0; i < rsp.photos.photo.length; i++) {
          let photo = rsp.photos.photo[i];
          let id= photo.id;
          let farmId = photo.farm;
          let serverId = photo.server;
          let secret = photo.secret;
          let photoTitle = photo.title;
          let mstzb = 'z'; //photosize
          let photoURL = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${mstzb}.jpg`
          // (secondary) loading gif to be added over the container
          // make elements to be added into the dom
          // remove current images (possibly store them)
          // reset the index -> display the images

          // div -> images
          let img = document.createElement('img');
          let div = document.createElement('div');
          img.setAttribute('class', 'cat-image');
          img.setAttribute('src', photoURL);
          img.setAttribute('title', photoTitle);
          // div.append(img);
          div.setAttribute('class', 'cat-div');
          div.setAttribute('background-image', `url(\"${photoURL}\") no-repeat center center`);
          $imageContainer.append(div);

        }
        $imageContainer.data('current-index', 0);
        render(0);
      }
      return;

    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('fail');
      console.log('textStatus = ' + textStatus);
      console.log(errorThrown);
    });

    return;
  }

  /*
   * Initialises which slide to be displayed first
   *
   */
  function init() {
    const startingIndex = 0;
    $photocarouselbutton = $(".photocarousel-button");
    $('.image-container').data('current-index', startingIndex);
    $photocarouselbutton.data('active', true);
    $photocarouselbutton.click(photocarouselButtonHandler);
    $('.fetch-image-form').submit(fetchImageHandler);
    render(startingIndex);
    return;
  }
  init();
});

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
    const keywords = $("#fetch-keywords").val().trim().split(/\s+/);
    const apiKey = "fd5f20a53c009a33506904c2ab164800";
    const flickrurl = "https://api.flickr.com/services/rest/?";
    console.log('execute');
    $.ajax({
      dataType: "xml",
      url: flickrurl,
      data: {
        method: "flickr.photos.search",
        api_key: apiKey,
        tags: 'superrare',
        safe_search: 1,
        content_type: 4
      }
    }).done(function(data) {
      console.log(data);
      console.log($.parseXML(data));
      // $.each(data.photos, function(i,item){
      //   var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
      //   console.log();
      //   //turn the photo id into a variable
      //   var photoID = item.id;
      // });

    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('fail');
    })


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

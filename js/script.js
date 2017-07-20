$(() => {
  // image array to store all the properties of the cat images, namely the path
  // and the caption.
  const images = [{
    path: "cate2.jpeg",
    caption: "Curious grey kitten"
  },{
    path: "cate3.jpeg",
    caption: "Cat licking off the last bits of his meal from its paw"
  },{
    path: "cate4.jpg",
    caption: "The cat stays still, keeping in mind not to startle its prey"
  },{
    path: "cate6.jpg",
    caption: "After destroying its toy, it looks for a new target"
  },{
    path: "cate7.jpg",
    caption: "The white furred cat stares into the camera lens, admiring its beautiful coloured green eyes"
  }
  ];
   function buildLocalPath(name) {
     return `images/${name}`;
   }
  /*
   * handles the logic for clicking the buttons
   */
  function photocarouselButtonHandler(event) {
    $photocarouselbutton = $('.photocarousel-button');
    $imagecontainer = $('.image-container');
    const buttonType = this.name;
    const buttonActive = $(this).data('active');
    const $photocarouselDivs = $('.photocarousel-div');
    const currentIndex = $imagecontainer.data('current-index');
    let nextIndex = currentIndex;

    //check which button is being pressed and determine the next index
    if (buttonActive) {
      $(this).data('active', false);
      if (buttonType === "next") {
        if (nextIndex >= $photocarouselDivs.length - 1) {
          nextIndex = 0;
        } else {
          nextIndex += 1;
        }
      } else {
        if (nextIndex <= 0) {
          nextIndex = $photocarouselDivs.length - 1;
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
    const $photocarouselDivs = $('.photocarousel-div');
    const $active = $('.active');
    const $nextSlide = $photocarouselDivs.eq(nextIndex);
    const $imageContainer = $('.image-container');
    if (buttonType === 'init') {
      $nextSlide.toggleClass('active');
      $.each($photocarouselDivs, function(i, v){
        let imagePath = buildLocalPath(images[i].path);
        let imageCaption = images[i].caption;
        $(this).css('background-image', `url(${imagePath})`);
        $(this).attr('title', imageCaption);
      });
    } else if (buttonType === 'fetch'){
      $nextSlide.toggleClass('active');
    } else if(buttonType === "previous" || buttonType === "next"){
      animateSlide($active, $nextSlide, buttonType);
    } else {
      console.log("buttonType = ");
      console.log("Error. Unrecognised buttonType referenced");
    }
    $imageContainer.attr('title', $nextSlide.attr('title'));

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
          $photocarouselbutton.data('active', true);
          return;
        }
      });
    }
    return;
  }

  // fetches images from flickr and displays them in the image container
  function fetchImageHandler(event) {
    event.preventDefault();
    const keywords = $("#fetch-keywords").val().trim().split(/\s+/).join(',');
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
      if (rsp.stat !== 'ok'){
        console.log(rsp.stat + rsp.code + rsp.message);
        console.log('not ok');
        return;
      } else {
        const $removedDivs = $('.photocarousel-div').detach();
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
          // (secondary) loading gif added over the container
          // make elements to be added into the dom
          // remove current images (possibly store them)
          // reset the index -> display the images

          // div -> background-image
          // $imageContainer append(div)
          let div = document.createElement('div');
          $div = $(div);
          $div.css('background-image', `url(${photoURL})`);
          $div.attr('class', 'photocarousel-div');
          $div.attr('title', photoTitle);
          $imageContainer.append(div);
        }
        $imageContainer.data('current-index', 0);
        render(0, 'fetch');
      }
      return;

    }).fail(function(jqXHR, textStatus, errorThrown) {

      console.log('fail');
      console.log('textStatus = ' + textStatus);
      console.log('errorThrown = ' + errorThrown);
    });

    return;
  }

  function bindLoader(id){
    $(document).ajaxStart(function() {
      // console.log('shown');
      $(id).show();
    }).ajaxComplete(function() {
      // console.log('hidden');
      $(id).hide();
    });
  }

  /*
   * Initialises which slide to be displayed first
   *
   */
  function init(startingIndex) {
    $photocarouselbutton = $(".photocarousel-button");
    $('.image-container').data('current-index', startingIndex);
    $photocarouselbutton.data('active', true);
    $photocarouselbutton.click(photocarouselButtonHandler);
    $('.fetch-image-form').submit(fetchImageHandler);
    bindLoader('#wait');
    render(startingIndex);
    return;
  }
  init(0);
});

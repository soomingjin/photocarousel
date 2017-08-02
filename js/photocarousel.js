

;(function ( $, window, document) {

    // initialise defaults
    const pluginName = "Photocarousel";
    const defaults = {
      startingIndex: 0,
      numberOfSlides: 5,
      searchFunction: false
    };
    const photocarouselData = {
      currentIndex: undefined,
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

    // constructor
    function Photocarousel( element, options ) {
      const _ = this;
      _._defaults = defaults;
      _._name = pluginName;
      _.$photocarouselContainer = $(element);

      _.options = $.extend( {}, defaults, options);

      _.photocarouselData = photocarouselData;
      _.photocarouselData.currentIndex = options.startingIndex;
      _.init();
    }

    Photocarousel.prototype.init = function(){
      const _ = this;
      const _options = this.options;
      const startingIndex = _options.startingIndex;
      const numberOfSlides = _options.numberOfSlides;
      const searchFunction = _options.searchFunction;
      console.log('ran');
      _.$photocarouselContainer.toggleClass('photocarousel-container');
      try {
        if (startingIndex >= numberOfSlides){
          throw('Index out of range of number of slides to be displayed');
        }
        if (_ === undefined || _ === "" || !_.length) {
          throw('Please provide a valid selector for photocarouselContainer');
        }
        if (startingIndex > (images.length - 1) || startingIndex < 0){
          throw('index out of range of local images');
        }
        if (numberOfSlides > images.length){
          throw('numberOfSlides is more than local images size, consider choosing a smaller number');
        }
      } catch (e) {
        console.error(e);
      }

      // _.render(startingIndex, $photocarouselContainer, 'init');
      // _.bindHandlers($photocarouselContainer);
      return;
    };

    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Photocarousel( this, options ));
            }
        });
    };

})( jQuery, window, document );

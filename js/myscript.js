$(function(){
  const options0 = {
    startingIndex: 0,
    numberOfSlides: 2,
    searchFunction: true,
    isUserImages: false
  };
  const options1 = {
    startingIndex: 1,
    numberOfSlides: 5,
    searchFunction: true,
    isUserImages: true
  };

  $("#photocarousel0").Photocarousel(options0);
  $("#photocarousel1").Photocarousel(options1);
  // $("#photocarousel0").photocarousel(options0);
  // $("#photocarousel1").photocarousel(options1);
  $('.photocarousel-dot').hover(function(){
    if(!$(this).hasClass('active-button')) {
      $(this).children('i').toggleClass('fa-circle').toggleClass('fa-circle-thin');
    }
  });


});

$('#multipleCarousel').carousel({
    interval: 2000
  })
  
  $('#multipleCarousel.carousel .carousel-item').each(function(){
      var next = $(this).next();
      if (!next.length) {
      next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
      
      for (var i=0;i<2;i++) {
          next=next.next();
          if (!next.length) {
              next = $(this).siblings(':first');
            }
          
          next.children(':first-child').clone().appendTo($(this));
        }
  });

  // Disable profile settings input field
  $(document).ready(function () {
    $( ".custom-input-control fieldset" ).prop( "disabled", true );    
    var hasAttr= $(".custom-input-control input[type=radio]");
    $(hasAttr).parent().addClass('pevent-none');
  });
  
  // Enable profile settings input field
  $("#editProfile").on('click', function () {
    $( ".custom-input-control fieldset" ).prop( "disabled", false );
    var hasAttr= $(".custom-input-control input[type=radio]");
    $(hasAttr).parent().removeClass('pevent-none');
  });

// $(document).ready(function(){
//   // Add smooth scrolling to all links
//   $("#addNewAddrs").on('click', function(event) {

//     // Make sure this.hash has a value before overriding default behavior
//     if (this.hash !== "") {
//       // Prevent default anchor click behavior
//       event.preventDefault();

//       // Store hash
//       var hash = this.hash;

//       // Using jQuery's animate() method to add smooth page scroll
//       // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
//       $('html, body').animate({
//         scrollTop: $(hash).offset().top
//       }, 800, function(){
   
//         // Add hash (#) to URL when done scrolling (default click behavior)
//         window.location.hash = hash;
//       });
//     } // End if
//   });
// });
// Multiple carousel slide one at a time



// Disable profile settings form fieldset
$(document).ready(function () {
    // $('#multipleCarousel').carousel({
    //     interval: 2000
    // });
    
    // $('#multipleCarousel.carousel .carousel-item').each(function () {
    //     var next = $(this).next();
    //     if (!next.length) {
    //         next = $(this).siblings(':first');
    //     }
    //     next.children(':first-child').clone().appendTo($(this));
    
    //     for (var i = 0; i < 2; i++) {
    //         next = next.next();
    //         if (!next.length) {
    //             next = $(this).siblings(':first');
    //         }
    
    //         next.children(':first-child').clone().appendTo($(this));
    //     }
    // });

    
    // $(".custom-input-control fieldset").prop("disabled", true);
    // var hasAttr = $(".custom-input-control input[type=radio]");
    // $(hasAttr).parent().addClass('pevent-none');
});

// Enable profile settings form fieldset
// $("#editProfile").on('click', function () {
//     $(".custom-input-control fieldset").prop("disabled", false);
//     var hasAttr = $(".custom-input-control input[type=radio]");
//     $(hasAttr).parent().removeClass('pevent-none');
// });


// Enable scrolling to particular collapsible section
$("a.scrollLink").click(function (event) {
    event.preventDefault();
    // var exphash = 
    var expanded = $($(this).attr("href")).hasClass("show");
    if (!expanded) {
        var fullHeight = $($(this).attr("href")).prev().outerHeight(true);
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top + fullHeight
        }, 500);
    }
});
 
// multilevel dropdown
$(document).ready(function(){
    // if($(window).width() > 991){
    //     $('.navbar li.dropdown').not($(".navbar li.dropdown.search-box")).hover(function() {
    //       $(this).addClass('show');
    //       $('.dropdown-menu:first',this).stop(true, true).addClass('show animated faster fadeIn');     
    //     //   $('#navbar-dropdown-ecommerce-link',this).stop(true, true).addClass('btn-yellow');
    //     }, function() {
    //         $(this).removeClass('show');
    //         // $('#navbar-dropdown-ecommerce-link',this).stop(true, true).removeClass('btn-yellow');
    //       $(this).children('.dropdown-menu').stop(true, true).removeClass('show');
    //     });  
    // }
    // else{
    //     $('.navbar li.dropdown').click(function() {
    //         $(this).addClass('show');
    //         $('.dropdown-menu:first',this).stop(true, true).addClass('show animated faster fadeIn');     
    //         // $('#navbar-dropdown-ecommerce-link',this).stop(true, true).addClass('btn-yellow');
    //       }, function() {
    //         $(this).removeClass('show');
    //         //  $('#navbar-dropdown-ecommerce-link',this).stop(true, true).removeClass('btn-yellow');
    //         $(this).children('.dropdown-menu').stop(true, true).removeClass('show');
    //       });  
    // }
  
});

// collapse button animate
// $(document).ready(function () {
//     $(".more-info").click(function () {
//         $(this).toggleClass('open');
//     })
// });


$(document).ready(function() {
    // removing wishlist item
    $(".circle-delete").on('click', function() {
        $(this).parents('.wishlist-item').remove();
    });


    /* Signin, Signup, Forgotten Password */
    // Auto-adjust page height
    var signInLeftColumn = '.signin-left-column';
    if($(signInLeftColumn).length){
        var windowHeight = $(window).height();

        if(windowHeight > 597){
            $(signInLeftColumn).css({'height' : windowHeight + 'px'});
        }

        // On window resize
        $(window).resize(function () {
            waitForFinalEvent(function(){

                var windowHeight = $(window).height();

                if(windowHeight > 597){
                    $(signInLeftColumn).css({'height' : windowHeight + 'px'});
                }

            }, 500, 'randomStringForSignupPage');
        });
    }

    // Add background image to the Right column
    var signInRightColumn = '.signin-right-column';
    if($(signInRightColumn).length){

        // Background Image
        if((typeof($(signInRightColumn).data('qp-bg-image')) !== 'undefined') && ($(signInRightColumn).data('qp-bg-image') != '')){
            var backgroundImage = $(signInRightColumn).data('qp-bg-image');

            $(signInRightColumn).css({'background-image' : 'url(img/' + backgroundImage + ')'});
        }
    }
});



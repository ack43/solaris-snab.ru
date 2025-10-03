/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        var target = $($anchor.attr('href'));
        var targetOffset = target.is('#page-top') || target.is('#fuel') ? 0 : target.offset().top;
        $('html, body').stop().animate({
            scrollTop: targetOffset
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

///// SCROLLSPY /////
function initScrollSpy() {
    var navbarHeight = $('.navbar-fixed-top').outerHeight();
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: navbarHeight + 10
    });
}

// Initialize
initScrollSpy();

// Update on resize
$(window).on('resize', function () {
    initScrollSpy();
});
/////////////////////////////////////////////////////////////////

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

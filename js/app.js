$('#primary-menu-trigger,#overlay-menu-close').click(function() {
    if( $('#primary-menu').find('ul.mobile-primary-menu').length > 0 ) {
        $( '#primary-menu > ul.mobile-primary-menu, #primary-menu > div > ul.mobile-primary-menu' ).toggleClass("show");
    } else {
        $( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show");
    }
    return false;
});

var $window = $(window),
    $body = $('body'),
    $wrapper = $('#wrapper'),
    $header = $('#header'),
    $headerWrap = $('#header-wrap'),
    $content = $('#content'),
    $footer = $('#footer'),
    $goToTopEl = $('#gotoTop'),
    windowWidth = $window.width();

var stickFooterOnSmall = function(){
    var windowH = $window.height(),
        wrapperH = $wrapper.height();

    if( !$body.hasClass('sticky-footer') && $footer.length > 0 && $wrapper.has('#footer') ) {
        if( windowH > wrapperH ) {
            $footer.css({ 'margin-top': ( windowH - wrapperH ) });
        }
    }
};

$window.on( 'resize', stickFooterOnSmall );
stickFooterOnSmall();

$(function() {
    $('.navigation').find('li.active').parents('li').addClass('active');
    $('.navigation').find('li').not('.active, .category-title').has('ul').children('ul').addClass('hidden-ul');
    $('.navigation').find('li').has('ul').children('a').addClass('has-ul');
    $('.dropdown-menu:not(.dropdown-content), .dropdown-menu:not(.dropdown-content) .dropdown-submenu').has('li.active').addClass('active').parents('.navbar-nav .dropdown:not(.language-switch), .navbar-nav .dropup:not(.language-switch)').addClass('active');

    $('.navigation-main').find('li').has('ul').children('a').on('click', function (e) {
        e.preventDefault();
        $(this).parent('li').not('.disabled').not($('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).toggleClass('active').children('ul').slideToggle(250);
        if ($('.navigation-main').hasClass('navigation-accordion')) {
            $(this).parent('li').not('.disabled').not($('.sidebar-xs').not('.sidebar-xs-indicator').find('.navigation-main').children('li')).siblings(':has(.has-ul)').removeClass('active').children('ul').slideUp(250);
        }
        stickFooterOnSmall();
    });
    stickFooterOnSmall();
});

var goToTop = function(){
    var elementScrollSpeed = $goToTopEl.attr('data-speed'),
        elementScrollEasing = $goToTopEl.attr('data-easing');

    if( !elementScrollSpeed ) { elementScrollSpeed = 700; }
    if( !elementScrollEasing ) { elementScrollEasing = 'easeOutQuad'; }

    $goToTopEl.click(function() {
        $('body,html').stop(true).animate({
            'scrollTop': 0
        }, Number( elementScrollSpeed ), elementScrollEasing );
        return false;
    });
};

var goToTopScroll = function(){
    var elementMobile = $goToTopEl.attr('data-mobile'),
        elementOffset = $goToTopEl.attr('data-offset');

    if( !elementOffset ) { elementOffset = 450; }

    if( elementMobile != 'true' && ( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) ) { return true; }

    if( $window.scrollTop() > Number(elementOffset) ) {
        $goToTopEl.fadeIn();
    } else {
        $goToTopEl.fadeOut();
    }
};

$window.on( 'scroll', goToTopScroll);
goToTop();

var contactForm = function(){

    if( !$().validate ) {
        console.log('contactForm: Form Validate not Defined.');
        return true;
    }

    if( !$().ajaxSubmit ) {
        console.log('contactForm: jQuery Form not Defined.');
        return true;
    }

    var $contactForm = $('.contact-widget:not(.customjs)');
    if( $contactForm.length < 1 ){ return true; }

    $contactForm.each( function(){
        var element = $(this),
            elementAlert = element.attr('data-alert-type'),
            elementLoader = element.attr('data-loader'),
            elementResult = element.find('.contact-form-result');

        element.find('form').validate({
            submitHandler: function(form) {

                elementResult.hide();

                if( elementLoader == 'button' ) {
                    var defButton = $(form).find('button'),
                        defButtonText = defButton.html();

                    defButton.html('<i class="icon-line-loader icon-spin nomargin"></i>');
                } else {
                    $(form).find('.form-process').fadeIn();
                }

                $(form).ajaxSubmit({
                    target: elementResult,
                    resetForm: true,
                    success: function( data ) {
                        if( elementLoader == 'button' ) {
                            defButton.html( defButtonText );
                        } else {
                            $(form).find('.form-process').fadeOut();
                        }
                        if( elementAlert == 'inline' ) {
                            if( data.alert == 'error' ) {
                                var alertType = 'alert-danger';
                            } else {
                                var alertType = 'alert-success';
                            }

                            elementResult.addClass( 'alert ' + alertType ).html( data.message ).slideDown( 400 );
                        } else {
                            elementResult.attr( 'data-notify-type', data.alert ).attr( 'data-notify-msg', data.message ).html('');
                            new PNotify({
                                text: "Message envoyé !",
                                type: 'success'
                            });
                        }
                    }
                });
            }
        });

    });
};

contactForm();
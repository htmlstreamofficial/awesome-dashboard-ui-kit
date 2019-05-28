(function ($) {
  $(document).on('ready', function () {
    // Tooltips & Popovers
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    // Dismiss Popovers on next click
    $('.popover-dismiss').popover({
      trigger: 'focus'
    });

    // File Input
    if($('.custom-file-input').length) {
      bsCustomFileInput.init()
    }

    // Header Search
    $('.u-header-search').each(function () {
      //Variables
      var $this = $(this),
        searchTarget = $this.data('search-target'),
        searchMobileInvoker = $this.data('search-mobile-invoker'),
        windowWidth = window.innerWidth;

      $(searchMobileInvoker).on('click', function (e) {
        $('.dropdown.show [data-toggle="dropdown"]').dropdown('toggle');

        e.stopPropagation();

        $(searchTarget).fadeToggle(400);
      });

      $('[data-toggle="dropdown"]').on('click', function () {
        if($(searchTarget).is(':visible') && $(searchMobileInvoker).is(':visible')) {
          $(searchTarget).hide();
        }
      });

      $(searchTarget).on('click', function (e) {
        e.stopPropagation();
      });

      $(window).on('click', function (e) {
        $(searchTarget).fadeOut(200);
      });

      if (windowWidth <= 576) {
        $(window).on('click', function (e) {
          $(searchTarget).fadeOut(400);
        });
      } else {
        $(window).off('click');
      }

      $(window).on('resize', function () {
        var windowWidth = window.innerWidth;

        if (windowWidth >= 576) {
          $(searchTarget).attr('style', '');

          $(window).off('click');
        } else {
          $(window).on('click', function (e) {
            $(searchTarget).fadeOut(400);
          });
        }
      });
    });

    // Custom Scroll
    $('.u-sidebar').mCustomScrollbar({
      scrollbarPosition: 'outside',
      scrollInertia: 150
    });
  });
})(jQuery);
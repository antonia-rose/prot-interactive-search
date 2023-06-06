/* Everything has to wrapped in here (doc ready) and resizes have to be triggered to gurantee
that element.outerWidth() returns the correct size */

$(document).ready(function () {
  $('.m-journal-navbar, .m-tabs__wrapper').each(function (index, element) {
    var $currentScope = $(element);
    // paddles
    var $leftPaddle = $currentScope.find(
      '.m-journal-navbar__paddles__left-paddle, .m-tabs__left-paddle'
    );
    var $rightPaddle = $currentScope.find(
      '.m-journal-navbar__paddles__right-paddle, .m-tabs__right-paddle'
    );

    $(window).trigger('resize');

    // get some relevant size for the paddle triggering point
    var paddleMargin = 0;

    //get total MenuLength and individual item size + their starting point
    var totalMenuWidth = 0;
    var startingPoints = [];
    var endingPoints = [];
    $currentScope.find('.m-journal-navbar__menu-item, .m-tabs__label').each(function (i) {
      let width = $(this).outerWidth(true);
      startingPoints.push(totalMenuWidth);
      totalMenuWidth += width;
      endingPoints.push(totalMenuWidth);
    });

    // get wrapper width
    var getMenuWrapperSize = function () {
      return $currentScope.find('.m-journal-navbar__menu, .m-tabs__list').outerWidth();
    };
    var menuWrapperSize = getMenuWrapperSize();
    // the wrapper is responsive
    $(window).on('resize', function () {
      menuWrapperSize = getMenuWrapperSize();
      menuInvisibleSize = menuSize - menuWrapperSize;
      checkPaddleVisibility();
    });
    // size of the visible part of the menu is equal as the wrapper size
    var menuVisibleSize = menuWrapperSize;

    var menuSize = totalMenuWidth;
    // get how much of menu is invisible
    var menuInvisibleSize = menuSize - menuWrapperSize;

    // get how much have we scrolled to the left
    var getMenuPosition = function () {
      return $currentScope.find('.m-journal-navbar__menu, .m-tabs__list')[0].scrollLeft;
    };

    // finally, what happens when we are actually scrolling the menu
    $currentScope.find('.m-journal-navbar__menu, .m-tabs__list').on('scroll', function () {
      // get how much of menu is invisible
      menuInvisibleSize = menuSize - menuWrapperSize;
      // get how much have we scrolled so far

      checkPaddleVisibility();
    });

    function checkPaddleVisibility() {
      var menuPosition = getMenuPosition();

      var menuEndOffset = menuInvisibleSize;

      // No Paddles needed (screen wider than menu)
      if (menuInvisibleSize <= 0) {
        $leftPaddle.addClass('hidden');
        $rightPaddle.addClass('hidden');
        return;
      }

      if (menuPosition <= paddleMargin) {
        $leftPaddle.addClass('hidden');
        $rightPaddle.removeClass('hidden');
      } else if (menuPosition < menuEndOffset) {
        // show both paddles in the middle
        $leftPaddle.removeClass('hidden');
        $rightPaddle.removeClass('hidden');
      } else if (menuPosition >= menuEndOffset) {
        $leftPaddle.removeClass('hidden');
        $rightPaddle.addClass('hidden');
      }
    }

    $currentScope
      .find('.m-journal-navbar__paddles__left-paddle, .m-tabs__left-paddle')
      .on('click', function () {
        slide('left');
      });

    $currentScope
      .find('.m-journal-navbar__paddles__right-paddle, .m-tabs__right-paddle')
      .on('click', function () {
        slide('right');
      });

    function slide(direction) {
      var scrollAmount = 0;
      var menu = $currentScope.find('.m-journal-navbar__menu, .m-tabs__list')[0];
      if (direction == 'left') {
        scrollAmount = calculateLeftScroll();
      } else {
        scrollAmount = calculateRightScroll();
      }
      var slideVar = setInterval(function () {
        if (direction == 'left') {
          if (scrollAmount < 10) {
            menu.scrollLeft -= scrollAmount;
          } else {
            menu.scrollLeft -= 10;
          }
        } else {
          if (scrollAmount < 10) {
            menu.scrollLeft += scrollAmount;
          } else {
            menu.scrollLeft += 10;
          }
        }
        scrollAmount -= 10;
        if (scrollAmount <= 0) {
          window.clearInterval(slideVar);
        }
      }, 20);
    }
    function calculateRightScroll() {
      var currentPosition = getMenuPosition();
      menuWrapperSize = getMenuWrapperSize();
      menuVisibleSize = menuWrapperSize;
      for (var i = 0; i < endingPoints.length; i++) {
        if (endingPoints[i] > currentPosition + menuVisibleSize) {
          return endingPoints[i] - (currentPosition + menuVisibleSize);
        }
      }
    }

    function calculateLeftScroll() {
      var currentPosition = getMenuPosition();
      menuWrapperSize = getMenuWrapperSize();
      menuVisibleSize = menuWrapperSize;
      for (var i = startingPoints.length - 1; i > 0; i--) {
        if (startingPoints[i] < currentPosition + menuVisibleSize) {
          return currentPosition + menuVisibleSize - startingPoints[i];
        }
      }
    }

    /* Get all the buttons / menus */
    const $dropdownMenu = $currentScope.find(
      '.m-journal-navbar__menu__dropdown-menu'
    );
    let $navbarMenu = $currentScope.find('.m-journal-navbar__menu');
    var $dropdownMenuContent = $currentScope.find(
      '.m-journal-navbar__menu__dropdown-menu-content'
    );
    var $dropdownmenuButton = $currentScope.find(
      '.m-journal-navbar__menu__dropdown-menu-button'
    );
    $dropdownmenuButton.on('click', function () {
      $dropdownmenuButton.toggleClass('active');
      $dropdownMenuContent.toggleClass('show-menu');
      if ($dropdownmenuButton.hasClass('active')) {
        let $requiredHeight = $dropdownMenuContent.outerHeight();
        $dropdownMenu.css('height', $requiredHeight + 52 + 'px');
        $navbarMenu.css('height', $requiredHeight + 150 + 'px');
        $dropdownMenu.css('height', $requiredHeight + 52 + 'px');
      } else {
        $navbarMenu.css('height', ' 52px');
        $dropdownMenu.css('height', '52px');
      }
      $(window).trigger('resize');
    });

    checkPaddleVisibility();
    $(window).trigger('resize');
    /* Close menu if clicked anywhere else */
    window.addEventListener('click', function (e) {
      if (
        document.querySelector(
          '.m-journal-navbar__menu__dropdown-menu-content'
        ) &&
        !document
          .querySelector('.m-journal-navbar__menu__dropdown-menu-content')
          .contains(e.target) &&
        !document
          .querySelector('.m-journal-navbar__menu__dropdown-menu-button')
          .contains(e.target)
      ) {
        $dropdownmenuButton.removeClass('active');
        $dropdownMenuContent.removeClass('show-menu');
        $navbarMenu.css('height', ' 52px');
        $dropdownMenu.css('height', '52px');
      }
    });
  });
});

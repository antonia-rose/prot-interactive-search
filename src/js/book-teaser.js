$(function () {
  $('.m-book-teaser, .m-book-teaser-2').each(function(index, el) {
    var gliderEl = $(el).find('.glider');
    var prevEl = $(el).find('.glider-prev');
    var nextEl = $(el).find('.glider-next');

    // https://nickpiscitelli.github.io/Glider.js/
    new Glider(gliderEl[0], {
      slidesToShow: 'auto',
      slidesToShow: 4.2,
      slidesToScroll: 4,
      draggable: true,
      arrows: {
        prev: prevEl[0],
        next: nextEl[0]
      },
      responsive: [
        {
          breakpoint: 450,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3.1,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 4.1,
            slidesToScroll: 4
          }
        },
        {
          breakpoint: 1345,
          settings: {
            slidesToShow: 6.1,
            slidesToScroll: 6
          }
        }
      ]
    });
  });

  $('.m-book-teaser__slide, .m-book-teaser-2__slide').on('mouseover', function() {
    $(this).addClass('hover');
  });

  $('.m-book-teaser__slide, .m-book-teaser-2__slide').on('mouseleave', function() {
    $(this).removeClass('hover');
  });

  // add text display logic for `m-book-teaser-2`
  $('.m-book-teaser-2').each(function(index, el) {
    var activeIndex = 0;
    var textWrappers = $(el).find('.m-book-teaser-2__text-wrapper');

    // select first
    if (textWrappers.length) {
      textWrappers.eq(0).addClass('active');
    }

    $(el).find('.m-book-teaser-2__slide').on('click', function(e) {
      e.preventDefault();
      activeIndex = $(this).index();

      if (textWrappers.length) {
        var target = textWrappers.eq(activeIndex);
        textWrappers.removeClass('active'); // first remove all `active` classes
        target.addClass('active');
      }
    });
  });

});

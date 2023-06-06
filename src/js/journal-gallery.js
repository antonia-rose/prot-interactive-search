$(function () {
  $('.m-issue-gallery').each(function (index, el) {
    var gliderEl = $(el).find('.glider');
    var prevEl = $(el).find('.glider-prev');
    var nextEl = $(el).find('.glider-next');

    // https://nickpiscitelli.github.io/Glider.js/
    new Glider(gliderEl[0], {
      slidesToShow: 'auto',
      slidesToShow: 3.2,
      slidesToScroll: 3,
      draggable: true,
      arrows: {
        prev: prevEl[0],
        next: nextEl[0],
      },
      responsive: [
        {
          breakpoint: 450,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 3.1,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3.1,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 1345,
          settings: {
            slidesToShow: 4.1,
            slidesToScroll: 4,
          },
        },
      ],
    });
  });
});

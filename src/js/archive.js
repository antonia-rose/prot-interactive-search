$(function () {
  $('.m-archive').each(function (index, el) {
    var toggleTriggers = $(el).find('.m-archive__toggle');
    toggleTriggers.addClass('m-archive__toggle--closed');

    // open first archive if it does exist
    if (toggleTriggers.length) {
      $(toggleTriggers[0]).removeClass('m-archive__toggle--closed');
    }

    toggleTriggers.on('click', function (e) {
      e.preventDefault();

      $(this).toggleClass('m-archive__toggle--closed');

      // scroll journals into view when accoridion is toggled open
      if (!$(this).hasClass('m-archive__toggle--closed')) {
        var contentEl = $(this).next();
        var journals = contentEl.find('.m-archive__journal');

        if (journals.length) {
          scrollIntoView(journals[0], {
            time: 250,
          });
        }
      }
    });
  });
});

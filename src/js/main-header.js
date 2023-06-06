/* Get all the buttons / menus */
var mainMenu = document.querySelector('.o-main-header__main-menu');
var mainMenuButton = document.querySelector('.o-main-header__main-menu-button');
if (mainMenuButton) {
  mainMenuButton.addEventListener("click", toggleMainHeaderMenu);
}

var profileMenu = document.querySelector('.o-main-header__profile-menu');
var profileMenuButton = document.querySelector(
  '.o-main-header__profile-menu-button'
);
if (profileMenuButton) {
  profileMenuButton.addEventListener("click", toggleMainHeaderProfileMenu);
}

var searchMenu = document.querySelector('.o-main-header__search-menu');
var searchMenuButton = document.querySelector(
  '.o-main-header__search-menu-button'
);
if (searchMenuButton) {
  searchMenuButton.addEventListener("click", toggleMainHeaderSearchMenu);
}


function toggleMainHeaderMenu() {
  mainMenuButton.classList.toggle('active');
  mainMenu.classList.toggle('show-menu');
}

function toggleMainHeaderProfileMenu() {
  profileMenuButton.classList.toggle('active');
  profileMenu.classList.toggle('show-menu');
}

function toggleMainHeaderSearchMenu() {
  searchMenuButton.classList.toggle('active');
  searchMenu.classList.toggle('show-menu');
  var searchMenuInput = document.querySelector(
    '.o-main-header__search-menu .a-search-box__content'
  );
  searchMenuInput.focus();
}

var accs = document.getElementsByClassName('m-menu-category__toggle');
var mainHeader = document.querySelector('.m-main-header-menu');

for (i = 0; i < accs.length; i++) {
  /* On first load, all items on mobile are collapsed */
  if ($(window).width() < 630) {
    accs[i].classList.toggle('collapsed');
    var parent = $(accs[i]).parent();
    var silbling = parent.next();
    var content = silbling[0];
    if (content.style.maxHeight != '0px') {
      content.style.maxHeight = 0;
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (content.style.maxHeight === '0px') {
        content.style.maxHeight = 'initial';
      }
    }
  }
  /* items collapse on click */
  accs[i].addEventListener('click', function () {
    if (mainHeader.classList.contains('toggle-active')) {
      this.classList.toggle('collapsed');
      var parent = $(this).parent();
      var silbling = parent.next();
      var content = silbling[0];
      if (content.style.maxHeight != '0px') {
        content.style.maxHeight = 0;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (content.style.maxHeight === '0px') {
          content.style.maxHeight = 'initial';
        }
      }
    }
  });
}

// $(window).on('resize', function () {
//   if (mainHeader) {
//     mainHeader.classList.remove('toggle-active');
//     mainHeader.classList.remove('toggle-inactive');

//     if ($(window).width() < 630) {
//       return mainHeader.classList.add('toggle-active');
//     } else {
//       // make sure all categories are expanded
//       for (i = 0; i < accs.length; i++) {
//         if (accs[i].classList.contains('collapsed')) {
//           accs[i].classList.toggle('collapsed');
//           var content = $(accs[i]).parent().next()[0];
//           content.style.maxHeight = content.scrollHeight + 'px';
//           if (content.style.maxHeight === '0px') {
//             content.style.maxHeight = 'initial';
//           }
//         }
//       }

//       // remove toggle
//       return mainHeader.classList.add('toggle-inactive');
//     }
//   }
// });

// window.addEventListener('click', function (e) {
//   if (
//     document.querySelector(
//       '.o-main-header__dropdown-menu__main-menu-wrapper'
//     ) &&
//     !document
//       .querySelector('.o-main-header__dropdown-menu__main-menu-wrapper')
//       .contains(e.target)
//   ) {
//     mainMenu.classList.remove('show-menu');
//     mainMenuButton.classList.remove('active');
//   }
//   if (
//     document.querySelector(
//       '.o-main-header__dropdown-menu__profile-menu-wrapper'
//     ) &&
//     !document
//       .querySelector('.o-main-header__dropdown-menu__profile-menu-wrapper')
//       .contains(e.target)
//   ) {
//     console.log("lala", profileMenu.classList)
//     profileMenu.classList.remove('show-menu');
//     profileMenuButton.classList.remove('active');
//   }
//   if (
//     document.querySelector(
//       '.o-main-header__dropdown-menu__search-menu-wrapper'
//     ) &&
//     !document
//       .querySelector('.o-main-header__dropdown-menu__search-menu-wrapper')
//       .contains(e.target)
//   ) {
//     searchMenu.classList.remove('show-menu');
//     searchMenuButton.classList.remove('active');
//   }
// });

// $(document).ready(function () {
//   $(window).trigger('resize');
// });

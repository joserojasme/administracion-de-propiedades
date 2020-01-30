// Menu
const buttonMenu = document.getElementById("buttonMenu");
const menu = document.getElementById("menu");
const buttonCloseMenu = document.getElementById("buttonCloseMenu");
const itemsMenu = document.querySelectorAll(".header__item__responsive");

buttonMenu.addEventListener("click", () => {
  menu.classList.add("menu__responsive_active");
});

buttonCloseMenu.addEventListener("click", () => {
  menu.classList.remove("menu__responsive_active");
});

itemsMenu.forEach(element =>
  element.addEventListener("click", () => {
    menu.classList.remove("menu__responsive_active");
  })
);  

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".carousel");
  M.Carousel.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.slider');
  M.Slider.init(elems);
});


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems);
});
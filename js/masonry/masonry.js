var elem = document.querySelector('.grid');
var msnry = new Masonry( elem, {
  // options
  itemSelector: '.grid-item',
  columnWidth: 300,

  columnWidth: '.grid-sizer',
  percentPosition: true,
});
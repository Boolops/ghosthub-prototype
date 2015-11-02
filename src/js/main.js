console.log('example js file');
$(document).ready(function(){
		$(".open-popup-link").magnificPopup({
			type:'inline'
	 	});

// button scroll to top
		$(window).scroll(function(){
			if ($(this).scrollTop() > 100) {
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});

		$('.back-to-top').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});



// gallery
// $('.theme-popup').magnificPopup({
//     items: [
//       {
//         src: 'images/themes/Escritor.png',
//         title: '<a href="" class="theme-link">View the theme</a>'
//       },
// 		],
// 		gallery: {
// 		enabled: true
// 		},
// 		type: 'image'
// });

$('.gallery').each(function() { // the containers for all your galleries
	var themeImage = $(this).data('image');
	var themeItem = themeImage.split(",");
	var themeLink = $(this).data('link');
	var items;
	var itemsArray = [];
	for(var i=0; i<themeItem.length-1; i++){
		items = {	src: themeItem[i],
		 					title: "<a href='"+ themeLink + "' class='theme-link' target='_blank'>View the theme</a>"};
		itemsArray.push(items);
	}

		$(this).magnificPopup({
        type: 'image',
				items: itemsArray,
        gallery: {
          enabled:true,
        }
    });
});















});

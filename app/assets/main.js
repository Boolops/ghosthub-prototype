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
	console.log(themeImage);
	var themeItem = themeImage.split(",");
	console.log(themeItem);
	var themeLink = $(this).data('link');
	console.log(themeLink);
		$(this).magnificPopup({
        type: 'image',
				items: [
					{
						src: themeItem[0],
						title: "<a href='"+ themeLink + "' class='theme-link' target='_blank'>View the theme</a>"
					},
					{
						src: themeItem[1],
						title: "<a href='"+ themeLink + "' class='theme-link' target='_blank'>View the theme</a>"
					}
				],
        gallery: {
          enabled:true,
        }
    });
});















});

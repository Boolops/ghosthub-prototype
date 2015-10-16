console.log('example js file');
$(document).ready(function(){
		$(".open-popup-link").magnificPopup({
			type:'inline'
	 	});

		$('.gallery').each(function() { // the containers for all your galleries
		    $(this).magnificPopup({
		        delegate: 'a', // the selector for gallery item
		        type: 'image',
		        gallery: {
		          enabled:true
		        }
		    });
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
$('.theme-popup').magnificPopup({
    items: [
      {
        src: 'images/pict1.png',
        title: '<a href="" class="theme-link">View the theme</a>'
      },
			{
				src: 'images/pict2.png',
				title: '<a href="" class="theme-link">View the theme</a>'
			}
		],
		gallery: {
		enabled: true
		},
		type: 'image'
});
















});

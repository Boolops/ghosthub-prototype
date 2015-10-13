console.log('example js file');
$(document).ready(function(){
	$('.back-to-top').click(function(){
	$('html, body').animate({scrollTop : 0},800);
	return false;
});
});
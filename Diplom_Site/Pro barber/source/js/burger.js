const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');
const background = document.querySelector('.header__nav_background');

if (burger) {
	burger.addEventListener("click", function(e){
		document.body.classList.toggle('_lock');
		burger.classList.toggle('_active');
		nav.classList.toggle('_active');
		background.classList.toggle('_work');
	});
}
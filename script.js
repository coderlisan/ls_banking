'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');

//01. Modal window
const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

//02. Smoth scroll effect
btnScrollTo.addEventListener('click', e => {
	const slcoords = section1.getBoundingClientRect();
	console.log(slcoords);

	console.log(e.target.getBoundingClientRect());
	console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

	console.log(
		'height/width viewport',
		document.documentElement.clientHeight,
		document.documentElement.clientWidth
	);

	// Scrolling
	section1.scrollIntoView({ behavior: 'smooth' });
});

//03. Page navigation করা JS দিয়ে
document.querySelector('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();

	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		console.log(id);
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

//04. Tabbed component

// tabs.forEach(t => addEventListener('click', () => console.log('TAB')));
tabContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');
	// console.log(clicked);

	// Guard clause বা operations__tab এর ক্লিক পড়লে সেটা ইগনর করা
	if (!clicked) return;

	// Active tab
	tabs.forEach(t => t.classList.remove('operations__tab--active'));
	tabsContent.forEach(c => c.classList.remove('operations__content--active'));
	clicked.classList.add('operations__tab--active');

	// Activate content area
	// console.log(clicked.dataset.tab);
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add('operations__content--active');
});

//05. Menu fade animation
const handOver = function (e) {
	// console.log(this);

	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach(el => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};

// nav.addEventListener('mouseover', function (e) {handOver(e, 0.5)});
nav.addEventListener('mouseover', handOver.bind(0.5));
nav.addEventListener('mouseout', handOver.bind(1));

//06. Sticky navigation: Intersection observer API

/*
// Sticky navigation এটি ভিউপোর্টের কারণে পরিবর্তন হবে
const initialsCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
	if (window.scrollY > initialsCoords.top) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
});
*/

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};

const haderObserver = new IntersectionObserver(stickyNav, {
	root: null,
	rootMargin: `-${navHeight}px`,
	threshold: 0,
});

haderObserver.observe(header);

//07. Reveal sections: Using IntersectionObserver
const revealSection = function (entries, observer) {
	const [entry] = entries;
	// console.log(entry);
	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');

	// scroll up অবর্জাভার বন্ধ করা
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSection.forEach(function (section) {
	sectionObserver.observe(section);
	// section.classList.add('section--hidden');
});

//08. Image lazy loading
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
	const [entry] = entries;
	// console.log(entry);

	if (!entry.isIntersecting) return;

	// Replace src with data-src
	entry.target.src = entry.target.dataset.src;
	entry.target.classList.remove('lazy-img');
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '-200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

//09. Slider Creating
const slider = function () {
	const slides = document.querySelectorAll('.slide');
	const btnLeft = document.querySelector('.slider__btn--left');
	const btnRight = document.querySelector('.slider__btn--right');
	const dotContainer = document.querySelector('.dots');

	let curSlide = 0;
	const maxSlide = slides.length;

	// Functions
	const createDots = function () {
		slides.forEach((_, i) => {
			dotContainer.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${i}"></button>`
			);
		});
	};

	const activateDot = function (slide) {
		document
			.querySelectorAll('.dots__dot')
			.forEach(dot => dot.classList.remove('dots__dot--active'));

		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`)
			.classList.add('dots__dot--active');
	};

	const goToSlide = function (slide) {
		slides.forEach(
			(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
		);
	};

	// Next slide
	const nextSlide = function () {
		if (curSlide === maxSlide - 1) curSlide = 0;
		else curSlide++;

		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const prevSlide = function () {
		if (curSlide === 0) curSlide = maxSlide - 1;
		else curSlide--;

		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const init = function () {
		goToSlide(0);
		createDots();

		activateDot(0);
	};
	init();

	// Event handlers
	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') prevSlide();
		e.key === 'ArrowRight' && nextSlide();
	});

	dotContainer.addEventListener('click', function (e) {
		if (e.target.classList.contains('dots__dot')) {
			const { slide } = e.target.dataset;
			goToSlide(slide);
			activateDot(slide);
		}
	});
};
slider();

document.addEventListener('DOMContentLoaded', function (e) {
	console.log(`HTML parsed and DOM tree built!`, e);
});

window.addEventListener('load', function (e) {
	console.log('Page fully loaded');
	console.log(e);
});

// window.addEventListener('beforeunload', function (e) {
// 	e.preventDefault();
// 	console.log(e);
// 	e.returnValue = '';
// });

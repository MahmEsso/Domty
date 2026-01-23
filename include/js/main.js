/* gsap.registerPlugin(ScrollTrigger);
window.addEventListener('load', () => {
	window.scrollTo(0, 0);
	setTimeout(() => {
		initAnimation();
	}, 100);
});
function initAnimation() {
	ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	gsap.set(".text-img", {
		y: "-170%",
		scale: 0.5
	});
	gsap.set(".products-img", {
		y: "150%"
	});
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".domty-section",
			start: "top top",
			end: "+=400%", // 4x the viewport height for smooth animation
			scrub: 1,
			pin: true,
			anticipatePin: 1,
			markers: false, // Set to true for debugging
			invalidateOnRefresh: true,
			onRefresh: () => {
				gsap.set(".text-img", {
					y: "-170%",
					scale: 0.5
				});
				gsap.set(".products-img", {
					y: "150%"
				});
			}
		}
	});
	tl.to(".text-img", {
		y: "0%",
		scale: 1,
		duration: 1,
		ease: "power2.out"
	})
		.to(".products-img", {
			y: "0%",
			duration: 1,
			ease: "power2.out"
		}, "+=0.3")
		.to(".text-img", {
			scale: 0.6,
			duration: 1,
			ease: "power2.inOut"
		}, "<") // Start at the same time as products

		.to(".products-img", {
			y: "-150%",
			duration: 1,
			ease: "power2.in"
		}, "+=0.3")
		.to(".text-img", {
			scale: 1,
			duration: 1,
			ease: "power2.inOut"
		}, "<") // Start at the same time as products exit

		.to({}, { duration: 0.5 }); // Empty tween to create pause
	ScrollTrigger.refresh();
}
window.addEventListener('pageshow', (event) => {
	if (event.persisted) {
		window.location.reload();
	}
});
 */
gsap.registerPlugin(ScrollTrigger);
window.addEventListener('load', () => {
	window.scrollTo(0, 0);
	setTimeout(() => {
		initAnimation();
	}, 100);
});
function initAnimation() {
	ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	
	// Responsive values based on screen size
	const isMobile = window.innerWidth <= 768;
	const initialTextY = isMobile ? "-120%" : "-170%";
	const initialProductsY = isMobile ? "100%" : "150%";
	const exitProductsY = isMobile ? "-100%" : "-150%";
	const scrollDistance = isMobile ? "+=200%" : "+=400%";
	
	gsap.set(".text-img", {
		y: initialTextY,
		scale: 0.5
	});
	gsap.set(".products-img", {
		y: initialProductsY
	});
	
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".domty-section",
			start: "top top",
			end: scrollDistance, // Shorter on mobile
			scrub: 1,
			pin: true,
			anticipatePin: 1,
			markers: false,
			invalidateOnRefresh: true,
			onRefresh: () => {
				gsap.set(".text-img", {
					y: initialTextY,
					scale: 0.5
				});
				gsap.set(".products-img", {
					y: initialProductsY
				});
			}
		}
	});
	
	tl.to(".text-img", {
		y: "0%",
		scale: 1,
		duration: 1,
		ease: "power2.out"
	})
		.to(".products-img", {
			y: "0%",
			duration: 1,
			ease: "power2.out"
		}, "+=0.3")
		.to(".text-img", {
			scale: 0.6,
			duration: 1,
			ease: "power2.inOut"
		}, "<")
		.to(".products-img", {
			y: exitProductsY,
			duration: 1,
			ease: "power2.in"
		}, "+=0.3")
		.to(".text-img", {
			scale: 1,
			duration: 1,
			ease: "power2.inOut"
		}, "<")
		.to({}, { duration: 0.5 });
	
	ScrollTrigger.refresh();
}

// Re-initialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		initAnimation();
	}, 250);
});





$(".carousel").swipe({
	swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
		var isRTL = $('html').attr('dir') === 'rtl';

		if (isRTL) {
			if (direction == 'left') $(this).carousel('prev');
			if (direction == 'right') $(this).carousel('next');
		} else {
			if (direction == 'left') $(this).carousel('next');
			if (direction == 'right') $(this).carousel('prev');
		}
	},
	allowPageScroll: "vertical"
});


/*SCROLL PAGE TO TOP*/
$(document).ready(function () {
	$(".toTop").css("display", "none");

	$(window).scroll(function () {
		if ($(window).scrollTop() > 0) { $(".toTop").fadeIn("slow"); } else { $(".toTop").fadeOut("slow"); }
	});

	$(".toTop").click(function (event) {
		event.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "slow");
	});
});



var navHeight = $('#main_navbar').offset().top;
FixMegaNavbar(navHeight);
$(window).bind('scroll', function () { FixMegaNavbar(navHeight); });

function FixMegaNavbar(navHeight) {
	if (!$('#main_navbar').hasClass('navbar-fixed-bottom')) {
		if ($(window).scrollTop() > navHeight) {
			$('#main_navbar').addClass('navbar-fixed-top')
			$('#main_navbar').addClass('fixed-bg')

			if ($('#main_navbar').parent('div').hasClass('container')) $('#main_navbar').children('div').addClass('container').removeClass('container-fluid');

			else if ($('#main_navbar').parent('div').hasClass('container-fluid'))
				$('#main_navbar').children('div').addClass('container-fluid').removeClass('container');
		}
		else {
			$('#main_navbar').removeClass('navbar-fixed-top');
			$('#main_navbar').removeClass('fixed-bg')

			$('body').css({ 'margin-top': '' });
		}
	}
}



document.addEventListener('DOMContentLoaded', function () {
	// Get your original HTML content
	const marquee1 = document.getElementById('marquee1');

	// Get the original text from your HTML
	const originalText1 = marquee1.innerHTML;

	// Function to duplicate text for seamless scrolling
	function duplicateForMarquee(element, originalHTML, repetitions = 15) {
		// Clear original (it will be included in duplicates)
		element.innerHTML = '';

		// Create multiple copies
		for (let i = 0; i < repetitions; i++) {
			const clone = document.createElement('span');
			clone.innerHTML = originalHTML;
			// Add a separator
			/* if (i < repetitions - 1) {
				clone.innerHTML += ' • ';
			} */
			element.appendChild(clone);
		}
	}

	// Duplicate the text
	duplicateForMarquee(marquee1, originalText1, 20);

	// Animation variables
	let position1 = 0;
	const speed = 2;

	// Animation function
	function animateMarquees() {
		// Get the actual width after content is duplicated
		const width1 = marquee1.scrollWidth / 2;

		// First line: left to right (moves leftward)
		position1 -= speed;
		if (position1 <= -width1) {
			position1 = 0;
		}
		marquee1.style.transform = `translateX(${position1}px)`;

		// Continue animation
		requestAnimationFrame(animateMarquees);
	}

	// Start animation
	animateMarquees();
});




document.addEventListener('DOMContentLoaded', function () {
	const carousel = document.getElementById('carouselExampleIndicators');
	const videos = carousel.querySelectorAll('video');

	// Play video when slide becomes active
	carousel.addEventListener('slid.bs.carousel', function (e) {
		// Pause all videos
		videos.forEach(video => {
			video.pause();
			video.currentTime = 0; // Reset to beginning
		});

		// Play video in active slide
		const activeVideo = e.relatedTarget.querySelector('video');
		if (activeVideo) {
			activeVideo.play();
		}
	});

	// Pause videos when sliding away
	carousel.addEventListener('slide.bs.carousel', function () {
		videos.forEach(video => {
			video.pause();
		});
	});

	// Optional: Auto-advance to next slide when video ends
	videos.forEach(video => {
		video.addEventListener('ended', function () {
			const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
			carouselInstance.next();
		});
	});

	// Play first video if it's in the first slide
	const firstSlide = carousel.querySelector('.carousel-item.active');
	const firstVideo = firstSlide.querySelector('video');
	if (firstVideo) {
		firstVideo.play();
	}
});




$(document).ready(function () {
	$(".products-carousel").owlCarousel({
		margin: 30,
		loop: true,
		dots: false,
		//center: true,
		autoplayHoverPause: true,
		autoplay: true,
		nav: true,
		navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
		responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 2, stagePadding: 120 }, 1300: { items: 2, stagePadding: 220 } }
	});
	$(".quick-links-carousel").owlCarousel({
		margin: 30,
		loop: true,
		dots: false,
		//center: true,
		autoplayHoverPause: true,
		autoplay: true,
		nav: false,
		responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 3, stagePadding: 40 }, 1300: { items: 4, stagePadding: 60 } }
	});
});





document.addEventListener('DOMContentLoaded', function () {
	const sections = document.querySelectorAll('.accordion-section');

	sections.forEach(section => {
		section.addEventListener('click', function () {
			// Remove active class from all sections
			sections.forEach(s => {
				s.classList.remove('active');
				s.classList.add('collapsed');
			});

			// Add active class to clicked section
			this.classList.remove('collapsed');
			this.classList.add('active');
		});
	});
});

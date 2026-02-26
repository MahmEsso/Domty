// Script 1: Equalize Boxes (jQuery version with debounce)
(function ($) {
	'use strict';

	function equalizeBoxes() {
		var _array = [
			// [mode]  [parent]              [child]
			"0",       ".products-carousel",               ".product-box",
		];
		
		for (var x = 0; x < _array.length; x += 3) {
			var mode = _array[x];
			var parentSelector = _array[x + 1];
			var childSelector = _array[x + 2];
			
			$(parentSelector).each(function () {
				var $boxes = $(this).find(childSelector);
				
				if ($boxes.length === 0) return;
				
				// Height equalization
				if (mode === "0" || mode === "3") {
					$boxes.css('height', 'auto');
					
					var maxHeight = 0;
					$boxes.each(function () {
						var thisHeight = $(this).outerHeight();
						if (thisHeight > maxHeight) {
							maxHeight = thisHeight;
						}
					});
					
					$boxes.css('height', maxHeight + 'px');
				}
				
				// Width equalization
				if (mode === "1" || mode === "3") {
					$boxes.css('width', 'auto');
					
					var maxWidth = 0;
					$boxes.each(function () {
						var thisWidth = $(this).outerWidth();
						if (thisWidth > maxWidth) {
							maxWidth = thisWidth;
						}
					});
					
					$boxes.css('width', maxWidth + 'px');
				}
			});
		}
	}

	$(window).on('load', equalizeBoxes);
	
	var resizeTimer;
	$(window).on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(equalizeBoxes, 250);
	});

})(jQuery);



// Script 2: GSAP ScrollTrigger Animation
(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    let tl = null;
    let st = null;

    // Disable Chrome scroll restoration entirely —
    // we'll handle scroll position manually
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        setTimeout(initAnimation, 300); // slightly longer delay to let
                                        // owl carousel & wow.js settle
    });

    function getValues() {
        const isMobile = window.innerWidth <= 768;
        return {
            initialTextY:     isMobile ? "-75vh" : "-70vh",
            initialProductsY: isMobile ? "100vh"  : "150vh",
            exitProductsY:    isMobile ? "-50vh"  : "-150vh",
            scrollDistance:   isMobile ? "+=900vh" : "+=2000vh",
        };
    }

    function setInitialState(v) {
        gsap.set(".text-img",     { y: v.initialTextY, scale: 0.5 });
        gsap.set(".products-img", { y: v.initialProductsY });
    }

    function buildTimeline(v) {
        const t = gsap.timeline({ paused: true });

        t.to(".text-img", {
                y: "0vh", scale: 1,
                duration: 1, ease: "power2.out"
            })
            .to(".products-img", {
                y: "0vh",
                duration: 1, ease: "power2.out"
            }, "+=0.3")
            .to(".text-img", {
                scale: 0.6,
                duration: 1, ease: "power2.inOut"
            }, "<")
            .to(".products-img", {
                y: v.exitProductsY,
                duration: 1, ease: "power2.in"
            }, "+=0.3")
            .to(".text-img", {
                scale: 1,
                duration: 1, ease: "power2.inOut"
            }, "<")
            .to({}, { duration: 0.5 });

        return t;
    }

    function initAnimation() {
        if (st) { st.kill(); st = null; }
        if (tl) { tl.kill(); tl = null; }
        gsap.killTweensOf([".text-img", ".products-img"]);

        const v = getValues();

        // Save scroll, jump to 0 so all sections above render
        // at their natural height before ScrollTrigger measures
        const savedScroll = window.scrollY;
        window.scrollTo(0, 0);

        // Wait for the browser to repaint at scroll 0, then measure & build
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                setInitialState(v);
                tl = buildTimeline(v);

                st = ScrollTrigger.create({
                    trigger: ".domty-section",
                    start: "top top",
                    end: v.scrollDistance,
                    scrub: 4,
                    pin: true,
                    anticipatePin: 1,
                    animation: tl,
                    invalidateOnRefresh: true,
                });

                // Force a clean measurement from scroll 0
                ScrollTrigger.refresh();

                // Now restore where the user was
                // Use another rAF so refresh has fully committed
                requestAnimationFrame(() => {
                    window.scrollTo(0, savedScroll);
                });
            });
        });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initAnimation, 250);
    });

})();



/* (function () {
	'use strict';

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
				end: scrollDistance,
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

})();
 */

// Script 3: Carousel Swipe Support
(function ($) {
	'use strict';

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

})(jQuery);


// Script 4: Scroll to Top Button
(function ($) {
	'use strict';

	$(document).ready(function () {
		$(".toTop").css("display", "none");

		$(window).scroll(function () {
			if ($(window).scrollTop() > 0) {
				$(".toTop").fadeIn("slow");
			} else {
				$(".toTop").fadeOut("slow");
			}
		});

		$(".toTop").click(function (event) {
			event.preventDefault();
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	});

})(jQuery);


// Script 5: Fixed Navbar on Scroll
(function ($) {
	'use strict';

	var navHeight = $('#main_navbar').offset().top;
	FixMegaNavbar(navHeight);
	$(window).bind('scroll', function () { FixMegaNavbar(navHeight); });

	function FixMegaNavbar(navHeight) {
		if (!$('#main_navbar').hasClass('navbar-fixed-bottom')) {
			if ($(window).scrollTop() > navHeight) {
				$('#main_navbar').addClass('navbar-fixed-top')
				$('#main_navbar').addClass('fixed-bg')

				if ($('#main_navbar').parent('div').hasClass('container'))
					$('#main_navbar').children('div').addClass('container').removeClass('container-fluid');
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

})(jQuery);


// Script 6: Marquee Animation
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// Get your original HTML content
		const marquee1 = document.getElementById('marquee1');

		if (!marquee1) return; // Exit if element doesn't exist

		// Get the original text from your HTML
		const originalText1 = marquee1.innerHTML;

		// Function to duplicate text for seamless scrolling
		function duplicateForMarquee(element, originalHTML, repetitions = 15) {
			element.innerHTML = '';

			for (let i = 0; i < repetitions; i++) {
				const clone = document.createElement('span');
				clone.innerHTML = originalHTML;
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
			const width1 = marquee1.scrollWidth / 2;

			position1 -= speed;
			if (position1 <= -width1) {
				position1 = 0;
			}
			marquee1.style.transform = `translateX(${position1}px)`;

			requestAnimationFrame(animateMarquees);
		}

		// Start animation
		animateMarquees();
	});

})();


// Script 7: Video Carousel Controls
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		const carousel = document.getElementById('carouselExampleIndicators');

		if (!carousel) return; // Exit if element doesn't exist

		const videos = carousel.querySelectorAll('video');

		// Play video when slide becomes active
		carousel.addEventListener('slid.bs.carousel', function (e) {
			videos.forEach(video => {
				video.pause();
				video.currentTime = 0;
			});

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

		// Auto-advance to next slide when video ends
		videos.forEach(video => {
			video.addEventListener('ended', function () {
				const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
				carouselInstance.next();
			});
		});

		// Play first video if it's in the first slide
		const firstSlide = carousel.querySelector('.carousel-item.active');
		const firstVideo = firstSlide ? firstSlide.querySelector('video') : null;
		if (firstVideo) {
			firstVideo.play();
		}
	});

})();


// Script 8: Owl Carousel Initialization
(function ($) {
	'use strict';

	$(document).ready(function () {
		$(".products-carousel").owlCarousel({
			margin: 30,
			loop: true,
			dots: false,
			autoplayHoverPause: true,
			autoplay: true,
			nav: true,
			autoplayTimeout: 2000,
			navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
			responsive: {
				0: { items: 1 },
				600: { items: 2 },
				1000: { items: 2, stagePadding: 120 },
				1300: { items: 2, stagePadding: 220 }
			}
		});

		$(".quick-links-carousel").owlCarousel({
			margin: 30,
			loop: true,
			dots: false,
			autoplayHoverPause: true,
			autoplay: true,
			nav: false,
			responsive: {
				0: { items: 1 },
				600: { items: 2 },
				1000: { items: 3, stagePadding: 40 },
				1300: { items: 4, stagePadding: 60 }
			}
		});

		$(".certifications-carousel").owlCarousel({
			margin: 30,
			loop: true,
			center: true,
			dots: false,
			autoplayHoverPause: true,
			autoplay: true,
			nav: false,
			responsive: {
				0: { items: 2 },
				600: { items: 4 },
				1000: { items: 6 },
				1300: { items: 8 }
			}
		});
	});

})(jQuery);


// Script 9: Accordion Sections
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		const sections = document.querySelectorAll('.accordion-section');

		if (sections.length === 0) return; // Exit if no sections exist

		sections.forEach(section => {
			section.addEventListener('click', function () {
				sections.forEach(s => {
					s.classList.remove('active');
					s.classList.add('collapsed');
				});

				this.classList.remove('collapsed');
				this.classList.add('active');
			});
		});
	});

})();


// Script 10: Product Filter with Pagination
(function () {
	'use strict';

	const productsMenu = document.querySelector(".products-menu");
	const productsItem = document.querySelector(".products-item");

	if (!productsMenu || !productsItem) return; // Exit if elements don't exist

	let sortMenu = productsMenu.children;
	let sortItem = productsItem.children;
	let itemsPerPage = 9;
	let currentPage = 1;
	let currentFilter = "all";

	function createPaginationControls() {
		let paginationContainer = document.querySelector(".filter-pagination");
		if (!paginationContainer) {
			paginationContainer = document.createElement("div");
			paginationContainer.className = "filter-pagination";
			productsItem.parentNode.appendChild(paginationContainer);
		}
		return paginationContainer;
	}

	function getFilteredItems() {
		let filteredItems = [];
		for (let i = 0; i < sortItem.length; i++) {
			if (
				sortItem[i].getAttribute("data-item") == currentFilter ||
				currentFilter == "all"
			) {
				filteredItems.push(sortItem[i]);
			}
		}
		return filteredItems;
	}

	function displayPage(page) {
		let filteredItems = getFilteredItems();
		let totalPages = Math.ceil(filteredItems.length / itemsPerPage);

		currentPage = Math.max(1, Math.min(page, totalPages));

		for (let i = 0; i < sortItem.length; i++) {
			sortItem[i].classList.remove("active");
			sortItem[i].classList.add("delete");
		}

		let start = (currentPage - 1) * itemsPerPage;
		let end = start + itemsPerPage;

		for (let i = start; i < end && i < filteredItems.length; i++) {
			filteredItems[i].classList.remove("delete");
			filteredItems[i].classList.add("active");
		}

		updatePaginationControls(filteredItems.length);
	}

	function updatePaginationControls(totalItems) {
		let paginationContainer = createPaginationControls();
		let totalPages = Math.ceil(totalItems / itemsPerPage);

		paginationContainer.innerHTML = "";

		if (totalPages <= 1) {
			paginationContainer.style.display = "none";
			return;
		}

		paginationContainer.style.display = "flex";

		let prevBtn = document.createElement("button");
		prevBtn.innerHTML = "<i class='fa-solid fa-chevron-left'></i>";
		prevBtn.disabled = currentPage === 1;
		prevBtn.addEventListener("click", () => displayPage(currentPage - 1));
		paginationContainer.appendChild(prevBtn);

		for (let i = 1; i <= totalPages; i++) {
			let pageBtn = document.createElement("button");
			pageBtn.textContent = i;
			pageBtn.classList.toggle("active", i === currentPage);
			pageBtn.addEventListener("click", () => displayPage(i));
			paginationContainer.appendChild(pageBtn);
		}

		let nextBtn = document.createElement("button");
		nextBtn.innerHTML = "<i class='fa-solid fa-chevron-right'></i>";
		nextBtn.disabled = currentPage === totalPages;
		nextBtn.addEventListener("click", () => displayPage(currentPage + 1));
		paginationContainer.appendChild(nextBtn);
	}

	for (let i = 0; i < sortMenu.length; i++) {
		sortMenu[i].addEventListener("click", function () {
			for (let el = 0; el < sortMenu.length; el++) {
				sortMenu[el].classList.remove("current");
			}
			this.classList.add("current");

			currentFilter = this.getAttribute("data-target");
			currentPage = 1;
			displayPage(1);
		});
	}

	displayPage(1);

})();

// Script 11: Vertical Carousel
(function () {
	'use strict';

	class VerticalCarousel {
	constructor() {
		this.slides = document.querySelectorAll('.slide');
		this.currentSlide = 0; // Start with slide 02 active
		this.totalSlides = this.slides.length;

		this.init();
	}

	init() {
		this.updateSlides();
		this.attachEventListeners();
		this.startAutoPlay();
	}

	updateSlides() {
		// Remove all classes
		this.slides.forEach(slide => {
		slide.classList.remove('prev', 'active', 'next');
		});

		// Calculate indices
		const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
		const nextIndex = (this.currentSlide + 1) % this.totalSlides;

		// Add classes
		this.slides[prevIndex].classList.add('prev');
		this.slides[this.currentSlide].classList.add('active');
		this.slides[nextIndex].classList.add('next');
	}

	attachEventListeners() {
		this.slides.forEach((slide, index) => {
		slide.addEventListener('click', () => {
			if (slide.classList.contains('prev')) {
			this.prevSlide();
			} else if (slide.classList.contains('next')) {
			this.nextSlide();
			}
		});
		});

		// Scroll wheel support
		/* const wrapper = document.querySelector('.carousel-wrapper');
		wrapper.addEventListener('wheel', (e) => {
		e.preventDefault();
		if (e.deltaY > 0) {
			this.nextSlide();
		} else {
			this.prevSlide();
		}
		}, { passive: false }); */

		// Keyboard navigation
		/* document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			this.nextSlide();
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			this.prevSlide();
		}
		}); */

		// Touch/swipe support
		let touchStartY = 0;
		let touchEndY = 0;

		wrapper.addEventListener('touchstart', (e) => {
		touchStartY = e.changedTouches[0].screenY;
		});

		wrapper.addEventListener('touchend', (e) => {
		touchEndY = e.changedTouches[0].screenY;
		this.handleSwipe();
		});

		this.handleSwipe = () => {
		if (touchEndY < touchStartY - 50) this.nextSlide();
		if (touchEndY > touchStartY + 50) this.prevSlide();
		};
	}

	goToSlide(index) {
		if (index === this.currentSlide) return;

		this.currentSlide = index;
		this.updateSlides();

		this.resetAutoPlay();
	}

	nextSlide() {
		const nextIndex = (this.currentSlide + 1) % this.totalSlides;
		this.goToSlide(nextIndex);
	}

	prevSlide() {
		const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
		this.goToSlide(prevIndex);
	}

	startAutoPlay() {
		this.autoPlayInterval = setInterval(() => {
		this.nextSlide();
		}, 5000);
	}

	resetAutoPlay() {
		clearInterval(this.autoPlayInterval);
		this.startAutoPlay();
	}
	}

	// Initialize carousel when DOM is loaded
	document.addEventListener('DOMContentLoaded', () => {
	new VerticalCarousel();
	});
})();


(function () {
	'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const dropupToggles = document.querySelectorAll('.dropup-toggle');
  
  dropupToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dropupMenu = this.nextElementSibling;
      const parentLi = this.closest('.dropup');
      
      // Close other open dropups
      document.querySelectorAll('.dropup').forEach(item => {
        if (item !== parentLi) {
          item.classList.remove('active');
        }
      });
      
      // Toggle current dropup
      parentLi.classList.toggle('active');
    });
  });
  
  // Close dropup when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropup')) {
      document.querySelectorAll('.dropup').forEach(item => {
        item.classList.remove('active');
      });
    }
  });
});
})();
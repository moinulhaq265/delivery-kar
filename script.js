// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav-tray');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const inner = menuBtn.querySelector('.hamburger');
        if (inner) inner.style.background = mobileNav.classList.contains('active') ? 'transparent' : 'white';
    });
}

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) hamburger.style.background = 'white';
    });
});

// Vehicle Selection Logic
const vehicleCards = document.querySelectorAll('.vehicle-card');
vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
        vehicleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// Intersection Observer
const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            appearanceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section, .glass-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    appearanceObserver.observe(el);
});

const style = document.createElement('style');
style.textContent = ` .appear { opacity: 1 !important; transform: translateY(0) !important; } `;
document.head.appendChild(style);

// Location & Share Logic
const getLocationBtn = document.getElementById('get-location');
const shareAddressBtn = document.getElementById('share-address');
const pickupInput = document.getElementById('pickup');

if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            getLocationBtn.innerHTML = '⌛';
            navigator.geolocation.getCurrentPosition((position) => {
                pickupInput.value = `My Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
                getLocationBtn.innerHTML = '📍';
                pickupInput.classList.add('glow-capture');
                setTimeout(() => pickupInput.classList.remove('glow-capture'), 2000);
            }, (error) => {
                alert("Error: " + error.message);
                getLocationBtn.innerHTML = '📍';
            });
        }
    });
}
if (shareAddressBtn) {
    shareAddressBtn.addEventListener('click', () => {
        if (navigator.share && pickupInput.value) {
            navigator.share({ title: 'Pickup', text: pickupInput.value, url: window.location.href });
        } else if (pickupInput.value) {
            navigator.clipboard.writeText(pickupInput.value).then(() => alert("Copied!"));
        }
    });
}

// Modal Logic
const modal = document.getElementById('service-modal');
const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
const closeBtn = modal ? modal.querySelector('.close-modal') : null;
const modalTitle = document.getElementById('modal-title');
const modalIcon = document.getElementById('modal-icon');
const modalBody = document.getElementById('modal-body');
const modalActionBtn = document.getElementById('modal-action-btn');
const modalTrackBtn = document.getElementById('modal-track-btn');
const trackerInputFlow = document.getElementById('tracker-input-flow');
const orderIdInput = document.getElementById('order-id-input');

const serviceDetails = {
    bike: { title: 'Bike <span class="accent-text">Delivery</span>', icon: '🏍️', body: '<p>The fastest way to navigate Abbottabad\'s busy streets. Perfect for small parcels and urgent documents.</p><ul class="modal-benefits"><li>Pickup in 15 mins</li><li>Traffic-evading routes</li><li>Live status updates</li></ul>' },
    car: { title: 'Car & Van <span class="accent-text">Delivery</span>', icon: '🚗', body: '<p>Secure and weather-proof delivery for larger items, catering orders, or multiple packages.</p><ul class="modal-benefits"><li>Safe handling for fragile items</li><li>Bulk order capacity</li><li>Weather protected</li></ul>' },
    tracking: { title: 'Real-time <span class="accent-text">Tracking</span>', icon: '📍', body: '<p>Our futuristic tracking system gives you full visibility of your package with pin-point accuracy.</p><ul class="modal-benefits"><li>Live GPS location</li><li>Accurate ETA</li><li>Direct driver contact</li></ul>' }
};

document.querySelectorAll('.clickable-service').forEach(card => {
    card.addEventListener('click', () => {
        const key = card.getAttribute('data-service');
        const details = serviceDetails[key];
        if (details && modal) {
            modalTitle.innerHTML = details.title;
            modalIcon.innerHTML = details.icon;
            modalBody.innerHTML = details.body;
            modalBody.style.display = 'block';
            modalBody.style.opacity = '1';
            trackerInputFlow.style.display = 'none';
            modalTrackBtn.style.display = 'none';
            modalActionBtn.style.display = 'inline-block';

            if (key === 'tracking') {
                modalActionBtn.innerText = 'Track Your Order';
                modalActionBtn.onclick = () => {
                    // Transition to ID Input
                    modalBody.style.opacity = '0';
                    setTimeout(() => {
                        modalBody.style.display = 'none';
                        trackerInputFlow.style.display = 'block';
                        modalActionBtn.style.display = 'none';
                        modalTrackBtn.style.display = 'inline-block';
                        modalTrackBtn.innerText = 'Track Now';
                        orderIdInput.focus();
                    }, 300);
                };
            } else {
                modalActionBtn.innerText = 'Book This Service';
                modalActionBtn.onclick = () => {
                    closeModal();
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                };
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

const closeModal = () => { if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } };
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

if (modalTrackBtn) {
    modalTrackBtn.onclick = () => {
        const id = orderIdInput.value.trim();
        if (id.length < 4) {
            alert("Please enter a valid Order ID to proceed.");
            return;
        }
        closeModal();
        // Scroll to tracking section and trigger active state
        const trackingSection = document.getElementById('tracking');
        if (trackingSection) {
            trackingSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const map = document.querySelector('.map-container');
                if (map) {
                    map.classList.add('glow-capture');
                    setTimeout(() => map.classList.remove('glow-capture'), 3000);
                }
            }, 1000);
        }
    };
}

// Live Tracking Simulation
function initTrackingSimulation() {
    const elements = {
        distance: document.getElementById('distance-val'),
        time: document.getElementById('time-val'),
        status: document.getElementById('track-status')
    };
    if (!elements.distance) return;
    setInterval(() => {
        let progress = (Date.now() % 10000) / 10000;
        elements.distance.innerText = (4.2 * (1 - progress)).toFixed(1);
        elements.time.innerText = Math.ceil(12 * (1 - progress));
        if (progress < 0.1) elements.status.innerText = "Picked up (Mandian)";
        else if (progress > 0.9) elements.status.innerText = "Arriving Soon (Fawara Chowk)";
        else elements.status.innerText = "In Transit (Main Road)";
    }, 100);
}

// Form Submission
const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const vehicle = document.querySelector('.vehicle-card.active span').innerText;
        alert(`Success! Your ${vehicle} delivery has been scheduled.`);
    });
}
// Review System Logic
const stars = document.querySelectorAll('.star');
const reviewForm = document.getElementById('review-form');
const reviewSuccess = document.getElementById('review-success');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-rating');
        highlightStars(rating);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

    star.addEventListener('click', () => {
        currentRating = star.getAttribute('data-rating');
        highlightStars(currentRating);
        star.parentElement.classList.add('rated');
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-rating') <= rating) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }

        if (star.getAttribute('data-rating') <= currentRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentRating === 0) {
            alert("Please select a star rating!");
            return;
        }

        // Simulated submission
        reviewForm.style.opacity = '0';
        setTimeout(() => {
            reviewForm.style.display = 'none';
            reviewSuccess.style.display = 'block';
        }, 300);
    });
}

document.addEventListener('DOMContentLoaded', initTrackingSimulation);

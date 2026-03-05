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
        // Simple hamburger animation toggle
        const inner = menuBtn.querySelector('.hamburger');
        inner.style.background = mobileNav.classList.contains('active') ? 'transparent' : 'white';
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.querySelector('.hamburger').style.background = 'white';
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

// Smooth scroll for all navigation links
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

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            appearanceObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, .glass-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    appearanceObserver.observe(el);
});

// Add a class when element intersects to trigger CSS transition
const style = document.createElement('style');
style.textContent = `
    .appear {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Location Functionality
const getLocationBtn = document.getElementById('get-location');
const shareAddressBtn = document.getElementById('share-address');
const pickupInput = document.getElementById('pickup');

if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            getLocationBtn.innerHTML = '⌛'; // Loading state
            navigator.geolocation.getCurrentPosition((position) => {
                // Live Tracking Simulation
                function initTrackingSimulation() {
                    const distanceVal = document.getElementById('distance-val');
                    const timeVal = document.getElementById('time-val');
                    const statusText = document.getElementById('track-status');
                    const movingPkg = document.querySelector('.moving-pkg');

                    if (!distanceVal || !timeVal || !movingPkg) return;

                    let totalDuration = 10000; // 10s based on SVG animation
                    let startTime = Date.now();
                    let totalDistance = 4.2;
                    let totalTime = 12;

                    function updateMetrics() {
                        let elapsed = (Date.now() - startTime) % totalDuration;
                        let progress = elapsed / totalDuration;

                        // Calculate remaining values
                        let remainingDistance = totalDistance * (1 - progress);
                        let remainingTime = Math.ceil(totalTime * (1 - progress));

                        distanceVal.innerText = remainingDistance.toFixed(1);
                        timeVal.innerText = remainingTime;

                        // Update status based on progress
                        if (progress < 0.1) {
                            statusText.innerText = "Picked up (Mandian)";
                        } else if (progress > 0.9) {
                            statusText.innerText = "Arriving at Destination (Fawara Chowk)";
                        } else if (progress > 0.5) {
                            statusText.innerText = "In Transit (Main Road)";
                        } else {
                            statusText.innerText = "In Transit (Mandian → Fawara Chowk)";
                        }

                        requestAnimationFrame(updateMetrics);
                    }

                    updateMetrics();
                }

                // Initialize simulation after content is loaded
                document.addEventListener('DOMContentLoaded', () => {
                    initTrackingSimulation();
                });
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // In a real app, we'd reverse geocode here. 
                // For now, we'll populate with coordinates plus a placeholder
                pickupInput.value = `My Location (${lat.toFixed(4)}, ${lng.toFixed(4)}) - (Reverse Geocoding Simulated)`;
                getLocationBtn.innerHTML = '📍';
                pickupInput.classList.add('glow-capture');
                setTimeout(() => pickupInput.classList.remove('glow-capture'), 2000);
            }, (error) => {
                alert("Error getting location: " + error.message);
                getLocationBtn.innerHTML = '📍';
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
}

if (shareAddressBtn) {
    shareAddressBtn.addEventListener('click', () => {
        const address = pickupInput.value;
        if (!address) {
            alert("Please type an address first to share.");
            return;
        }

        // Simulate sharing
        if (navigator.share) {
            navigator.share({
                title: 'Pickup Location',
                text: `Pickup Address: ${address}`,
                url: window.location.href
            }).then(() => {
                console.log('Successful share');
            }).catch((error) => {
                console.log('Error sharing', error);
                copyToClipboard(address);
            });
        } else {
            copyToClipboard(address);
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Address copied to clipboard! You can now share it.");
    });
}

// Form Submission (Mock)
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;
    const vehicle = document.querySelector('.vehicle-card.active span').innerText;

    alert(`Success! Your ${vehicle} delivery from ${pickup} to ${dropoff} has been scheduled. \nOrder Status: Processing`);
});


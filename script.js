// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animations to sections and cards
document.querySelectorAll('.service-card, .review-card, .section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Logo hover interaction
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', () => {
    logo.querySelector('svg').style.transform = 'rotate(360deg) scale(1.1)';
    logo.querySelector('svg').style.transition = 'all 0.8s ease';
});
logo.addEventListener('mouseleave', () => {
    logo.querySelector('svg').style.transform = 'rotate(0) scale(1)';
});
// Modal Functions
function openBookingModal(serviceName) {
    const modal = document.getElementById('booking-modal');
    document.getElementById('modal-service-name').innerText = serviceName;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function openTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Service Card Event Listeners
document.getElementById('bike-delivery').addEventListener('click', () => {
    openBookingModal('Bike Delivery');
});

document.getElementById('car-delivery').addEventListener('click', () => {
    openBookingModal('Car & Van Delivery');
});

document.getElementById('track-delivery').addEventListener('click', () => {
    openTrackingModal();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});

// Form Submissions (Mock)
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your booking request has been received. Our team will contact you shortly.');
    closeModal('booking-modal');
});

document.getElementById('tracking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const orderId = e.target.querySelector('input').value;
    alert(`Searching for Order ID: ${orderId}... \nOrder status: Processing`);
    closeModal('tracking-modal');
});

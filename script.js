// Initialize AOS animations
AOS.init({ duration: 800, once: true });

// Utility: throttle a function to run at most once per `wait` ms
function throttle(fn, wait = 100) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Global variables to track manual clicks
let lastManualClick = null;
let manualTargetPos = null; // pixel offset of target section

// Smooth scroll + immediate active-state update on click
document.querySelectorAll('.nav-links a, .bottom-nav .nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    // Lock scroll-spy until we've scrolled to the target
    lastManualClick = targetId;
    manualTargetPos = target.offsetTop;

    // Smooth scroll
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Immediately set active state
    document.querySelectorAll('.nav-links a, .bottom-nav .nav-item')
      .forEach(el => el.classList.remove('active'));
    link.classList.add('active');
  });
});

// Appointment form submit
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you! Your appointment request has been submitted.');
  this.reset();
});

// Cache sections and nav items
const sections    = document.querySelectorAll('section[id]');
const headerLinks = document.querySelectorAll('.nav-links a');
const bottomLinks = document.querySelectorAll('.bottom-nav .nav-item');

// Mobile breakpoint helper
const MOBILE_MAX_WIDTH = 768;
function isMobileView() {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

// Check if Testimonials section is centered in viewport
function isTestimonialsInView() {
  const sec = document.getElementById('testimonials');
  if (!sec) return false;
  const rect = sec.getBoundingClientRect();
  const mid  = window.innerHeight / 2;
  return rect.top <= mid && rect.bottom >= mid;
}

// Try to unlock manual-lock once we've reached the target scroll position
function tryManualUnlock() {
  if (!lastManualClick || manualTargetPos === null) return;
  // within 5px tolerance
  if (Math.abs(window.scrollY - manualTargetPos) < 5) {
    lastManualClick = null;
    manualTargetPos = null;
    AOS.refresh();
  }
}

// Scroll-spy: update header + bottom nav active links
function updateActiveLink() {
  tryManualUnlock();
  if (lastManualClick) return;

  const scrollPos = window.scrollY + window.innerHeight / 3;
  let activeSection = null;
  let minDist = Infinity;

  sections.forEach(sec => {
    const center = sec.offsetTop + sec.offsetHeight / 2;
    const dist   = Math.abs(scrollPos - center);
    if (dist < minDist) {
      minDist = dist;
      activeSection = sec.id;
    }
  });

  if (!activeSection) return;

  headerLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${activeSection}`);
  });
  bottomLinks.forEach(li => {
    li.classList.toggle('active', li.getAttribute('href') === `#${activeSection}`);
  });
}

// On mobile, force "Services" active when testimonials are centered
function updateBottomNavOnTestimonials() {
  tryManualUnlock();
  if (lastManualClick || !isMobileView()) return;

  const servicesItem = document.querySelector('.bottom-nav .nav-item[href="#services"]');
  if (!servicesItem) return;

  if (isTestimonialsInView()) {
    bottomLinks.forEach(li => li.classList.remove('active'));
    servicesItem.classList.add('active');
  }
}

// Throttle handlers for performance
const throttledUpdateActive     = throttle(updateActiveLink, 100);
const throttledUpdateTestimonial = throttle(updateBottomNavOnTestimonials, 100);

// Attach events
window.addEventListener('scroll', throttledUpdateActive);
window.addEventListener('scroll', throttledUpdateTestimonial);
window.addEventListener('resize', throttledUpdateTestimonial);
window.addEventListener('load', updateActiveLink);
window.addEventListener('DOMContentLoaded', updateBottomNavOnTestimonials);

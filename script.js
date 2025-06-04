// Initialize AOS animations
AOS.init({ duration: 800, once: true });

// Smooth scroll with AOS refresh
document.querySelectorAll('.nav-links a, .bottom-nav .nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    // Scroll into view
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Force update active link immediately after click
    setTimeout(() => {
      // Set the clicked link as active immediately
          navLinks.forEach(otherLink => otherLink.classList.remove("active"));
    link.classList.add("active");
      
      // Also run the scroll-based update
      updateActiveLink();
      AOS.refresh();
    }, 100);
  });
});

// Appointment form submit
document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you! Your appointment request has been submitted.");
  this.reset();
});

// === Highlight active nav link on scroll ===
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, .bottom-nav .nav-item");


function updateActiveLink() {
  let scrollPos = window.scrollY + window.innerHeight / 2; // Use center of viewport

  let activeSection = null;
  let minDistance = Infinity;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const sectionCenter = top + height / 2;
    const distance = Math.abs(scrollPos - sectionCenter);

    // Find the closest section to center of viewport
    if (distance < minDistance) {
      minDistance = distance;
      activeSection = id;
    }
  });

  if (activeSection) {
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeSection}`) {
        link.classList.add("active");
      }
    });
  }
}

// Run on scroll and on load
window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

// ————————————————
// (1) मोबाइल ब्रेकपॉइंट सेट करें
const MOBILE_MAX_WIDTH = 768; // या अपनी media.css के हिसाब से जो px है

// (2) मददगार फ़ंक्शन: चेक करें कि अभी mobile है या नहीं
function isMobileView() {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

// (3) मददगार फ़ंक्शन: चेक करें कि Testimonials सेक्शन स्क्रीन के बीच में हो (या करीब-करीब 50% दिख रहा हो)
//     इससे ये सुनिश्चित होगा कि जब user केवल आधे से ज़्यादा सेक्शन स्क्रॉल कर के देखने लगे, तभी active हो
function isTestimonialsInView() {
  const section = document.getElementById('testimonials');
  if (!section) return false;
  const rect = section.getBoundingClientRect();

  // स्क्रीन का मिडपॉइंट (vertically)
  const viewportMid = window.innerHeight / 2;

  // तभी true रिटर्न करें जब सेक्शन का कोई हिस्सा स्क्रीन के मिडपॉइंट को कवर कर रहा हो
  return rect.top <= viewportMid && rect.bottom >= viewportMid;
}

// (4) मुख्य फ़ंक्शन: bottom-nav में Services को active करें अगर Testimonials में हों
function updateBottomNavActiveOnTestimonial() {
  if (!isMobileView()) return;

  const servicesNavItem = document.querySelector('.bottom-nav a[href="#services"]');
  if (!servicesNavItem) return;

  const allNavItems = document.querySelectorAll('.bottom-nav .nav-item');

  if (isTestimonialsInView()) {
    // सब से पहले सारे active क्लास हटाएँ
    allNavItems.forEach(item => item.classList.remove('active'));
    // फिर Services में active जोड़ें
    servicesNavItem.classList.add('active');
  } else {
    // Testimonials से बाहर निकले हैं—कुछ नहीं, ताकि पुरानी फ़ंक्शनैलिटी बरक़रार रहे
  }
}

// (5) जब scroll या resize या page load हो, तब चेक करें
window.addEventListener('scroll', updateBottomNavActiveOnTestimonial);
window.addEventListener('resize', updateBottomNavActiveOnTestimonial);
window.addEventListener('DOMContentLoaded', updateBottomNavActiveOnTestimonial);
// ————————————————

// ========================================
// Force Page Scroll on Mobile Touch Anywhere (even inside inner boxes)
// ========================================

function enableMobileTouchScrollFix() {
  if (window.innerWidth > 768) return; // Only apply for mobile devices

  // Allow touch scroll to bubble up to body even from nested boxes
  document.querySelectorAll('section, .card, .container, .testimonial-box, .service-box').forEach(elem => {
    elem.style.touchAction = 'manipulation';
    elem.addEventListener('touchstart', function (e) {
      e.stopPropagation(); // Allow scroll to propagate
    }, { passive: true });

    elem.addEventListener('touchmove', function (e) {
      // Let the scroll move upward naturally
      if (e.cancelable) e.stopPropagation();
    }, { passive: true });
  });

  // Ensure body is scrollable
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflowY = 'auto';
}

// Run after DOM content loads
window.addEventListener('DOMContentLoaded', enableMobileTouchScrollFix);
window.addEventListener('resize', enableMobileTouchScrollFix);

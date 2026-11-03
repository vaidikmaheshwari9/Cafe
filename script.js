/**
 * ==============================================================================
 * CHOUPAL CAFÉ — INTERACTIVE VANILLA JAVASCRIPT (script.js)
 * Khandwa, Madhya Pradesh, India
 * 
 * Clean, modular, well-commented code designed for beginners and maintainability.
 * Covers:
 *   1. Mobile Drawer Navigation & ARIA handling
 *   2. Sticky Header & Scroll-to-Top Button
 *   3. Smooth Scroll Navigation with Sticky Offset
 *   4. Active Navigation Observer (IntersectionObserver)
 *   5. Menu Category Filtering & Quick WhatsApp Enquiries
 *   6. Photo Gallery Lightbox Modal with Keyboard Navigation
 *   7. Dynamic Live Café Status (Open/Closed based on current time)
 *   8. Contact Form Validation, Feedback & WhatsApp Forwarding
 *   9. Toast Notification System
 *   10. Newsletter Subscription Feedback
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. DYNAMIC COPYRIGHT YEAR
  // Automatically keeps the copyright year current without manual edits.
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // Handles opening, closing, overlay backdrop, and accessibility states.
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    if (mobileToggle) {
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    // Prevent background scrolling while menu is open
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when any link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 3. STICKY HEADER & SCROLL-TO-TOP BUTTON
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  const scrollTopBtn = document.getElementById('btn-scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow and compact size on scroll
    if (siteHeader) {
      if (scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Floating back to top button visibility
    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK OBSERVER
  // Highlights the current section in the navbar as user scrolls.
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // trigger when section occupies middle view
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 5. MENU CATEGORY FILTER TABS
  // Filters menu cards smoothly based on data-category.
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Update tab active states & accessibility ARIA
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // 2. Filter menu cards
      const selectedCategory = button.getAttribute('data-category');

      menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Handle "Enquire" buttons inside menu cards
  const itemEnquireButtons = document.querySelectorAll('.btn-item-enquire');
  itemEnquireButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemName = button.getAttribute('data-item') || 'this item';
      const encodedMsg = encodeURIComponent(`Hello Choupal Café Khandwa! I would like to enquire about ordering: ${itemName}. Is it available today?`);
      const whatsappUrl = `https://wa.me/919999999999?text=${encodedMsg}`;
      
      showToast(`Opening WhatsApp for "${itemName}"...`, 'toast-whatsapp');
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    });
  });

  // --------------------------------------------------------------------------
  // 6. PHOTO GALLERY LIGHTBOX MODAL
  // Allows visitors to click photos for high-resolution inspection.
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const src = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption') || '';
    galleryData.push({ src, caption });

    // Click handler
    item.addEventListener('click', () => {
      openLightbox(index);
    });

    // Keyboard enter/space handler
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || !galleryData[index]) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentGalleryIndex];
    if (lightboxImg && item) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption;
    }
    if (lightboxCaption && item) {
      lightboxCaption.textContent = item.caption;
    }
  }

  function showNextPhoto() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // --------------------------------------------------------------------------
  // 7. LIVE CAFÉ OPENING STATUS CHECKER
  // Checks current day & time to show if the café is currently open in Khandwa.
  // --------------------------------------------------------------------------
  function updateLiveCafeStatus() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const statusSub = document.getElementById('status-sub');
    if (!statusDot || !statusText) return;

    // Get current date & time
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    let isOpen = false;
    let closingTimeText = '';
    let nextOpeningText = '';

    // Schedule definitions:
    // Mon (1) - Thu (4): 8:00 AM (480 min) to 10:30 PM (1350 min)
    // Fri (5): 8:00 AM (480 min) to 11:00 PM (1380 min)
    // Sat (6) & Sun (0): 7:30 AM (450 min) to 11:30 PM (1410 min)
    let openMin = 480;  // 8:00 AM default
    let closeMin = 1350; // 10:30 PM default

    if (day >= 1 && day <= 4) {
      openMin = 480;
      closeMin = 1350;
      closingTimeText = '10:30 PM';
      nextOpeningText = 'tomorrow at 8:00 AM';
    } else if (day === 5) {
      openMin = 480;
      closeMin = 1380;
      closingTimeText = '11:00 PM';
      nextOpeningText = 'tomorrow at 7:30 AM';
    } else {
      // Weekend
      openMin = 450; // 7:30 AM
      closeMin = 1410; // 11:30 PM
      closingTimeText = '11:30 PM';
      nextOpeningText = day === 0 ? 'tomorrow at 8:00 AM' : 'tomorrow at 7:30 AM';
    }

    if (currentTimeInMinutes >= openMin && currentTimeInMinutes < closeMin) {
      isOpen = true;
    }

    if (isOpen) {
      statusDot.className = 'status-dot open';
      statusText.textContent = `Open Now • Closes today at ${closingTimeText}`;
      if (statusSub) statusSub.textContent = 'Malwa courtyard is lively & welcoming visitors!';
    } else {
      statusDot.className = 'status-dot closed';
      statusText.textContent = `Currently Closed • Opens ${nextOpeningText}`;
      if (statusSub) statusSub.textContent = 'Courtyard will open for fresh morning tea & bakes.';
    }

    // Highlight corresponding day row in table
    const dayRows = document.querySelectorAll('.hours-row[data-day]');
    dayRows.forEach(row => row.classList.remove('today-highlight'));
    if (day >= 1 && day <= 4) {
      const monRow = document.querySelector('.hours-row[data-day="monday"]');
      if (monRow) monRow.style.fontWeight = '700';
    } else if (day === 5) {
      const friRow = document.querySelector('.hours-row[data-day="friday"]');
      if (friRow) friRow.style.fontWeight = '700';
    } else {
      const wkdRow = document.querySelector('.hours-row[data-day="weekend"]');
      if (wkdRow) wkdRow.style.fontWeight = '700';
    }
  }

  updateLiveCafeStatus();
  // Check and refresh status every 60 seconds
  setInterval(updateLiveCafeStatus, 60000);

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION & WHATSAPP BRIDGE
  // Validates inputs, simulates submission, and provides a direct WhatsApp forward option.
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const successUserText = document.getElementById('success-user-text');
  const btnForwardWhatsApp = document.getElementById('btn-forward-whatsapp');
  const btnResetForm = document.getElementById('btn-reset-form');

  let lastSubmittedPayload = null;

  if (contactForm) {
    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const emailInput = document.getElementById('form-email');
    const purposeSelect = document.getElementById('form-purpose');
    const messageInput = document.getElementById('form-message');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Validate Name
      const nameVal = nameInput.value.trim();
      const nameError = document.getElementById('name-error');
      if (!nameVal) {
        nameInput.classList.add('invalid');
        nameError.classList.add('visible');
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
        nameError.classList.remove('visible');
      }

      // 2. Validate Phone (at least 7 characters for reasonable phone input)
      const phoneVal = phoneInput.value.trim();
      const phoneError = document.getElementById('phone-error');
      const phoneRegex = /^[0-9+\s\-()]{7,15}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        phoneInput.classList.add('invalid');
        phoneError.classList.add('visible');
        isValid = false;
      } else {
        phoneInput.classList.remove('invalid');
        phoneError.classList.remove('visible');
      }

      // 3. Validate Email (optional, but if present must match basic pattern)
      const emailVal = emailInput.value.trim();
      const emailError = document.getElementById('email-error');
      if (emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          emailInput.classList.add('invalid');
          emailError.classList.add('visible');
          isValid = false;
        } else {
          emailInput.classList.remove('invalid');
          emailError.classList.remove('visible');
        }
      } else {
        emailInput.classList.remove('invalid');
        if (emailError) emailError.classList.remove('visible');
      }

      // 4. Validate Message
      const messageVal = messageInput.value.trim();
      const messageError = document.getElementById('message-error');
      if (!messageVal) {
        messageInput.classList.add('invalid');
        messageError.classList.add('visible');
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
        messageError.classList.remove('visible');
      }

      if (!isValid) {
        showToast('Please fix the highlighted fields in the form.', 'toast');
        return;
      }

      // Simulated Submission
      const purposeVal = purposeSelect ? purposeSelect.value : 'General Enquiry';
      lastSubmittedPayload = {
        name: nameVal,
        phone: phoneVal,
        email: emailVal || 'Not specified',
        purpose: purposeVal,
        message: messageVal
      };

      // Hide form, show confirmation box
      contactForm.style.display = 'none';
      if (formSuccessBox) {
        formSuccessBox.style.display = 'block';
        if (successUserText) {
          successUserText.innerHTML = `Namaste <strong>${escapeHtml(nameVal)}</strong>! Your sample enquiry for <em>"${escapeHtml(purposeVal)}"</em> has been recorded locally. In production, this data would route to the café's backend inbox.`;
        }
      }

      showToast('Enquiry simulated successfully!', 'toast-success');
    });

    // Reset Form button
    if (btnResetForm) {
      btnResetForm.addEventListener('click', () => {
        contactForm.reset();
        contactForm.style.display = 'flex';
        if (formSuccessBox) formSuccessBox.style.display = 'none';
      });
    }

    // Forward to WhatsApp button
    if (btnForwardWhatsApp) {
      btnForwardWhatsApp.addEventListener('click', () => {
        if (!lastSubmittedPayload) return;
        const formattedText = 
          `*New Enquiry - Choupal Café Khandwa*\n` +
          `• *Name:* ${lastSubmittedPayload.name}\n` +
          `• *Phone:* ${lastSubmittedPayload.phone}\n` +
          `• *Purpose:* ${lastSubmittedPayload.purpose}\n` +
          `• *Message:* ${lastSubmittedPayload.message}\n` +
          `_(Sent via Choupal Café Website Demo)_`;

        const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(formattedText)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }

  // Helper function to prevent XSS in output
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --------------------------------------------------------------------------
  // 9. NEWSLETTER SUBSCRIPTION FORM
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        showToast(`Thank you! "${emailInput.value}" subscribed to Choupal Stories.`, 'toast-success');
        newsletterForm.reset();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION UTILITY
  // Creates floating, accessible micro-alerts that dismiss automatically.
  // --------------------------------------------------------------------------
  function showToast(message, variant = 'toast') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${variant}`;
    toast.setAttribute('role', 'status');

    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close alert');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    toast.appendChild(msgSpan);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Expose toast to global scope for debugging if needed
  window.showChoupalToast = showToast;
});

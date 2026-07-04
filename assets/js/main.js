document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Header & Back to Top Scroll Effects ---
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function handleScrollEffects() {
        const scrollY = window.scrollY;
        
        // Sticky Header Class
        if (scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Back to Top Button Visibility
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Scrollspy Navigation Highlight
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-menu a[href*='${sectionId}']`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href*='${sectionId}']`)?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on load
    
    // Smooth scroll for Back to Top
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 2. Mobile Responsive Menu ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        // Toggle animation for hamburger lines
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
    });
    
    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // --- 3. Interactive Working Hours & Calendar Status ---
    function updateCalendarStatus() {
        const now = new Date();
        
        // Get day of week: 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
        const day = now.getDay();
        const hour = now.getHours();
        
        // Rows mapping:
        // Row 0: Sat-Thu (Days: 6, 0, 1, 2, 3, 4)
        // Row 1: Friday (Day: 5)
        const rowSatThu = document.getElementById('row-sat-thu');
        const rowFriday = document.getElementById('row-fri');
        
        let isOpen = false;
        
        // Remove active state
        rowSatThu.classList.remove('active');
        rowFriday.classList.remove('active');
        
        const satThuStatus = rowSatThu.querySelector('.hour-status');
        const friStatus = rowFriday.querySelector('.hour-status');
        
        // Reset status badges
        satThuStatus.textContent = 'مغلق';
        friStatus.textContent = 'مغلق';
        
        if (day === 5) {
            // Friday: 3:00 PM to 12:00 Midnight (15:00 to 24:00)
            rowFriday.classList.add('active');
            if (hour >= 15 && hour < 24) {
                isOpen = true;
                friStatus.textContent = 'مفتوح الآن';
            }
        } else {
            // Saturday to Thursday: 7:00 AM to 11:00 PM (7:00 to 23:00)
            rowSatThu.classList.add('active');
            if (hour >= 7 && hour < 23) {
                isOpen = true;
                satThuStatus.textContent = 'مفتوح الآن';
            }
        }
    }
    
    updateCalendarStatus();
    setInterval(updateCalendarStatus, 60000); // Update every minute

    // --- 4. WhatsApp Redirect Booking Form Handler ---
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form Fields
        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const service = document.getElementById('serviceType').value;
        const neighborhood = document.getElementById('neighborhood').value;
        const details = document.getElementById('issueDetails').value.trim();
        
        // Simple Validation
        if (!name) {
            alert('يرجى إدخال اسم العميل');
            document.getElementById('clientName').focus();
            return;
        }
        
        if (!phone) {
            alert('يرجى إدخال رقم الجوال');
            document.getElementById('clientPhone').focus();
            return;
        }
        
        // Validate Saudi phone formats (e.g. 05xxxxxxxx, 5xxxxxxxx, etc.)
        const saudiPhoneRegex = /^(05|5)\d{8}$/;
        if (!saudiPhoneRegex.test(phone)) {
            alert('يرجى إدخال رقم جوال سعودي صحيح (مثال: 0533359350)');
            document.getElementById('clientPhone').focus();
            return;
        }
        
        if (!service) {
            alert('يرجى اختيار نوع الخدمة المطلوبة');
            document.getElementById('serviceType').focus();
            return;
        }
        
        if (!neighborhood) {
            alert('يرجى اختيار الحي / الموقع');
            document.getElementById('neighborhood').focus();
            return;
        }
        
        // Translate service type keys to reader-friendly text
        const serviceNames = {
            'electricity': '⚡ خدمات الكهرباء',
            'plumbing': '💧 خدمات السباكة',
            'ac': '❄️ تبريد وتكييف',
            'general': '🛠️ صيانة عامة'
        };
        
        const neighborhoodNames = {
            'arid': '📍 العارض',
            'qairawan': '📍 القيروان',
            'narjis': '📍 النرجس',
            'other': '📍 أحياء أخرى بالرياض'
        };
        
        // Formulate message template
        const intro = 'السلام عليكم ورحمة الله وبركاته،\nأود حجز موعد صيانة منزلية مع شركة Blue Key. فيما يلي بيانات الطلب:';
        const formattedName = `👤 الاسم: ${name}`;
        const formattedPhone = `📞 الجوال: ${phone}`;
        const formattedService = `🛠️ الخدمة المطلوبة: ${serviceNames[service] || service}`;
        const formattedLocation = `📍 الحي / الموقع: ${neighborhoodNames[neighborhood] || neighborhood}`;
        const formattedDetails = details ? `📝 تفاصيل العطل: ${details}` : '📝 تفاصيل العطل: لا توجد تفاصيل إضافية';
        const outro = 'يرجى تأكيد موعد الزيارة والاتصال بي فوراً لتأكيد الطلب. شكراً لكم.';
        
        const fullMessage = `${intro}\n\n${formattedName}\n${formattedPhone}\n${formattedService}\n${formattedLocation}\n${formattedDetails}\n\n${outro}`;
        
        // WhatsApp number of Blue Key (966533359350)
        const waNumber = '966533359350';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
        
        // Open WhatsApp chat in a new tab (with noopener/noreferrer to prevent
        // the new tab from gaining access to window.opener — mitigates
        // "reverse tabnabbing" attacks)
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        
        // Optional: Reset form after booking
        bookingForm.reset();
        alert('تم تجهيز طلبك! سيتم تحويلك الآن إلى الواتساب لإرسال رسالة التأكيد.');
    });

    // --- 5. Legal Modals Handler ---
    const openTermsElements = document.querySelectorAll('.open-terms-modal');
    const openPrivacyElements = document.querySelectorAll('.open-privacy-modal');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const closeTermsBtn = document.getElementById('closeTermsModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');

    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll on body
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    openTermsElements.forEach(elem => {
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(termsModal);
        });
    });

    openPrivacyElements.forEach(elem => {
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    });

    closeTermsBtn.addEventListener('click', () => closeModal(termsModal));
    closePrivacyBtn.addEventListener('click', () => closeModal(privacyModal));

    // Close on click outside modal container
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            closeModal(termsModal);
        }
        if (e.target === privacyModal) {
            closeModal(privacyModal);
        }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (termsModal.classList.contains('active')) {
                closeModal(termsModal);
            }
            if (privacyModal.classList.contains('active')) {
                closeModal(privacyModal);
            }
        }
    });
});


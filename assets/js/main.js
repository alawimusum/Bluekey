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
        
        if (!rowSatThu || !rowFriday) return;
        
        const isEnglish = document.documentElement.getAttribute('lang') === 'en';
        
        let isOpen = false;
        
        // Remove active state
        rowSatThu.classList.remove('active');
        rowFriday.classList.remove('active');
        
        const satThuStatus = rowSatThu.querySelector('.hour-status');
        const friStatus = rowFriday.querySelector('.hour-status');
        
        const closedText = isEnglish ? 'Closed' : 'مغلق';
        const openText = isEnglish ? 'Open Now' : 'مفتوح الآن';
        
        // Reset status badges
        satThuStatus.textContent = closedText;
        friStatus.textContent = closedText;
        
        if (day === 5) {
            // Friday: 3:00 PM to 12:00 Midnight (15:00 to 24:00)
            rowFriday.classList.add('active');
            if (hour >= 15 && hour < 24) {
                isOpen = true;
                friStatus.textContent = openText;
            }
        } else {
            // Saturday to Thursday: 7:00 AM to 11:00 PM (7:00 to 23:00)
            rowSatThu.classList.add('active');
            if (hour >= 7 && hour < 23) {
                isOpen = true;
                satThuStatus.textContent = openText;
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
        
        const isEnglish = document.documentElement.getAttribute('lang') === 'en';
        
        // Simple Validation
        if (!name) {
            alert(isEnglish ? 'Please enter your name.' : 'يرجى إدخال اسم العميل');
            document.getElementById('clientName').focus();
            return;
        }
        
        if (!phone) {
            alert(isEnglish ? 'Please enter your phone number.' : 'يرجى إدخال رقم الجوال');
            document.getElementById('clientPhone').focus();
            return;
        }
        
        // Validate Saudi phone formats (e.g. 05xxxxxxxx, 5xxxxxxxx, etc.)
        const saudiPhoneRegex = /^(05|5)\d{8}$/;
        if (!saudiPhoneRegex.test(phone)) {
            alert(isEnglish ? 'Please enter a valid Saudi phone number (example: 0533359350).' : 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0533359350)');
            document.getElementById('clientPhone').focus();
            return;
        }
        
        if (!service) {
            alert(isEnglish ? 'Please select the service required.' : 'يرجى اختيار نوع الخدمة المطلوبة');
            document.getElementById('serviceType').focus();
            return;
        }
        
        if (!neighborhood) {
            alert(isEnglish ? 'Please select your neighborhood/location.' : 'يرجى اختيار الحي / الموقع');
            document.getElementById('neighborhood').focus();
            return;
        }
        
        // Translate service type keys to reader-friendly text
        const serviceNamesAr = {
            'electricity': '⚡ خدمات الكهرباء',
            'plumbing': '💧 خدمات السباكة',
            'ac': '❄️ تبريد وتكييف',
            'general': '🛠️ صيانة عامة'
        };
        const serviceNamesEn = {
            'electricity': '⚡ Electrical Services',
            'plumbing': '💧 Plumbing Services',
            'ac': '❄️ AC & Cooling',
            'general': '🛠️ General Maintenance'
        };
        const serviceNames = isEnglish ? serviceNamesEn : serviceNamesAr;
        
        const neighborhoodNamesAr = {
            'arid': '📍 العارض',
            'qairawan': '📍 القيروان',
            'narjis': '📍 النرجس',
            'other': '📍 أحياء أخرى بالرياض'
        };
        const neighborhoodNamesEn = {
            'arid': '📍 Al-Arid',
            'qairawan': '📍 Al-Qairawan',
            'narjis': '📍 Al-Narjis',
            'other': '📍 Other Riyadh neighborhoods'
        };
        const neighborhoodNames = isEnglish ? neighborhoodNamesEn : neighborhoodNamesAr;
        
        // Formulate message template
        let intro, formattedName, formattedPhone, formattedService, formattedLocation, formattedDetails, outro;
        
        if (isEnglish) {
            intro = 'Hello, I would like to book a home maintenance service with Blue Key. Here are my request details:';
            formattedName = `👤 Name: ${name}`;
            formattedPhone = `📞 Phone: ${phone}`;
            formattedService = `🛠️ Service Required: ${serviceNames[service] || service}`;
            formattedLocation = `📍 Neighborhood / Location: ${neighborhoodNames[neighborhood] || neighborhood}`;
            formattedDetails = details ? `📝 Fault Details: ${details}` : '📝 Fault Details: No additional details';
            outro = 'Please confirm the visit appointment and contact me as soon as possible. Thank you.';
        } else {
            intro = 'السلام عليكم ورحمة الله وبركاته،\nأود حجز موعد صيانة منزلية مع شركة Blue Key. فيما يلي بيانات الطلب:';
            formattedName = `👤 الاسم: ${name}`;
            formattedPhone = `📞 الجوال: ${phone}`;
            formattedService = `🛠️ الخدمة المطلوبة: ${serviceNames[service] || service}`;
            formattedLocation = `📍 الحي / الموقع: ${neighborhoodNames[neighborhood] || neighborhood}`;
            formattedDetails = details ? `📝 تفاصيل العطل: ${details}` : '📝 تفاصيل العطل: لا توجد تفاصيل إضافية';
            outro = 'يرجى تأكيد موعد الزيارة والاتصال بي فوراً لتأكيد الطلب. شكراً لكم.';
        }
        
        const fullMessage = `${intro}\n\n${formattedName}\n${formattedPhone}\n${formattedService}\n${formattedLocation}\n${formattedDetails}\n\n${outro}`;
        
        // WhatsApp number of Blue Key (966533359350)
        const waNumber = '966533359350';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
        
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        
        bookingForm.reset();
        alert(isEnglish ? 'Your request is ready! You will now be redirected to WhatsApp to send the confirmation message.' : 'تم تجهيز طلبك! سيتم تحويلك الآن إلى الواتساب لإرسال رسالة التأكيد.');
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

    // --- 6. Language Switcher (Arabic / English) ---
    const langToggle = document.getElementById('lang-toggle');
    
    function setLanguage(lang) {
        if (lang === 'en') {
            document.title = 'Blue Key Company | Home Maintenance Services in Riyadh';
            document.documentElement.setAttribute('lang', 'en');
            document.documentElement.setAttribute('dir', 'ltr');
            localStorage.setItem('lang', 'en');
            
            if (langToggle) {
                langToggle.innerHTML = `
                    <img src="assets/images/sa.svg" alt="العربية" class="flag-icon">
                    <span>AR</span>
                `;
                langToggle.setAttribute('aria-label', 'Switch to Arabic');
            }
        } else {
            document.title = 'شركة Blue Key | خدمات الصيانة المنزلية باحترافية وأمان في الرياض';
            document.documentElement.setAttribute('lang', 'ar');
            document.documentElement.setAttribute('dir', 'rtl');
            localStorage.setItem('lang', 'ar');
            
            if (langToggle) {
                langToggle.innerHTML = `
                    <img src="assets/images/us.svg" alt="English" class="flag-icon">
                    <span>EN</span>
                `;
                langToggle.setAttribute('aria-label', 'تبديل اللغة');
            }
        }
        
        // Dynamic input placeholders update
        const inputs = document.querySelectorAll('[data-placeholder-ar]');
        inputs.forEach(input => {
            const placeholder = lang === 'en' ? input.getAttribute('data-placeholder-en') : input.getAttribute('data-placeholder-ar');
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        });

        // Dynamic select options update
        const options = document.querySelectorAll('option[data-text-ar]');
        options.forEach(opt => {
            const text = lang === 'en' ? opt.getAttribute('data-text-en') : opt.getAttribute('data-text-ar');
            if (text) {
                opt.textContent = text;
            }
        });

        // Update calendar text if it exists
        updateCalendarStatus();
    }
    
    // Initial load language setup
    const savedLang = localStorage.getItem('lang') || 'ar';
    setLanguage(savedLang);
    
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
        });
    }

    // --- 7. Theme Switcher (Light / Dark Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            if (themeToggle) {
                themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
                themeToggle.setAttribute('aria-label', 'تبديل إلى المظهر المضيء');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            
            if (themeToggle) {
                themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
                themeToggle.setAttribute('aria-label', 'تبديل إلى المظهر المظلم');
            }
        }
    }
    
    // Initial load theme setup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

});


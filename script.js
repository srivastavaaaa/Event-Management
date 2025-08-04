// Accessibility-focused JavaScript for College Events page

// Global variables
let currentActiveTab = 'home';
let isDarkMode = false;
let currentCalendarMonth = 0; // 0 = January
let currentCalendarYear = 2025;
let currentPaymentEvent = null;
let currentPaymentAmount = 0;
let isPasswordVisible = false;

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const cardCloseButtons = document.querySelectorAll('.card-close');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('College Events page loaded successfully!');
    
    // Initialize all interactive components
    initializeNavigation();
    initializeCardCloseButtons();
    initializeKeyboardNavigation();
    initializeFocusManagement();
    initializeDarkMode();
    initializeFilters();
    initializePaymentButtons();
    initializeLoginForm();
    
    // Initialize calendar if on calendar page
    if (window.location.pathname.includes('calendar.html')) {
        console.log('Initializing calendar...');
        initializeCalendar();
    }
    
    // Add skip link for keyboard users
    addSkipLink();
});

// Login functionality
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const loginBtn = document.getElementById('login-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('Login form initialized');
    }
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
        console.log('Password toggle initialized');
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
        emailInput.addEventListener('blur', validateEmail);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
        passwordInput.addEventListener('blur', validatePassword);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
}

function handleLoginSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const rememberCheckbox = document.getElementById('remember');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Simulate successful login
        if (email === 'student@vit.ac.in' && password === 'password123') {
            // Store login state
            if (remember) {
                localStorage.setItem('rememberLogin', 'true');
                localStorage.setItem('userEmail', email);
            }
            
            // Show success message
            announceToScreenReader('Login successful! Redirecting to dashboard...');
            
            // Redirect to home page (or dashboard)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Show error message
            showLoginError('Invalid email or password. Please try again.');
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }, 2000);
}

function validateForm() {
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    
    return emailValid && passwordValid;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const email = emailInput.value.trim();
    
    // Clear previous error
    emailError.textContent = '';
    emailInput.classList.remove('error');
    
    if (!email) {
        emailError.textContent = 'Email is required';
        emailInput.classList.add('error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.classList.add('error');
        return false;
    }
    
    // Check if it's a VIT email
    if (!email.includes('@vit.ac.in')) {
        emailError.textContent = 'Please use your VIT email address';
        emailInput.classList.add('error');
        return false;
    }
    
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('password-error');
    const password = passwordInput.value;
    
    // Clear previous error
    passwordError.textContent = '';
    passwordInput.classList.remove('error');
    
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordInput.classList.add('error');
        return false;
    }
    
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long';
        passwordInput.classList.add('error');
        return false;
    }
    
    return true;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    
    isPasswordVisible = !isPasswordVisible;
    
    if (isPasswordVisible) {
        passwordInput.type = 'text';
        passwordToggle.textContent = '🙈';
        passwordToggle.setAttribute('aria-label', 'Hide password');
        announceToScreenReader('Password is now visible');
    } else {
        passwordInput.type = 'password';
        passwordToggle.textContent = '👁️';
        passwordToggle.setAttribute('aria-label', 'Show password');
        announceToScreenReader('Password is now hidden');
    }
}

function handleSocialLogin(event) {
    const button = event.currentTarget;
    const provider = button.textContent.includes('Google') ? 'Google' : 'Microsoft';
    
    // Show loading state
    const originalText = button.textContent;
    button.innerHTML = '<span class="btn-loading">Connecting...</span>';
    button.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        announceToScreenReader(`${provider} login successful! Redirecting...`);
        
        // Redirect after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 2000);
}

function showLoginError(message) {
    announceToScreenReader(message);
    
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: var(--error);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    const loginForm = document.getElementById('login-form');
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Check for saved login state
function checkSavedLogin() {
    const rememberLogin = localStorage.getItem('rememberLogin');
    const userEmail = localStorage.getItem('userEmail');
    
    if (rememberLogin === 'true' && userEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput && rememberCheckbox) {
            emailInput.value = userEmail;
            rememberCheckbox.checked = true;
        }
    }
}

// Auto-fill saved email on page load
document.addEventListener('DOMContentLoaded', checkSavedLogin);

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

function handleFilterClick(event) {
    const clickedBtn = event.currentTarget;
    const filterValue = clickedBtn.getAttribute('data-filter');
    
    // Update active filter button
    const filterContainer = clickedBtn.closest('.events-filters, .recruitment-filters, .registration-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
    }
    
    // Filter cards
    const cards = document.querySelectorAll('.event-card-full, .recruitment-card-full, .registration-card-full');
    cards.forEach(card => {
        const cardCategories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || cardCategories.includes(filterValue)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    announceToScreenReader(`Filtered by ${filterValue}`);
}

// Payment functionality
function initializePaymentButtons() {
    const paymentButtons = document.querySelectorAll('.payment-btn');
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', handlePaymentButtonClick);
    });
}

function handlePaymentButtonClick(event) {
    const clickedBtn = event.currentTarget;
    const paymentMethod = clickedBtn.getAttribute('data-payment');
    
    // Update active payment button
    const paymentContainer = clickedBtn.closest('.payment-options');
    if (paymentContainer) {
        paymentContainer.querySelectorAll('.payment-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
    }
    
    console.log('Payment method selected:', paymentMethod);
}

function openPaymentModal(eventName, amount) {
    currentPaymentEvent = eventName;
    currentPaymentAmount = amount;
    
    const modal = document.getElementById('payment-modal');
    const modalTitle = document.getElementById('modal-title');
    const summaryEvent = document.getElementById('summary-event');
    const summaryAmount = document.getElementById('summary-amount');
    const summaryTotal = document.getElementById('summary-total');
    
    if (modal && modalTitle && summaryEvent && summaryAmount && summaryTotal) {
        modalTitle.textContent = `Payment for ${eventName}`;
        summaryEvent.textContent = eventName;
        summaryAmount.textContent = `₹${amount}`;
        summaryTotal.textContent = `₹${amount}`;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
        
        announceToScreenReader(`Payment modal opened for ${eventName}`);
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Clear form
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        announceToScreenReader('Payment modal closed');
    }
}

function processPayment() {
    // Simulate payment processing
    const modal = document.getElementById('payment-modal');
    const payButton = modal.querySelector('.btn-primary');
    const originalText = payButton.textContent;
    
    payButton.textContent = 'Processing...';
    payButton.disabled = true;
    
    setTimeout(() => {
        // Simulate successful payment
        alert(`Payment successful! You have been registered for ${currentPaymentEvent}.`);
        closePaymentModal();
        
        payButton.textContent = originalText;
        payButton.disabled = false;
        
        announceToScreenReader(`Successfully registered for ${currentPaymentEvent}`);
    }, 2000);
}

function registerFree(eventName) {
    // Simulate free registration
    alert(`Successfully registered for ${eventName}! No payment required.`);
    announceToScreenReader(`Successfully registered for ${eventName}`);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('payment-modal');
    if (modal && event.target === modal) {
        closePaymentModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePaymentModal();
    }
});

// Calendar functionality
function initializeCalendar() {
    // Get calendar elements
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');
    const calendarDaysElement = document.getElementById('calendar-days');
    const eventDots = document.querySelectorAll('.event-dot');
    
    console.log('Calendar elements found:', {
        prevMonthBtn: !!prevMonthBtn,
        nextMonthBtn: !!nextMonthBtn,
        currentMonthElement: !!currentMonthElement,
        calendarDaysElement: !!calendarDaysElement,
        eventDotsCount: eventDots.length
    });
    
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', handleMonthNavigation);
        nextMonthBtn.addEventListener('click', handleMonthNavigation);
        prevMonthBtn.addEventListener('keydown', handleMonthNavigationKeydown);
        nextMonthBtn.addEventListener('keydown', handleMonthNavigationKeydown);
        console.log('Month navigation buttons initialized');
    }
    
    // Initialize event dots
    initializeEventDots();
    
    // Generate initial calendar
    generateCalendar();
    
    // Mark today's date
    markToday();
}

function handleMonthNavigation(event) {
    event.preventDefault();
    const direction = event.currentTarget.id === 'prev-month' ? -1 : 1;
    
    currentCalendarMonth += direction;
    
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    
    generateCalendar();
    announceToScreenReader(`${getMonthName(currentCalendarMonth)} ${currentCalendarYear}`);
}

function handleMonthNavigationKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleMonthNavigation(event);
    }
}

function generateCalendar() {
    const calendarDaysElement = document.getElementById('calendar-days');
    const currentMonthElement = document.getElementById('current-month');
    
    if (!calendarDaysElement) {
        console.error('Calendar days element not found');
        return;
    }
    
    const monthName = getMonthName(currentCalendarMonth);
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthName} ${currentCalendarYear}`;
    }
    
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday
    
    console.log('Generating calendar for:', monthName, currentCalendarYear);
    console.log('Days in month:', daysInMonth, 'Starting day:', startingDay);
    
    // Clear existing days
    calendarDaysElement.innerHTML = '';
    
    // Add previous month's days
    const prevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day prev-month';
        dayElement.textContent = daysInPrevMonth - i;
        calendarDaysElement.appendChild(dayElement);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        
        // Check if day has events
        const dateString = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (hasEventsForDate(dateString)) {
            dayElement.classList.add('has-event');
        }
        
        // Add event listener
        dayElement.addEventListener('click', handleDayClick);
        dayElement.addEventListener('keydown', handleDayKeydown);
        
        calendarDaysElement.appendChild(dayElement);
    }
    
    // Add next month's days to fill the grid
    const totalCells = 42; // 6 rows * 7 columns
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day next-month';
        dayElement.textContent = day;
        calendarDaysElement.appendChild(dayElement);
    }
    
    console.log('Calendar generated successfully');
}

function getMonthName(monthIndex) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
}

function hasEventsForDate(dateString) {
    // Check if any event dots have this date
    const eventDots = document.querySelectorAll('.event-dot');
    return Array.from(eventDots).some(dot => dot.getAttribute('data-date') === dateString);
}

function handleDayClick(event) {
    const day = event.currentTarget;
    const date = day.getAttribute('data-date');
    
    if (date) {
        // Highlight selected day
        clearDaySelection();
        day.classList.add('selected');
        
        // Show event details
        showDayDetails(date);
        announceToScreenReader(`Selected ${formatDate(date)}`);
    }
}

function handleDayKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleDayClick(event);
    }
}

function clearDaySelection() {
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
}

function showDayDetails(date) {
    const formattedDate = formatDate(date);
    const events = getEventsForDate(date);
    
    if (events.length > 0) {
        const eventList = events.map(event => `• ${event}`).join('\n');
        alert(`Events on ${formattedDate}:\n${eventList}`);
    } else {
        alert(`No events scheduled for ${formattedDate}`);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getEventsForDate(date) {
    // Get events from event dots with matching date
    const events = [];
    const eventDots = document.querySelectorAll('.event-dot');
    eventDots.forEach(dot => {
        if (dot.getAttribute('data-date') === date) {
            events.push(dot.getAttribute('data-event'));
        }
    });
    return events;
}

function markToday() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    document.querySelectorAll(`[data-date="${todayString}"]`).forEach(day => {
        day.classList.add('today');
    });
}

function initializeEventDots() {
    const eventDots = document.querySelectorAll('.event-dot');
    eventDots.forEach(dot => {
        dot.addEventListener('click', handleEventDotClick);
        dot.addEventListener('keydown', handleEventDotKeydown);
        
        // Add ARIA attributes
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Event: ${dot.getAttribute('data-event')}`);
    });
    console.log('Event dots initialized:', eventDots.length);
}

function handleEventDotClick(event) {
    event.preventDefault();
    const dot = event.currentTarget;
    const eventName = dot.getAttribute('data-event');
    
    showEventDetails(eventName);
    announceToScreenReader(`Event: ${eventName}`);
}

function handleEventDotKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleEventDotClick(event);
    }
}

function showEventDetails(eventName) {
    alert(`Event Details: ${eventName}\n\nThis would show detailed information about the event, including time, location, description, and registration options.`);
}

// Dark mode functionality
function initializeDarkMode() {
    // Load saved theme preference
    loadSavedTheme();
    
    // Add event listener to dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        darkModeToggle.addEventListener('keydown', handleDarkModeKeydown);
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        announceToScreenReader('Dark mode enabled');
    } else {
        isDarkMode = false;
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        announceToScreenReader('Dark mode enabled');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        announceToScreenReader('Light mode enabled');
    }
}

function handleDarkModeKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDarkMode();
    }
}

// Navigation functionality with accessibility
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
        link.addEventListener('keydown', handleNavKeydown);
    });
}

function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    const tabName = link.textContent.toLowerCase();
    
    console.log('Navigation clicked:', {
        tabName: tabName,
        href: href,
        linkText: link.textContent
    });
    
    // If the link has a real href (not just #), allow normal navigation
    if (href && href !== '#' && href !== 'index.html') {
        console.log('Allowing navigation to:', href);
        // Allow normal navigation for external links
        return;
    }
    
    // Only prevent default for internal navigation that doesn't have a real href
    if (href === '#' || !href) {
        event.preventDefault();
        console.log('Preventing default for internal navigation');
    }
    
    // Update active state
    updateActiveTab(tabName);
    
    // Announce to screen reader
    announceToScreenReader(`${tabName} tab selected`);
    
    // Here you would typically navigate to the appropriate page or section
    console.log(`Navigated to ${tabName}`);
}

function handleNavKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavClick(event);
    }
}

function updateActiveTab(tabName) {
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    // Add active class to current link
    const currentLink = Array.from(navLinks).find(link => 
        link.textContent.toLowerCase() === tabName
    );
    
    if (currentLink) {
        currentLink.classList.add('active');
        currentLink.setAttribute('aria-current', 'page');
        currentActiveTab = tabName;
    }
}

// Card close functionality
function initializeCardCloseButtons() {
    cardCloseButtons.forEach(button => {
        button.addEventListener('click', handleCardClose);
        button.addEventListener('keydown', handleCardCloseKeydown);
    });
}

function handleCardClose(event) {
    event.preventDefault();
    const card = event.currentTarget.closest('.info-card');
    if (card) {
        // Add fade out animation
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.remove();
            announceToScreenReader('Card closed');
        }, 300);
    }
}

function handleCardCloseKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardClose(event);
    }
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    // Add keyboard shortcuts for main actions
    document.addEventListener('keydown', function(event) {
        // Only trigger shortcuts when not typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key) {
            case '/':
                event.preventDefault();
                focusSearchButton();
                break;
            case 'h':
            case 'H':
                event.preventDefault();
                focusNavigation();
                break;
            case 'd':
            case 'D':
                event.preventDefault();
                toggleDarkMode();
                break;
            case '1':
                event.preventDefault();
                navigateToTab('home');
                break;
            case '2':
                event.preventDefault();
                navigateToTab('calendar');
                break;
            case '3':
                event.preventDefault();
                navigateToTab('events');
                break;
            case '4':
                event.preventDefault();
                navigateToTab('recruitment');
                break;
            case '5':
                event.preventDefault();
                navigateToTab('about');
                break;
            case '6':
                event.preventDefault();
                navigateToTab('help');
                break;
            case '7':
                event.preventDefault();
                navigateToTab('registration');
                break;
        }
    });
}

function navigateToTab(tabName) {
    const link = Array.from(navLinks).find(link => 
        link.textContent.toLowerCase() === tabName
    );
    
    if (link) {
        link.click();
        link.focus();
    }
}

function focusSearchButton() {
    const searchButton = document.querySelector('.btn-search');
    if (searchButton) {
        searchButton.focus();
        announceToScreenReader('Search button focused');
    }
}

function focusNavigation() {
    const firstNavLink = document.querySelector('.nav-link');
    if (firstNavLink) {
        firstNavLink.focus();
        announceToScreenReader('Navigation focused');
    }
}

// Focus management
function initializeFocusManagement() {
    // Track focus for better UX
    document.addEventListener('focusin', function(event) {
        const target = event.target;
        
        // Add focus indicator for better visibility
        if (target.classList.contains('nav-link') || 
            target.classList.contains('btn') || 
            target.classList.contains('card-close') ||
            target.classList.contains('calendar-day') ||
            target.classList.contains('calendar-nav-btn') ||
            target.classList.contains('event-dot') ||
            target.classList.contains('filter-btn') ||
            target.classList.contains('payment-btn') ||
            target.classList.contains('form-input') ||
            target.classList.contains('password-toggle')) {
            target.style.outline = '2px solid var(--focus-ring)';
            target.style.outlineOffset = '2px';
        }
    });
    
    document.addEventListener('focusout', function(event) {
        const target = event.target;
        
        // Remove custom focus indicator
        if (target.classList.contains('nav-link') || 
            target.classList.contains('btn') || 
            target.classList.contains('card-close') ||
            target.classList.contains('calendar-day') ||
            target.classList.contains('calendar-nav-btn') ||
            target.classList.contains('event-dot') ||
            target.classList.contains('filter-btn') ||
            target.classList.contains('payment-btn') ||
            target.classList.contains('form-input') ||
            target.classList.contains('password-toggle')) {
            target.style.outline = '';
            target.style.outlineOffset = '';
        }
    });
}

// Screen reader announcements
function announceToScreenReader(message) {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
    
    // Clear the message after a short delay
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

// Skip link functionality
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Search functionality
function handleSearch() {
    const searchButton = document.querySelector('.btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', function(event) {
            event.preventDefault();
            announceToScreenReader('Search functionality activated');
            
            // Add a subtle animation to the button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Here you would typically open a search modal or navigate to search page
            console.log('Search events clicked');
        });
    }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', handleSearch);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Focus the target for accessibility
            target.focus();
        }
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Announce page load completion to screen readers
    if (loadTime < 1000) {
        announceToScreenReader('Page loaded quickly');
    } else {
        announceToScreenReader('Page loaded');
    }
});

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// High contrast mode support
if (window.matchMedia('(prefers-contrast: high)').matches) {
    // Enhance contrast for users who prefer high contrast
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --text-primary: #000000;
            --text-secondary: #333333;
            --border: #000000;
            --focus-ring: #000000;
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    announceToScreenReader('An error occurred. Please refresh the page.');
});

// Export functions for potential external use
window.CollegeEvents = {
    announceToScreenReader,
    focusSearchButton,
    focusNavigation,
    navigateToTab,
    toggleDarkMode,
    generateCalendar,
    showDayDetails,
    showEventDetails,
    openPaymentModal,
    closePaymentModal,
    processPayment,
    registerFree,
    handleLoginSubmit,
    togglePasswordVisibility,
    validateEmail,
    validatePassword
}; 
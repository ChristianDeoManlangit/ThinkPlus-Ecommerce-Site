document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const currentPath = window.location.pathname;

    // Initialize theme (dark/light mode)
    initTheme();

    // Initialize mobile menu (for all pages)
    initMobileMenu();

    // Filter functionality for main page
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        initMainPage();
    }

    // Handle product page functionality
    if (currentPath.includes('product')) {
        initProductPage();
    }

    // Handle checkout page functionality
    if (currentPath.includes('checkout.html')) {
        loadProductDetails();
        initCheckoutPage();
    }
});

// Initialize mobile menu functionality
function initMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-menu');

    if (hamburgerBtn && mobileMenu) {
        // Toggle mobile menu on hamburger click
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : ''; // Toggle scrolling
        });

        // Close mobile menu when clicking outside the menu
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && 
                !mobileMenu.contains(e.target) && 
                e.target !== hamburgerBtn && 
                !hamburgerBtn.contains(e.target)) {
                mobileMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        });

        // Make sure mobile theme toggle button also works
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => {
                // Theme toggle functionality is handled separately, we just need to close the menu
                mobileMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
}

// Initialize theme functionality
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const body = document.body;

    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme or default to dark theme
    if (savedTheme !== 'light') {
        body.classList.add('dark-mode');

        // Update the theme toggle icons
        const lightIcon = document.querySelector('.theme-light-icon');
        const darkIcon = document.querySelector('.theme-dark-icon');

        if (lightIcon && darkIcon) {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
        
        // Save dark theme as default
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
        }
    }

    // Function to toggle theme
    const toggleTheme = () => {
        // Toggle dark mode class on body
        body.classList.toggle('dark-mode');

        // Get theme toggle icons
        const lightIcon = document.querySelector('.theme-light-icon');
        const darkIcon = document.querySelector('.theme-dark-icon');

        // Update theme toggle icon
        if (lightIcon && darkIcon) {
            lightIcon.classList.toggle('hidden');
            darkIcon.classList.toggle('hidden');
        }

        // Save theme preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    // Add event listener to desktop theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Add event listener to mobile theme toggle button
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function initMainPage() {
    // Smooth scroll functionality
    const exploreButton = document.getElementById('explore-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            const shopSection = document.getElementById('shop');
            const offset = 100; // Pixels to offset from the top
            const elementPosition = shopSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        });
    }

    const categoryButtons = document.querySelectorAll('.category-filter');
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.product-card');

    // Add click handler to product cards for better touch device support
    productCards.forEach(card => {
        const link = card.querySelector('a');

        // Add click handler to the card that redirects to the link
        card.addEventListener('click', function(e) {
            // Only handle clicks on the card itself, not on the link
            if (e.target !== link && !link.contains(e.target)) {
                window.location.href = link.getAttribute('href');
            }
        });

        // Forward hover states for better visual feedback
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // Add event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-black', 'text-white', 'active');
                btn.classList.add('bg-gray-100', 'text-gray-800');
            });

            // Add active class to clicked button
            this.classList.remove('bg-gray-100', 'text-gray-800');
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Filter products
            if (category === 'all') {
                productCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                productCards.forEach(card => {
                    if (card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // Add event listener to search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();

            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();

                if (productName.includes(searchValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // Reset category buttons when searching
            if (searchValue) {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                    // Don't add bg-gray-100 as we're using CSS variables
                });
                // Set "All" category as active
                categoryButtons[0].classList.add('active');
            }
        });
    }
}

function initProductPage() {
    // Add hover effect to related products
    const relatedProducts = document.querySelectorAll('.related-product');
    relatedProducts.forEach(card => {
        const link = card.querySelector('a');

        // Add click handler to the card that redirects to the link
        card.addEventListener('click', function(e) {
            // Only handle clicks on the card itself, not on the link
            if (e.target !== link && !link.contains(e.target)) {
                window.location.href = link.getAttribute('href');
            }
        });

        // Forward hover states for better visual feedback
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });

        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // Thumbnail image functionality
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    const mainImage = document.getElementById('main-image');
    let galleryImages = [];
    let currentImageIndex = 0;
    let slideshowInterval;

    if (thumbnails.length > 0 && mainImage) {
        // Collect all image sources
        thumbnails.forEach(thumbnail => {
            const imgSrc = thumbnail.querySelector('img').getAttribute('src');
            galleryImages.push(imgSrc);

            thumbnail.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                mainImage.setAttribute('src', imgSrc);

                // Update current index
                currentImageIndex = galleryImages.indexOf(imgSrc);
                updateActiveDot();

                // Reset slideshow timer
                resetSlideshow();
            });
        });

        // Add image gallery container
        const galleryContainer = mainImage.parentElement;
        galleryContainer.classList.add('image-gallery-container');


        // Add navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'gallery-nav gallery-prev';
        prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        galleryContainer.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'gallery-nav gallery-next';
        nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        galleryContainer.appendChild(nextButton);

        // Add slideshow dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slideshow-dots';

        galleryImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.addEventListener('click', () => {
                currentImageIndex = index;
                mainImage.setAttribute('src', galleryImages[index]);
                updateActiveDot();
                resetSlideshow();
            });
            dotsContainer.appendChild(dot);
        });

        galleryContainer.insertAdjacentElement('afterend', dotsContainer);

        // Add navigation functionality
        prevButton.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            mainImage.setAttribute('src', galleryImages[currentImageIndex]);
            updateActiveDot();
            resetSlideshow();
        });

        nextButton.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            mainImage.setAttribute('src', galleryImages[currentImageIndex]);
            updateActiveDot();
            resetSlideshow();
        });

        // Function to update active dot
        function updateActiveDot() {
            document.querySelectorAll('.dot').forEach((dot, index) => {
                if (index === currentImageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Start automatic slideshow
        startSlideshow();

        function startSlideshow() {
            slideshowInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                mainImage.setAttribute('src', galleryImages[currentImageIndex]);
                updateActiveDot();
            }, 5000);
        }

        function resetSlideshow() {
            clearInterval(slideshowInterval);
            startSlideshow();
        }
    }

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;

            // Toggle visibility
            content.classList.toggle('hidden');

            // Toggle icon
            const icon = this.querySelector('.accordion-icon');
            if (content.classList.contains('hidden')) {
                icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
            } else {
                icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
            }
        });
    });

    // Buy now button functionality
    const buyNowButton = document.getElementById('buy-now');

    if (buyNowButton) {
        buyNowButton.addEventListener('click', function() {
            // Get product details
            const productName = document.querySelector('h1').textContent;
            const productPrice = document.querySelector('.text-2xl.font-medium').textContent;
            const productImage = document.getElementById('main-image').getAttribute('src');

            // Save to localStorage
            localStorage.setItem('selectedProduct', JSON.stringify({
                name: productName,
                price: productPrice,
                image: productImage
            }));

            // Redirect to checkout
            window.location.href = 'checkout.html';
        });
    }
}

function loadProductDetails() {
    // Get selected product from localStorage
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));

    if (productData) {
        // Populate elements
        document.getElementById('product-name').textContent = productData.name;
        document.getElementById('product-price').textContent = productData.price;
        document.getElementById('product-image').setAttribute('src', productData.image);
        document.getElementById('total-amount').textContent = productData.price;
    } else {
        // If no product data, redirect to home
        window.location.href = 'index.html';
    }
}

function initCheckoutPage() {
    const quantityElement = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const totalAmount = document.getElementById('total-amount');
    const checkoutForm = document.getElementById('checkout-form');

    // Get product data from localStorage
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));
    let basePrice = 0;

    if (productData && productData.price) {
        // Extract the numeric part from the price string (e.g., "USD 1299.99" -> 1299.99)
        const priceMatch = productData.price.match(/[\d.]+/);
        if (priceMatch) {
            basePrice = parseFloat(priceMatch[0]);
        }
    }

    // Update total based on quantity
    function updateTotal(quantity) {
        if (basePrice > 0) {
            const total = (basePrice * quantity).toFixed(2);
            totalAmount.textContent = `USD ${total}`;
        }
    }

    // Quantity controls
    if (decreaseBtn && increaseBtn && quantityElement) {
        decreaseBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateTotal(quantity);
            }
        });

        increaseBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            updateTotal(quantity);
        });
    }

    // Form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = document.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                // Show success message
                alert('Thank you for your order!');

                // Clear localStorage
                localStorage.removeItem('selectedProduct');

                // Redirect to home page after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}
// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const productModal = document.getElementById('productModal');
const closeProductBtn = document.getElementById('closeProductBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const checkoutBtn = document.getElementById('checkoutBtn');
const newsletterForm = document.getElementById('newsletterForm');
const shopNowBtn = document.getElementById('shopNowBtn');

// State
let currentProducts = [...products];
let filteredProducts = [...products];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    setupEventListeners();
    cart.updateUI();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Cart modal
    cartBtn?.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCartBtn?.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Product modal
    closeProductBtn?.addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    // Close modals on outside click
    cartModal?.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    productModal?.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.remove('active');
        }
    });

    // Search
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredProducts = currentProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts();
    });

    // Category filter
    categoryFilter?.addEventListener('change', (e) => {
        const category = e.target.value;
        if (category) {
            filteredProducts = currentProducts.filter(product => product.category === category);
        } else {
            filteredProducts = [...currentProducts];
        }
        renderProducts();
    });

    // Sort filter
    sortFilter?.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        sortProducts(sortBy);
        renderProducts();
    });

    // Checkout button
    checkoutBtn?.addEventListener('click', () => {
        if (cart.items.length === 0) {
            showNotification('Your cart is empty!', 'warning');
            return;
        }
        showNotification('Proceeding to checkout...', 'success');
        // In a real app, this would navigate to checkout page
    });

    // Newsletter form
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showNotification(`Thank you for subscribing with ${email}!`, 'success');
        e.target.reset();
    });

    // Shop now button
    shopNowBtn?.addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Render Categories
function renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    const categoryFilter = document.getElementById('categoryFilter');

    if (categoriesGrid) {
        categoriesGrid.innerHTML = categories.map(category => `
            <div class="category-card" onclick="filterByCategory('${category.id}')">
                <div class="category-image">${category.icon}</div>
                <div class="category-content">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <div class="category-count">${category.productCount} products</div>
                </div>
            </div>
        `).join('');
    }

    if (categoryFilter) {
        categoryFilter.innerHTML = `
            <option value="">All Categories</option>
            ${categories.map(category => `
                <option value="${category.id}">${category.name}</option>
            `).join('')}
        `;
    }
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">No products found</p>';
            return;
        }

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" onclick="showProductDetail('${product.id}')">
                <div class="product-image">
                    ${product.icon}
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-content">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div class="product-rating">
                            <span class="stars">${getStars(product.rating)}</span>
                            <span class="reviews">(${product.reviews})</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart('${product.id}')" style="width: 100%; margin-top: 1rem;">
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Filter by Category
function filterByCategory(categoryId) {
    currentProducts = products.filter(product => product.category === categoryId);
    filteredProducts = [...currentProducts];
    
    // Update filter dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = categoryId;
    }
    
    renderProducts();
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Sort Products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => {
                if (a.badge && !b.badge) return -1;
                if (!a.badge && b.badge) return 1;
                return 0;
            });
            break;
    }
}

// Show Product Detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productDetail = document.getElementById('productDetail');
    const productModalTitle = document.getElementById('productModalTitle');

    if (productDetail && productModalTitle) {
        productModalTitle.textContent = product.name;
        productDetail.innerHTML = `
            <div class="product-detail-image">${product.icon}</div>
            <div class="product-detail-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="reviews">(${product.reviews} reviews)</span>
                </div>
                <p>${product.description}</p>
                <h4>Features:</h4>
                <ul class="product-features">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div style="margin-top: 1rem;">
                    <span style="color: ${product.inStock ? 'var(--success)' : 'var(--error)'}; font-weight: 600;">
                        ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                </div>
                <button class="btn btn-primary" onclick="addToCart('${product.id}'); productModal.classList.remove('active');" style="width: 100%; margin-top: 1rem;" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
    }

    productModal.classList.add('active');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) {
        showNotification('Product is out of stock!', 'error');
        return;
    }

    cart.addItem(product);
    showNotification(`${product.name} added to cart!`, 'success');
}

// Utility Functions
function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius)',
        color: 'white',
        fontWeight: '500',
        zIndex: '2000',
        boxShadow: 'var(--shadow-lg)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--primary-color)'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and product cards
    document.querySelectorAll('.feature-card, .product-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

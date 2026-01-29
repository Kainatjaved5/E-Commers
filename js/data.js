// Product and Category Data
const categories = [
    {
        id: 'electronics',
        name: 'Electronics',
        description: 'Latest technology and gadgets',
        icon: '📱',
        productCount: 24
    },
    {
        id: 'fashion',
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        icon: '👔',
        productCount: 36
    },
    {
        id: 'home',
        name: 'Home & Living',
        description: 'Furniture and home decor',
        icon: '🏠',
        productCount: 18
    },
    {
        id: 'sports',
        name: 'Sports & Outdoors',
        description: 'Equipment for active lifestyle',
        icon: '⚽',
        productCount: 22
    }
];

const products = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-cancelling headphones with exceptional sound quality and 30-hour battery life.',
        price: 299.99,
        category: 'electronics',
        icon: '🎧',
        inStock: true,
        rating: 4.5,
        reviews: 128,
        features: [
            'Active Noise Cancellation',
            '30-hour battery life',
            'Premium leather cushions',
            'Bluetooth 5.0'
        ],
        badge: 'Bestseller'
    },
    {
        id: '2',
        name: 'Designer Leather Jacket',
        description: 'Genuine leather jacket with modern cut and premium finish. Perfect for any occasion.',
        price: 599.99,
        category: 'fashion',
        icon: '🧥',
        inStock: true,
        rating: 4.8,
        reviews: 89,
        features: [
            '100% Genuine Leather',
            'YKK zippers',
            'Handcrafted',
            'Lifetime warranty'
        ],
        badge: 'Premium'
    },
    {
        id: '3',
        name: 'Smart Home Hub',
        description: 'Control all your smart devices from one central hub. Compatible with major smart home brands.',
        price: 149.99,
        category: 'electronics',
        icon: '🏠',
        inStock: true,
        rating: 4.3,
        reviews: 156,
        features: [
            'Voice control',
            'Mobile app',
            'Universal compatibility',
            'Easy setup'
        ]
    },
    {
        id: '4',
        name: 'Professional Yoga Mat',
        description: 'Extra thick, non-slip yoga mat with alignment markers. Perfect for all yoga styles.',
        price: 79.99,
        category: 'sports',
        icon: '🧘',
        inStock: true,
        rating: 4.6,
        reviews: 203,
        features: [
            '6mm thickness',
            'Non-slip surface',
            'Eco-friendly materials',
            'Carrying strap included'
        ]
    },
    {
        id: '5',
        name: 'Modern Coffee Table',
        description: 'Minimalist design coffee table with hidden storage compartment and tempered glass top.',
        price: 449.99,
        category: 'home',
        icon: '☕',
        inStock: false,
        rating: 4.7,
        reviews: 67,
        features: [
            'Tempered glass top',
            'Hidden storage',
            'Solid wood legs',
            'Easy assembly'
        ],
        badge: 'Limited'
    },
    {
        id: '6',
        name: 'Running Shoes Pro',
        description: 'Professional running shoes with advanced cushioning and breathable mesh upper.',
        price: 189.99,
        category: 'sports',
        icon: '👟',
        inStock: true,
        rating: 4.4,
        reviews: 298,
        features: [
            'Advanced cushioning',
            'Breathable mesh',
            'Reflective details',
            'Lightweight design'
        ]
    },
    {
        id: '7',
        name: '4K Webcam',
        description: 'Ultra HD webcam with auto-focus and noise-cancelling microphone. Perfect for streaming and video calls.',
        price: 129.99,
        category: 'electronics',
        icon: '📹',
        inStock: true,
        rating: 4.2,
        reviews: 145,
        features: [
            '4K resolution',
            'Auto-focus',
            'Noise-cancelling mic',
            'Wide angle lens'
        ]
    },
    {
        id: '8',
        name: 'Designer Sunglasses',
        description: 'UV protection sunglasses with premium frames and polarized lenses. Style meets functionality.',
        price: 249.99,
        category: 'fashion',
        icon: '🕶️',
        inStock: true,
        rating: 4.7,
        reviews: 92,
        features: [
            'UV400 protection',
            'Polarized lenses',
            'Premium frames',
            'Designer brand'
        ],
        badge: 'Trending'
    }
];

// Cart Management
class Cart {
    constructor() {
        this.items = this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.updateUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
            }
        }
        this.updateUI();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                <button class="quantity-btn" onclick="cart.removeItem('${item.id}')" style="margin-left: 0.5rem;">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.getTotalPrice().toFixed(2);
        }
    }
}

// Initialize cart
const cart = new Cart();

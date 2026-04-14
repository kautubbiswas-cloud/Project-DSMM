// --- Data ---
const foodItems = [
    {
        id: '1',
        name: 'Classic Margherita Pizza',
        description: 'Fresh mozzarella, basil, and tomato sauce on a thin crust.',
        price: 12.99,
        category: 'Veg',
        image: 'https://picsum.photos/seed/pizza/600/400',
        rating: 4.8,
    },
    {
        id: '2',
        name: 'Spicy Pepperoni Pizza',
        description: 'Zesty pepperoni, mozzarella, and chili flakes.',
        price: 14.99,
        category: 'Non-Veg',
        image: 'https://picsum.photos/seed/pepperoni/600/400',
        rating: 4.7,
    },
    {
        id: '3',
        name: 'Garden Fresh Salad',
        description: 'Crisp greens, cherry tomatoes, cucumbers, and balsamic vinaigrette.',
        price: 8.99,
        category: 'Veg',
        image: 'https://picsum.photos/seed/salad/600/400',
        rating: 4.5,
    },
    {
        id: '4',
        name: 'Double Cheeseburger',
        description: 'Two juicy beef patties, cheddar cheese, lettuce, and tomato.',
        price: 11.49,
        category: 'Non-Veg',
        image: 'https://picsum.photos/seed/burger/600/400',
        rating: 4.9,
    },
    {
        id: '5',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a gooey molten center.',
        price: 6.99,
        category: 'Dessert',
        image: 'https://picsum.photos/seed/cake/600/400',
        rating: 4.9,
    },
    {
        id: '6',
        name: 'Iced Caramel Macchiato',
        description: 'Rich espresso with milk and sweet caramel syrup.',
        price: 4.99,
        category: 'Beverage',
        image: 'https://picsum.photos/seed/coffee/600/400',
        rating: 4.6,
    },
    {
        id: '7',
        name: 'Paneer Tikka Masala',
        description: 'Grilled paneer cubes in a rich, creamy tomato gravy.',
        price: 13.49,
        category: 'Veg',
        image: 'https://picsum.photos/seed/paneer/600/400',
        rating: 4.7,
    },
    {
        id: '8',
        name: 'Crispy Chicken Wings',
        description: 'Spicy buffalo wings served with blue cheese dip.',
        price: 10.99,
        category: 'Non-Veg',
        image: 'https://picsum.photos/seed/wings/600/400',
        rating: 4.8,
    },
];

// --- State ---
let cart = [];
let activeCategory = 'All';
let searchQuery = '';

// --- DOM Elements ---
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const foodGrid = document.getElementById('food-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuSearch = document.getElementById('menu-search');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');
const summaryItems = document.getElementById('summary-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');
const backToTop = document.getElementById('back-to-top');
const successToast = document.getElementById('success-toast');
const closeToast = document.getElementById('close-toast');

// --- Functions ---

// Render Menu
function renderMenu() {
    const filtered = foodItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    foodGrid.innerHTML = filtered.map(item => `
        <div class="food-card">
            <div class="food-img">
                <img src="${item.image}" alt="${item.name}">
                <div class="food-rating"><i data-lucide="star"></i> ${item.rating}</div>
                <div class="food-category cat-${item.category.toLowerCase().replace(' ', '-')}">${item.category}</div>
            </div>
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="food-footer">
                    <span class="price">$${item.price}</span>
                    <button class="add-btn" onclick="addToCart('${item.id}')">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons(); // Re-initialize icons
}

// Add to Cart
window.addToCart = function(id) {
    const item = foodItems.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    openCart();
};

// Update Cart UI
function updateCart() {
    // Update Badge
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalQty;
    
    // Update Drawer
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 0; color: var(--slate-400);">
                <i data-lucide="shopping-cart" style="width: 4rem; height: 4rem; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <h4>${item.name}</h4>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                    <p class="text-xs text-slate-500">$${item.price}</p>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i data-lucide="minus"></i></button>
                        <span class="font-bold">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i data-lucide="plus"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Update Order Summary
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="text-xs text-slate-500">Qty: ${item.quantity}</p>
                </div>
            </div>
            <p class="font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
    
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryTotal.textContent = `$${(subtotal + 2).toFixed(2)}`;
    
    lucide.createIcons();
}

window.updateQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updateCart();
    }
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
};

function openCart() {
    cartOverlay.classList.remove('hidden');
    cartDrawer.classList.remove('hidden');
}

function closeCartDrawer() {
    cartOverlay.classList.add('hidden');
    cartDrawer.classList.add('hidden');
}

// --- Event Listeners ---

// Scroll Effects
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (window.scrollY > 500) {
        backToTop.classList.remove('hidden');
    } else {
        backToTop.classList.add('hidden');
    }
});

// Mobile Menu
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderMenu();
    });
});

// Search
menuSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMenu();
});

// Cart Toggle
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);

// Checkout
checkoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    window.location.href = '#order';
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Simple validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    if (name && email && phone && address) {
        successToast.classList.remove('hidden');
        cart = [];
        updateCart();
        checkoutForm.reset();
        setTimeout(() => {
            successToast.classList.add('hidden');
        }, 5000);
    }
});

closeToast.addEventListener('click', () => {
    successToast.classList.add('hidden');
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initial Render
renderMenu();
updateCart();

document.addEventListener('DOMContentLoaded', () => {
    // Safety Wash: Clear out stale data from "GitHub Pages" experiment if it exists
    const staleUser = JSON.parse(localStorage.getItem('user') || 'null');
    const staleCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const isMongoId = (id) => id && /^[0-9a-fA-F]{24}$/.test(id);

    // If user exists but lacks a real Mongo ID, or any cart item has a non-Mongo ID (like '6')
    if ((staleUser && !isMongoId(staleUser._id)) || (staleCart.length > 0 && !isMongoId(staleCart[0]._id))) {
        console.warn('Stale experiment data detected. Sanitizing local storage...');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        location.reload(); // Refresh to ensure app starts clean
        return;
    }

    // Navbar toggle
    const menuToggle = document.querySelector('.navbar-menu-toggle');
    const sideNavbar = document.querySelector('.side-navbar');
    const sideNavbarClose = document.querySelector('.side-navbar-close');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sideNavbar) sideNavbar.classList.add('active');
        });
    }

    if (sideNavbarClose) {
        sideNavbarClose.addEventListener('click', () => {
            if (sideNavbar) sideNavbar.classList.remove('active');
        });
    }

    // Dynamic Product Fetching (on Collection Page)
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        fetchProducts();
    }

    // New Arrivals (on Index Page)
    const homeProductGrid = document.querySelector('.product-grid');
    if (homeProductGrid && !productGrid) { // Ensure it's the home page grid, not collection
        fetchHomeProducts();
    }

    // Global Store Details
    fetchStoreDetails();

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                if (name.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            console.log('--- Frontend Login Attempt ---');
            console.log('Sending data:', { email, password: '***' });

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log('Server Response:', { status: res.status, data });

                if (res.ok) {
                    localStorage.setItem('user', JSON.stringify(data));
                    alert('Login successful!');
                    if (!data.profileCompleted) {
                        window.location.href = 'profile.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert('Login Failed: ' + (data.message || 'Invalid credentials'));
                }
            } catch (err) {
                console.error('FETCH ERROR:', err);
                alert('Backend not connected or network error occurred. Check browser console for details.');
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = registerForm.username.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            console.log('--- Frontend Registration Attempt ---');
            console.log('Sending data:', { name, email, password: '***' });

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();
                console.log('Server Response:', { status: res.status, data });

                if (res.ok) {
                    localStorage.setItem('user', JSON.stringify(data));
                    alert('Registration successful! Please complete your profile.');
                    window.location.href = 'profile.html';
                } else {
                    alert('Registration Failed: ' + (data.message || 'Unknown error'));
                }
            } catch (err) {
                console.error('FETCH ERROR:', err);
                alert('Backend not connected or network error occurred. Check console for details.');
            }
        });
    }
    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                // Only remove if it's the index page (where it starts transparent)
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }

    // Check Login Status & Update UI
    checkLoginStatus();

    // Logout Functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('cart'); // Clear cart on logout
            alert('Logged out successfully');
            window.location.href = 'index.html';
        });
    }

    // Toggle Profile Dropdown
    const profileIcon = document.getElementById('profile-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dropdownMenu) dropdownMenu.classList.toggle('active');
        });
    }

    // Close dropdown on click outside
    document.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
        }
    });
});

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.getElementById('login-link');
    const profileContainer = document.getElementById('profile-container');
    const profileIcon = document.getElementById('profile-icon');
    const emailDisplay = document.getElementById('user-email-display');

    if (user && !user.profileCompleted) {
        const path = window.location.pathname;
        if (!path.includes('profile.html') && !path.includes('login.html') && !path.includes('signup.html')) {
            window.location.href = 'profile.html';
            return;
        }
    }

    if (user && user.email) {
        if (loginLink) loginLink.style.display = 'none';
        if (profileContainer) profileContainer.style.display = 'flex';
        if (emailDisplay) emailDisplay.innerText = user.email;

        // Set initial
        const initial = user.email.charAt(0).toUpperCase();
        if (profileIcon) profileIcon.innerText = initial;

        // Add Product Link for Subscribed Users/Admins
        const dropdownMenu = document.getElementById('dropdown-menu');
        const existingAddProduct = document.getElementById('add-product-link');
        
        if (dropdownMenu && !existingAddProduct && (user.isSubscribed || user.role === 'admin')) {
            const ordersLink = Array.from(dropdownMenu.querySelectorAll('a')).find(a => a.href.includes('orders.html'));
            const addProductLink = document.createElement('a');
            addProductLink.href = 'admin-dashboard.html';
            addProductLink.className = 'dropdown-item';
            addProductLink.id = 'add-product-link';
            addProductLink.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add Product';
            
            if (ordersLink) {
                ordersLink.after(addProductLink);
            } else {
                const logoutItem = document.getElementById('logout-btn');
                if (logoutItem) {
                    dropdownMenu.insertBefore(addProductLink, logoutItem);
                } else {
                    dropdownMenu.appendChild(addProductLink);
                }
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (profileContainer) profileContainer.style.display = 'none';
    }
}

async function fetchProducts() {
    const productGrid = document.getElementById('product-grid');
    try {
        const res = await fetch('/api/products');
        const products = await res.json();

        if (products.length === 0) {
            productGrid.innerHTML = '<p>No products found. Add some in the backend!</p>';
            return;
        }

        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-img-container">
                    <img src="${product.image.startsWith('http') ? product.image : 'images/' + product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
                    <button class="btn-gradient" style="padding: 0.6rem 1.5rem; font-size: 0.9rem;" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
        productGrid.innerHTML = '<p>Failed to load products. Is the server running?</p>';
    }
}

function addToCart(product) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);

    if (confirm('Go to Checkout?')) {
        window.location.href = 'checkout.html';
    }
}

function viewDetail() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to view details.');
        window.location.href = 'login.html';
    } else {
        window.location.href = 'collection.html';
    }
}

function exploreCollection() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please sign up to explore our collection.');
        window.location.href = 'signup.html';
    } else {
        window.location.href = 'collection.html';
    }
}


async function fetchHomeProducts() {
    const homeProductGrid = document.querySelector('.product-grid');
    try {
        const res = await fetch('/api/products');
        let products = await res.json();

        // Take first 4 for home page arrivals
        products = products.slice(0, 4);

        if (products.length === 0) return;

        homeProductGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-img-container">
                    <img src="${product.image.startsWith('http') ? product.image : 'images/' + product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
                    <button class="btn-gradient" style="padding: 0.6rem 1.5rem; font-size: 0.9rem;" onclick="viewDetail()">View Detail</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Home Products Error:', err);
    }
}

async function fetchStoreDetails() {
    try {
        const res = await fetch('/api/store');
        if (!res.ok) return;
        const store = await res.json();

        // Update Footer Brand Info
        const footerDesc = document.querySelector('.footer-brand p');
        if (footerDesc) footerDesc.innerText = `The premium destination for the modern fashionista. Located at ${store.address}. Phone: ${store.phone}`;

        // Update Social Links if they match the store model
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks && store.socials) {
            socialLinks.innerHTML = `
                <a href="${store.socials.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="${store.socials.twitter}" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                <a href="${store.socials.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>
            `;
        }

        // Add Contact Info to Footer if needed
        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks) {
            const contactDiv = document.createElement('div');
            contactDiv.style.marginTop = '1.5rem';
            contactDiv.innerHTML = `
                <h3 style="color: white; margin-bottom: 1rem;">Visit Us</h3>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">${store.openingHours}</p>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 5px;">${store.email}</p>
            `;
            footerLinks.appendChild(contactDiv);
        }
    } catch (err) {
        console.error('Store Details Error:', err);
    }
}


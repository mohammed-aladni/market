let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkOutButton = document.querySelector('.checkOut');
let products = [];
let cart = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Add products to HTML
const addDataToHTML = (productList = products) => {
    listProductHTML.innerHTML = '';
    if (productList.length > 0) {
        productList.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        listProductHTML.innerHTML = '<p>No products found</p>';
    }
};

// Load products and initialize the app
const initApp = () => {
    const pageTitle = document.title.toLowerCase();
    fetch('./products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            products = data.filter(product => product.category === pageTitle);
            console.log(`Filtered Products for "${pageTitle}":`, products);
            addDataToHTML(products);

            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                addCartToHTML();
            }
        })
        .catch(error => console.error('Error loading products:', error));
};

// Handle search form submission
document.querySelector('.search form').addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    addDataToHTML(filteredProducts);
});

// Add to cart
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        const id_product = event.target.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    const itemInCart = cart.findIndex(item => item.product_id == product_id);
    if (itemInCart === -1) {
        cart.push({ product_id, quantity: 1 });
    } else {
        cart[itemInCart].quantity += 1;
    }
    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Update cart HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    cart.forEach(item => {
        const product = products.find(product => product.id == item.product_id);
        if (product) {
            const newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.innerHTML = `
                <div class="image"><img src="${product.image}" alt="${product.name}"></div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>`;
            listCartHTML.appendChild(newItem);
            totalQuantity += item.quantity;
        }
    });

    iconCartSpan.innerText = totalQuantity;

    // Add event listeners for quantity buttons
    listCartHTML.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', event => {
            const id = event.target.closest('.item').dataset.id;
            updateCartQuantity(id, 1);
        });
    });

    listCartHTML.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', event => {
            const id = event.target.closest('.item').dataset.id;
            updateCartQuantity(id, -1);
        });
    });
};

// Function to update quantity
const updateCartQuantity = (product_id, change) => {
    const itemIndex = cart.findIndex(item => item.product_id == product_id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        addCartToHTML();
    }
};

// Checkout functionality
if (checkOutButton) {
    checkOutButton.addEventListener('click', () => {
        const totalAmount = cart.reduce((total, item) => {
            const product = products.find(p => p.id == item.product_id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
        window.location.href = 'payment.html';
    });
}

initApp();

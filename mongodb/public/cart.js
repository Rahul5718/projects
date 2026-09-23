// Function to fetch cart data and render it on the page
async function loadCart() {
    const container = document.getElementById('cart-container');
    
    try {
        const response = await fetch('/cart-data');
        if (!response.ok) throw new Error('Failed to fetch cart items');

        const products = await response.json();
        
        if (!products || products.length === 0) {
            container.innerHTML = '<h2>No Products in Cart!</h2>';
            return;
        }

        let html = '<ul class="cart__item-list">';
        
        products.forEach(p => {
            const prod = p.productId || {};
            const title = prod.title || 'Unknown Product';
            const price = prod.price ? prod.price.toFixed(2) : '0.00';
            const quantity = p.quantity || 1;
            const prodId = prod._id || '';

            html += `
                <li class="cart__item" data-id="${prodId}">
                    <h2>${title}</h2>
                    <p>Quantity: ${quantity}</p>
                    <p>Price: $${price}</p>
                    
                    <!-- Delete Form -->
                    <form class="delete-form">
                        <input type="hidden" value="${prodId}" name="productId">
                        <button class="btn danger" type="submit">Delete</button>
                    </form>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;

        // Attach event listeners to all delete forms for seamless removal
        attachDeleteHandlers();

    } catch (err) {
        console.error('Error loading cart:', err);
        container.innerHTML = '<p style="text-align: center; color: red;">Failed to load cart items.</p>';
    }
}

// Handle deletion asynchronously without page reload
function attachDeleteHandlers() {
    const forms = document.querySelectorAll('.delete-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default full page reload
            
            const productId = form.querySelector('input[name="productId"]').value;
            const listItem = form.closest('.cart__item');

            try {
                const response = await fetch('/cart-delete-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                if (response.ok) {
                    // Instantly remove the item element from the UI
                    listItem.remove();

                    // Check if cart is now empty
                    const remainingItems = document.querySelectorAll('.cart__item');
                    if (remainingItems.length === 0) {
                        document.getElementById('cart-container').innerHTML = '<h2>No Products in Cart!</h2>';
                    }
                } else {
                    alert('Failed to delete item');
                }
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        });
    });
}

// Load cart on page initialization
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
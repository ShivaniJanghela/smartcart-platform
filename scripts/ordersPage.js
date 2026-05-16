import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/dileveryOptions.js';
import { formatCurrency } from './utils/money.js';
import { addToCart } from '../data/cart.js';
import dayjs from 'https://esm.sh/dayjs';

function renderOrdersPage() {
  let ordersHTML = '';

  // Sync navbar cart layout quantity badge
  const cartQuantity = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
  const cartQuantityEl = document.querySelector('.js-cart-quantity');
  if (cartQuantityEl) {
    cartQuantityEl.innerHTML = cartQuantity;
  }

  if (orders.length === 0) {
 ordersHTML = `
  <div class="no-orders-message" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; font-family: Roboto, Arial, sans-serif;">
    <div style="font-size: 24px; font-weight: 800; color: #0F1111; margin-bottom: 20px; letter-spacing: -0.5px;">
     You haven't placed any orders yet
    </div>
    
    <a href="amazon.html" style="display: inline-block; background-color: #FFD814; color: #0F1111; text-decoration: none; padding: 12px 32px; font-size: 17px; font-weight: 100; border-radius: 8px; box-shadow: 0 2px 5px rgba(213,217,217,.5); transition: background-color 0.1s;">
      Continue shopping
    </a>
  </div>
`;
  } else {
    orders.forEach((order) => {
      let orderTotalCents = 0;
      
      // Calculate item cost + matching delivery price configurations
      order.items.forEach((item) => {
        const product = getProduct(item.productId);
        const deliveryOption = getDeliveryOption(item.deliveryOptionId);
        
        if (product) {
          orderTotalCents += product.priceCents * item.quantity;
        }
        if (deliveryOption) {
          orderTotalCents += deliveryOption.priceCents;
        }
      });

      // Maintain consistent tax rule calculations (10%)
      const taxCents = orderTotalCents * 0.1;
      const finalTotalCents = orderTotalCents + taxCents;

      // Generates your exact original HTML structure blocks
      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${order.orderTime}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(finalTotalCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
           ${renderOrderItemsHTML(order)}
          </div>
        </div>
      `;
    });
  }

  const ordersGridElement = document.querySelector('.js-orders-grid');
  if (ordersGridElement) {
    ordersGridElement.innerHTML = ordersHTML;
  }

  
// Put this right before the last closing brace of renderOrdersPage()
  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      // Safely grab the product ID directly from the attribute
      const productId = button.getAttribute('data-product-id');
      
      // 1. Add 1 quantity of this product to the cart array
      addToCart(productId, 1); 
      
      // 2. Pull the newly updated cartQuantity value from localStorage
      const cartQuantity = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
      
      // 3. Update the header navbar badge instantly
      const cartQuantityEl = document.querySelector('.js-cart-quantity');
      if (cartQuantityEl) {
        cartQuantityEl.innerHTML = cartQuantity;
      }
      
      alert('Item added back to cart!');
    });
  });

}

// Inner generator mapping specific order item lists inside .order-details-grid
// UPDATE THE FUNCTION TO LOOK EXACTLY LIKE THIS:
function renderOrderItemsHTML(order) { // <-- 1. Accept 'order' here
  let itemsHTML = '';

  // 2. Loop through order.items 
  order.items.forEach((item) => {
    const product = getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    
    const today = dayjs();
    const deliveryDateString = today.add(deliveryOption?.deliveryDay || 7, 'days').format('MMMM D');

    if (!product) return;

    // 3. tracking link  uses both order.id and product.id
    itemsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${deliveryDateString}
        </div>
        <div class="product-quantity">
          Quantity: ${item.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <!-- FIXED LINK: Passes both parameters dynamically -->
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return itemsHTML;
}
renderOrdersPage();
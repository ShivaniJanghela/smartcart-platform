// scripts/trackingPage.js
import { getProduct } from '../data/products.js';
import { orders } from '../data/orders.js';
import { getDeliveryOption } from '../data/dileveryOptions.js';
import dayjs from 'https://esm.sh/dayjs';

function renderTrackingPage() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // 1. Get BOTH the unique Order ID and the Product ID from the URL bar
  const orderId = urlParams.get('orderId');
  const productId = urlParams.get('productId');

  if (!orderId || !productId) {
    console.error("Missing orderId or productId in tracking URL parameters.");
    return;
  }

  const product = getProduct(productId);
  if (!product) return;

  // 2. Find the EXACT order matching our unique orderId
  let matchingOrder;
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  if (!matchingOrder) {
    console.error("Matching order not found in history.");
    return;
  }

  // 3. Find the specific item inside that exact order to grab the correct details
  let itemQuantity = 1; 
  let deliveryOptionId = '1';

  matchingOrder.items.forEach((item) => {
    if (item.productId === productId) {
      itemQuantity = item.quantity;
      deliveryOptionId = item.deliveryOptionId;
    }
  });

  const deliveryOption = getDeliveryOption(deliveryOptionId);
  
  // --- DYNAMIC PROGRESS LOGIC ---
  const orderTime = dayjs(matchingOrder.orderTime); 
  const today = dayjs();
  const totalDeliveryDays = deliveryOption?.deliveryDay || 7;
  const deliveryDate = orderTime.add(totalDeliveryDays, 'days');

  const totalDuration = deliveryDate.diff(orderTime, 'hours');
  const timePassed = today.diff(orderTime, 'hours');
  
  let progressPercent = Math.round((timePassed / totalDuration) * 100);
  if (progressPercent < 0) progressPercent = 0;
  if (progressPercent > 100) progressPercent = 100;

  // --- UPDATE DOM CONTENT ---
  const deliveryDateString = deliveryDate.format('dddd, MMMM D');
  document.querySelector('.js-delivery-date').innerHTML = `Arriving on ${deliveryDateString}`;
  document.querySelector('.js-product-name').innerHTML = product.name;
  document.querySelector('.js-product-quantity').innerHTML = `Quantity: ${itemQuantity}`;
  document.querySelector('.js-product-image').src = product.image;

  // Update Progress Bar Width
  const progressBarEl = document.querySelector('.js-progress-bar');
  if (progressBarEl) {
    progressBarEl.style.width = `${progressPercent}%`;
  }

  // Toggle .current-status highlights
  const preparingEl = document.querySelector('.js-status-preparing');
  const shippedEl = document.querySelector('.js-status-shipped');
  const deliveredEl = document.querySelector('.js-status-delivered');

  if (preparingEl) preparingEl.classList.remove('current-status');
  if (shippedEl) shippedEl.classList.remove('current-status');
  if (deliveredEl) deliveredEl.classList.remove('current-status');

  if (progressPercent < 35 && preparingEl) {
    preparingEl.classList.add('current-status');
  } else if (progressPercent >= 35 && progressPercent < 90 && shippedEl) {
    shippedEl.classList.add('current-status');
  } else if (progressPercent >= 90 && deliveredEl) {
    deliveredEl.classList.add('current-status');
  }

  // Navbar sync
  const cartQuantity = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
  const cartQuantityEl = document.querySelector('.js-cart-quantity');
  if (cartQuantityEl) {
    cartQuantityEl.innerHTML = cartQuantity;
  }
}

renderTrackingPage();
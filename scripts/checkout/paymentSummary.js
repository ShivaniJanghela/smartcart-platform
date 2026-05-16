import { cart, clearCart } from '../../data/cart.js';
import { createOrder } from '../../data/orders.js';
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/dileveryOptions.js";
import { formatCurrency } from "../utils/money.js";


export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
            <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
            ₹${formatCurrency(totalCents)}</div>
          </div>

          <button class="js-place-order button-primary">
            Proceed to buy
          </button>
  `;
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  // Inside your renderPaymentSummary function, right after setting the innerHTML:

const placeOrderBtn = document.querySelector('.js-place-order'); // Ensure your HTML button has this class hook

if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add items before placing an order.");
      return;
    }

    // 1. Snapshot the cart items into the orders array
    createOrder(cart);

    // 2. Clear out the active cart data
    clearCart();

    // 3. Redirect the browser straight to your orders history page
    window.location.href = 'orders.html'; 
  });
}
}

import { products, getProduct } from "../../data/products.js";
import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/dileveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
import dayjs from "https://esm.sh/dayjs";

export function renderOrderSummary() {
  let cartSummary = ``;
  cart.forEach((cartItem) => {
    let matchingProduct = getProduct(cartItem.productId);
    let deliveryOption = getDeliveryOption(cart.deliveryOptionId);

    deliveryOptions.forEach((option) => {
      option.id === cartItem.deliveryOptionId && (deliveryOption = option);
    });
    cartSummary += `
 <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${deliveryDate(deliveryOption?.deliveryDay)}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link"
                  data-product-id='${matchingProduct.id}'
                  data-cart-quantity='${cartItem.quantity}'>
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link"
                  data-product-id='${matchingProduct.id}'
                  >
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
              ${deliveryOptionsHTML(cartItem, matchingProduct)}
              </div>
            </div>
          </div>
          </div>
`;
  });

  function deliveryOptionsHTML(cartItem, matchingProduct) {
    let html = ``;
    deliveryOptions.forEach((deliveryOption, index) => {
      let shippingPrice;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      shippingPrice =
        deliveryOption.deliveryDay === 7
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)}`;

      html += `
      <div class="delivery-option js-delivery-option"
      data-delivery-option-id=${deliveryOption.id}
            data-product-id=${matchingProduct.id}>
          <input type="radio" 
          ${isChecked ? "checked" : ""}
            class="delivery-option-input "
            name="delivery-option-${matchingProduct.id}"
            >
          <div>
            <div class="delivery-option-date">
              ${deliveryDate(deliveryOption.deliveryDay)}
            </div>
            <div class="delivery-option-price">
              ${shippingPrice} - Shipping
            </div>
          </div>
      </div>
`;
    });

    return html;
  }

  function deliveryDate(addDays) {
    let today = dayjs();
    let deliveryDate = today.add(addDays, "days");
    let formattedDeliveryDate = deliveryDate.format("dddd, MMM D");
    return formattedDeliveryDate;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummary;

  document.querySelectorAll(".js-delete-quantity-link").forEach((deleteBtn) => {
    let productId = deleteBtn.dataset.productId;
    deleteBtn.addEventListener("click", () => {
      removeFromCart(productId);
      //  To remove product HTML we can either use DOM or regenate HTML using renderOrderSummary.
      // document.querySelector(`.js-cart-item-container-${productId}`).remove();
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  document
    .querySelectorAll(".js-delivery-option")
    .forEach((deliveryOptionBtn) => {
      deliveryOptionBtn.addEventListener("click", () => {
        const { productId, deliveryOptionId } = deliveryOptionBtn.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  // document.querySelectorAll(".js-update-quantity-link").forEach((updateBtn) => {
  //   updateBtn.addEventListener("click", (event) => {
  //     const {productId ,cartQuantity}= updateBtn.dataset;
  //     console.log(event.target)
  //     // document.querySelectorAll('.quantity-label').forEach((element)=>{
  //     // element.target.innerHTML='';
  //     // })
  //     updateBtn.innerHTML = `
  //       <input type="number" class="quantity-input" style="width:30px" value =${cartQuantity} >
  //       <span class="save-quantity-link link-primary" style="color:green">Save</span>
  //     `;
  //     // updateBtn.classList.toggle('is-editing-quantity')
  //   });
  // });
}

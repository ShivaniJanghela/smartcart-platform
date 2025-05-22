import { products } from "../data/products.js";
import { cart, removeFromCart, updateDeliveryOption } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOptions } from "../data/dileveryOptions.js";
import dayjs from "https://esm.sh/dayjs";

export function deliveryDate(addDays) {
  let today = dayjs();
  let deliveryDate = today.add(addDays, "days");
  let formattedDeliveryDate = deliveryDate.format("dddd, MMM D");
  return formattedDeliveryDate;
}

let cartSummary = ``;
cart.forEach((cartItem) => {
  let matchingProduct;
  let deliveryOption;

  products.forEach((product) => {
    product.id === cartItem.productId && (matchingProduct = product);
  });

  deliveryOptions.forEach((option) => {
    option.id === cartItem.deliveryOptionId && (deliveryOption = option);
  });
  // console.log(88, matchingProduct);
  console.log(deliveryOption?.deliveryDay);
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
                ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary jsDeleteQuantity"
                  data-product-id='${matchingProduct.id}'>
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
console.log(cart);

document.querySelector(".js-order-summary").innerHTML = cartSummary;
document.querySelectorAll(".jsDeleteQuantity").forEach((deleteBtn) => {
  let productId = deleteBtn.dataset.productId;
  deleteBtn.addEventListener("click", () => {
    removeFromCart(productId);
    //  remove product HTML using DOM
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
  });
});

document.querySelectorAll(".js-delivery-option")
.forEach((deliveryOptionBtn) => {
    deliveryOptionBtn.addEventListener("click", () => {
      const { productId, deliveryOptionId } = deliveryOptionBtn.dataset;
      console.log("first",productId, deliveryOptionId)
      updateDeliveryOption(productId, deliveryOptionId);
    });
  });

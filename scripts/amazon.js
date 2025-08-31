import { cart, addToCart,updateCart} from "../data/cart.js";
import { products } from "../data/products.js";
let productHTML = ``;
products.forEach((product) => {
  productHTML += `
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src=${product.image}>
                </img>
            </div>
  
            <div class="product-name limit-text-to-2-lines">
            ${product.name}
            </div>
  
            <div class="product-rating-container">
              <img class="product-rating-stars"
                src=${product.getStarURL()}>
              </img>
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>
  
            <div class="product-price">
             ${product.getPrice()}
            </div>
       
            <div class="product-quantity-and-sizechart">
              <div class="product-quantity-container">
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
            </div>
                ${product.extraInfoHtml()}
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png"></img>
            Added
          </div>

          <button 
          class="add-to-cart-button button-primary" 
          data-product-id="${product.id}" 
          >
            Add to Cart
          </button>
        </div>
        `;
});
let cartQuantity=JSON.parse(localStorage.getItem("cartQuantity"))|| 0;
document.querySelector(".cart-quantity").innerHTML = cartQuantity;

document.querySelector(".products-grid").innerHTML = productHTML;

document.querySelectorAll(".add-to-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    let productId = button.dataset.productId;

    // find the <select> inside the same product container
    let container = button.closest(".product-container");
    let selectEl = container.querySelector(".product-quantity-container select");
    let productQuantity = parseInt(selectEl.value, 10);

    addToCart(productId, productQuantity);
  });
});

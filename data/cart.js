export let cart;
function loadFromStroage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [
    {
      productId: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
      quantity: 2,
      deliveryOptionId: "1",
    },
    {
      productId: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
}
loadFromStroage();

export function saveToStroage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCart() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));

  const cartQuantityEl = document.querySelector(".cart-quantity");
  if (cartQuantityEl) {
    cartQuantityEl.innerHTML = cartQuantity;
  }
}

// Alogithum
// 1. check if product already in cart(true/false)
// 2. true - increase quantity by 1
// 3. false - add it to cart

export function addToCart(productId, productQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    productId === cartItem.productId && (matchingItem = cartItem);
  });
  matchingItem
    ? (matchingItem.quantity += productQuantity)
    : cart.push({
        productId,
        quantity: productQuantity,
        deliveryOptionId: "1",
      });
  console.log(cart);
  updateCart();
  saveToStroage();
}

// Alogithum
// 1. create new array
// 2. loop through the original cart
// 3. add each product to the new array,except for the matching productId
// 4 OR use filter method to filter to only include items that does not match productId

export function removeFromCart(productId) {
  // let newCart = [];
  // cart.forEach((cartItem) => {
  //   if (cartItem.productId !== productId) {
  //     newCart.push(cartItem);
  //   }
  // });
  // cart = newCart;
  cart = cart.filter((cartItem) => {
    return cartItem.productId !== productId;
  });
  updateCart();
  saveToStroage();
}

// Alogithum
// 1. need to know the product that we want to update and delivery option we choose
// 2. looop through the cart and find the product with the help of productId
// 3. update the deliveryOptionId of the product in original cart

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStroage();
}

export function clearCart() {
  cart = []; // Empty the global cart array
  saveToStroage(); // Sync the empty cart to localStorage
  updateCart(); // Update the navbar cart quantity badge to 0
}
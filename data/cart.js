export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
    quantity: 2,
    deliveryOptionId:'1'
  },
  {
    productId: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
    quantity: 1,
    deliveryOptionId:'2'

  },
];

function saveToStroage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Alogithum
// 1. check if product already in cart(true/false)
// 2. true - increase quantity by 1
// 3. false - add it to cart

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    productId === cartItem.productId && (matchingItem = cartItem);
  });
  matchingItem
    ? (matchingItem.quantity += 1)
    : cart.push({
        productId,
        quantity: 1,
        deliveryOptionId:'1'

      });
  saveToStroage();
}

// Alogithum
// 1. create new array
// 2. loop through the original cart
// 3. add each product to the new array,except for the matching productId

export function removeFromCart(productId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStroage();
}

// Alogithum
// 1. need to know the product that we want to update and delivery option we choose
// 2. looop through the cart and find the product with the help of productId
// 3. update the deliveryOptionId of the product in original cart

export function updateDeliveryOption(productId,deliveryOptionId){
  let matchingItem;
  cart.forEach((cartItem)=>{
if(productId===cartItem.productId){
  matchingItem=cartItem;
    

}
  })
  matchingItem.deliveryOptionId=deliveryOptionId;
  saveToStroage();
}




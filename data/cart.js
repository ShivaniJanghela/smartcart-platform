export let cart = [
  {
    productId: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
    quantity: 2,
  },
  {
    productId: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
    quantity: 1,
  },
];
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
      });
}
let newCart = [];

export function removeFromCart(productId) {
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
}

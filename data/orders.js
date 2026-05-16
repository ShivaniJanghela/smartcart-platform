// Load past orders from storage, or initialize as an empty array if none exist
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveOrdersToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

// This function takes the current cart items and archives them as a past order
export function createOrder(cartItems) {
  if (cartItems.length === 0) return;

  const newOrder = {
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generates a unique tracking ID
    orderTime: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    items: [...cartItems] // Save a frozen snapshot copy of what was in the cart
  };

  orders.unshift(newOrder); // Put the newest order at the top of the list
  saveOrdersToStorage();
}
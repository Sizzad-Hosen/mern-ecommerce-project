export const calculateTotalPrice = (cartData) => {
    return cartData.reduce((total, item) => {
      const productPrice = item.productId?.price || 0; // Assuming the price is inside productId object
      const quantity = item.quantity || 1; // Default quantity to 1 if not provided
      return total + productPrice * quantity;
    }, 0).toFixed(2); // Returning the total price rounded to 2 decimal places
  };
  
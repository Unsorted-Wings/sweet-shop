// Sweet data model and constants

export const SWEET_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock'
}

export const createSweet = (id, name, price, quantity, description = '', image = '') => ({
  id,
  name,
  price,
  quantity,
  description,
  image,
  status: quantity === 0 ? SWEET_STATUS.OUT_OF_STOCK : 
          quantity <= 5 ? SWEET_STATUS.LOW_STOCK : 
          SWEET_STATUS.IN_STOCK
})

// Sample sweet data
export const SAMPLE_SWEETS = [
  createSweet(1, 'Chocolate Cake', '$12.99', 8, 'Rich chocolate cake with creamy frosting'),
  createSweet(2, 'Vanilla Cupcake', '$8.99', 0, 'Classic vanilla cupcake with buttercream'),
  createSweet(3, 'Strawberry Tart', '$15.50', 3, 'Fresh strawberry tart with pastry cream'),
  createSweet(4, 'Chocolate Chip Cookies', '$6.99', 12, 'Homemade chocolate chip cookies'),
  createSweet(5, 'Red Velvet Cake', '$18.99', 2, 'Traditional red velvet with cream cheese frosting')
]

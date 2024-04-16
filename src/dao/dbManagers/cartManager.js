const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');

class CartManager {
    constructor() {}

    async prepare() {

        if (CartModel.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async createCart() {
        try {
            
        await CartModel.create({
                products: []
            });

        } catch (error) {
            console.error("Error creating Cart:", error);
            throw error;
        }
    }
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findOne({ _id: cartId }).populate('products.product').lean();
            return cart ? cart : null;
        } catch (error) {
            console.error("Error obtaining cart by ID:", error);
            return null;
        }
    }
    async updateCart(cartId, products) {
        try {
            let cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIds = products.map(product => product.product);
            const existingProducts = await ProductModel.find({ _id: { $in: productIds } }).lean();
            if (existingProducts.length !== productIds.length) {
                throw new Error('One or more products not found');
            }

            // Reemplazar el array de productos del carrito con el nuevo array
            cart.products = products;
            await cart.save();


            return cart;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }


    async deleteProductFromCart( cartId, productId) {
        try {
            let cart = await CartModel.findById(cartId);
            
            // Verificar si el carrito existe
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            // Filtrar el array de productos para eliminar el producto con el ID dado
            cart.products = cart.products.filter(product => product.product.toString() !== productId);
    
            // Guardar el carrito actualizado en la base de datos
            await cart.save();
    
            // Retornar el carrito actualizado
            return cart;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Internal server error');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            // Encontar el índice del producto en el array de productos del carrito
            const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }
    
            // Actualizar la cantidad del producto en el carrito
            cart.products[productIndex].quantity = quantity;
    
            // Guardar los cambios en el carrito
            await cart.save();
    
            // Retornar el carrito actualizado
            return cart;
        } catch (error) {
            console.error('Error updating product quantity in cart:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            await CartModel.findByIdAndUpdate({ _id: cartId }, { products: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error('Internal server error');
        }
    }
}

module.exports = CartManager;

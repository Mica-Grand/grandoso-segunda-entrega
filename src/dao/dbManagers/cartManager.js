// cart.manager.js
const Carts = require('../models/cart.model');

class CartManager {
    constructor() {}

    async prepare() {

        if (Carts.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }


    async getCartById(cartId) {
        try {
            return await Cart.findById(cartId).populate('products');
        } catch (error) {
            console.error('Error getting cart by ID:', error);
            throw new Error('Internal server error');
        }
    }

    async updateCart(cartId, products) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, { products }, { new: true }).populate('products');
            return updatedCart;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw new Error('Internal server error');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, { $pull: { products: productId } }, { new: true }).populate('products');
            return updatedCart;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw new Error('Internal server error');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { _id: cartId, 'products._id': productId },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            ).populate('products');
            return updatedCart;
        } catch (error) {
            console.error('Error updating product quantity in cart:', error);
            throw new Error('Internal server error');
        }
    }

    async clearCart(cartId) {
        try {
            await Cart.findByIdAndUpdate(cartId, { products: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error('Internal server error');
        }
    }
}

module.exports = CartManager;

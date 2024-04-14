const CartModel = require('../models/cart.model');

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
            const cart = await CartModel.findOne({ _id: cartId }).populate('products').lean();

            return cart ?
            cart.products
            : [];
            
        } catch (error) {
            console.error("Error obtaining product by ID:", error);
            return null;
        }
    }

    async updateCart(cartId, products) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate({ _id: cartId }, { products }, { new: true }).populate('products');
            return updatedCart;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw new Error('Internal server error');
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate({ _id: cartId }, { $pull: { products: productId } }, { new: true }).populate('products');
            return updatedCart;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw new Error('Internal server error');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
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
            await CartModel.findByIdAndUpdate({ _id: cartId }, { products: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error('Internal server error');
        }
    }
}

module.exports = CartManager;

// carts.router.js
const { Router } = require('express');
const router = Router();


router.get('/:cid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error getting cart by ID:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        const products = req.body;
        const updatedCart = await cartManager.updateCart(cartId, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        await cartManager.clearCart(cartId);
        res.json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');

        const cartId = req.params.cid;
        const productId = req.params.pid;

        if (!cartId ||!productId) {
            throw new Error('Invalid cart ID or product ID');
        }

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' }); // corrected line
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

module.exports = router;

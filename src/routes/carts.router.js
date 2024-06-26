const { Router } = require('express');
const router = Router();



router.post('/', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
        console.log("New cart created:", newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating new cart'});
    }
});

// Obtener un carrito por su ID

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

// Actualizar un carrito por su ID

router.put('/:cid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        const products = req.body.products;
        const updatedCart = await cartManager.updateCart(cartId, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

//Eliminar carrito por ID

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

//Eliminar producto de carritom por ID
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        const productId = req.params.pid;

        if (!cartId || !productId) {
            throw new Error('Invalid cart ID or product ID');
        }

        const deletedProduct = await cartManager.deleteProductFromCart(cartId, productId); 
        res.json({ status: 'success', payload: deletedProduct });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

// Actualizar cantidad de producto en carrito por ID
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

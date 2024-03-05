const { Router } = require('express');
const router = Router();
const CartManager = require('../CartManager');

const cartManager = new CartManager('./carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id ${cartId} no existe` });
            return;
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = 1;

        const added = await cartManager.addProductToCart(cartId, productId, quantity);
        if (added) {
            res.json({ message: `Producto con ID ${productId} agregado al carrito correctamente` });
        } else {
            res.status(404).json({ error: `El carrito con el id ${cartId} no existe` });
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;

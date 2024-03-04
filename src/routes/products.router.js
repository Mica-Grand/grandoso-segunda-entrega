const { Router } = require('express');
const router = Router();
const ProductManager = require('../ProductManager');

const productManager = new ProductManager('./products.json');

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = productManager.getProducts();

        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({ error: `El producto con el id ${productId} no existe` });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        const newProduct = await productManager.addProduct(title, description, code, price, stock, category, thumbnails);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Todos los campos son obligatorios' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
        const updatedFields = {};
        for (const key in req.body) {
            if (key !== 'id' && allowedFields.includes(key)) {
                updatedFields[key] = req.body[key];
            }
        }
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;

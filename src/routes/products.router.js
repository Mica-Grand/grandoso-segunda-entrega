const { Router } = require('express');
const router = Router();



router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const { limit = 10, page = 1, sort, category, availability } = req.query;
        const productsData = await productManager.getAll({ limit, page, sort, category, availability });

        res.json({
            status: 'success',
            payload: productsData.payload,
            totalPages: productsData.totalPages,
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            page: productsData.page,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage
        });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');

        const product = await productManager.getProductById(req.params.pid);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');

        const { title, description, code, price, stock, category, thumbnails, availability } = req.body;
        const newProduct = await productManager.addProduct(title, description, code, price, stock, category, thumbnails, availability);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        console.error('Error creating new product:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');

        const productId = req.params.pid;
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');

        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        res.json({ status: 'success', message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', error: 'Product not found' });
        }
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    }
});

module.exports = router;

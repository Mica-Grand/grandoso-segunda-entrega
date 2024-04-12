const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const productsData = await productManager.getAll(req.query);
        res.render('products', { productsData });
    } catch (error) {
        console.error('Error while retrieving the list of products: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const product = await productManager.getProductById(req.params.pid);
        res.render('product-details', { product });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

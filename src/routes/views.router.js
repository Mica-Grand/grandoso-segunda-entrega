const { Router } = require('express');
const router = Router();

router.get('/products', async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const productsData = await productManager.getAll(req.query);
        res.render('products', { 
            products: productsData.payload, 
            styles: ['index.css'],
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            page: productsData.page,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage
        }); 
    } catch (error) {
        console.error('Error while retrieving th: e list of products: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const product = await productManager.getProductById(req.params.pid);
        res.render('product-details', { 
            product,
            styles: ['index.css']
         });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (_, res) => {
    try {
        res.json('Hola');
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
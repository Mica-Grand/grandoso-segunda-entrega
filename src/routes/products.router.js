const { Router } = require('express');
const router = Router();
const ProductManager = require('../ProductManager');

const productManager = new ProductManager(`${__dirname}/../../assets/products.json`);

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = productManager.getProducts();

        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        res.json(products);
    } catch (error) {
        console.error('Error while retrieving the list of products: ', error);
        res.status(500).json({ error: 'Server Internal Error' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({ error: `The product with id ${productId} does not exist` });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error('Error while retrieving product:', error);
        res.status(500).json({ error: 'Server Internal Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        const newProduct = await productManager.addProduct(title, description, code, price, stock, category, thumbnails);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error  while creating a new product:', error);
        res.status(500).json({ error: 'All fields are mandatory' });
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
        console.error('Error while updating the product:', error);
        res.status(500).json({ error: 'Server Internal Error' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.json({ message: `The product with ID ${productId} has been succesfully deleted` });
    } catch (error) {
        console.error('Error while deleting the product', error);
        res.status(500).json({ error: 'Server Internal Error' });
    }
});

module.exports = router;

const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./products.json');

//obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.json({ error: `El producto con el id ${productId} no existe `});
            return;
        }

        res.json(product); 
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.json({ error: 'Error interno del servidor' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit; 

        let products = productManager.getProducts(); 

        if (limit) {
            products = products.slice(0, parseInt(limit)); 
        }
            

        res.send(products); 

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const express = require('express');
const viewsRouter = require('./routes/views.router');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const manager = viewsRouter.manager; 

const app = express();
const PORT = 8080;

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});

//servidor WS
const wsServer = new Server(httpServer);
app.set('ws', wsServer)

wsServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado via WebSocket');
    socket.on('addProduct', async (product) => {
        try {
            const { title, description, thumbnails, code, category } = product;
            const price = parseInt(product.price);
            const stock = parseInt(product.stock);
            if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
                return res.status(400).json({ error: 'All fields are required except thumbnails' });
            }

            await ProductManager.addProduct(title, description, price, thumbnails, code, stock, category);
            console.log('Added product:', product);
            wsServer.emit('newProductAdded', product);

        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
})

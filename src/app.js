const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')

const ProductManager = require('./dao/dbManagers/productManager')
const CartManager = require('./dao/dbManagers/cartManager')

const app = express()

const viewsRouter = require('./routes/views.router')
const productsRouter = require('./routes/products.router')
const cartRouter = require('./routes/carts.router')


// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)


const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://el12del8:Ramiro20@codertest.jek84kt.mongodb.net/', {
            dbName: 'ecommerce'
        })

        const productManager = new ProductManager()
        await productManager.prepare()

        const cartManager = new CartManager()
        await cartManager.prepare()

        // Puedes exportar los managers si es necesario
        return { productManager, cartManager }
    } catch (error) {
        console.error('Error connecting to the database:', error)
        throw error
    }
}

const startServer = async () => {
    try {
        const { productManager, cartManager } = await connectToDatabase()

        app.set('productManager', productManager)
        app.set('cartManager', cartManager)

        const PORT = process.env.PORT || 8080
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Error starting the server:', error)
        process.exit(1)
    }
}

startServer()
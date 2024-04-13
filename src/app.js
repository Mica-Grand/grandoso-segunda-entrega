const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const ProductManager = require('./dao/dbManagers/productManager')
const CartManager = require('./dao/dbManagers/cartManager')

const app = express()
// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const viewsRouter = require('./routes/views.router')
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

// Configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/../public`));

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const main = async () => {
        await mongoose.connect('mongodb+srv://el12del8:Ramiro20@codertest.jek84kt.mongodb.net/', {
            dbName: 'ecommerce',
         
        })

        const PORT = process.env.PORT || 8080
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })

        const productManager = new ProductManager()
        await productManager.prepare()
        app.set('productManager', productManager)


        const cartManager = new CartManager()
        await cartManager.prepare()
        app.set('cartManager', cartManager)
    }

    main()
   


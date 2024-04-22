const { Router } = require('express');
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware' );

const router = Router();

router.get('/products', userIsLoggedIn, async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const productsData = await productManager.getAll(req.query);
        if (isNaN(productsData.page) || productsData.page < 1 || productsData.page > productsData.totalPages) {
            return res.render('error', { errorMessage: 'Invalid page number' });
        }

        res.render('products', {
            products: productsData.payload,
            styles: ['styles.css'],
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            page: productsData.page,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            user: req.session.user,
            isLoggedIn: true
        });

    } catch (error) {
        console.error('Error while retrieving the list of products: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/products/:pid', userIsLoggedIn, async (req, res) => {
    try {
        const productManager = req.app.get("productManager");
        const product = await productManager.getProductById(req.params.pid);
        res.render('product-details', { 
            product,
            styles: ['styles.css']
         });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/carts/:cid', userIsLoggedIn, async (req, res) => {
    try {
        const cartManager = req.app.get("cartManager");
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', { 
            cart,
            styles: ['styles.css']
         });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', (req, res) => {
    if (req.session.user) {
        // Si hay una sesión activa, redirige a la página de productos
        res.redirect('/products');
    } else {
        //no hay sesión activa, renderiza la página de login
        res.redirect( '/login');
    }
})

router.get('/login', userIsNotLoggedIn, (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    res.render('login', {
        title: 'Login',
        isLoggedIn
    });
});

router.get('/register', userIsNotLoggedIn, (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    res.render('register', {
        title: 'Register',
        isLoggedIn
    });
});

router.get('/profile', userIsLoggedIn, async (req, res) => {
    try {
        const user = req.session.user; 
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.render('profile', {
            title: 'My profile',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email,
                role: user.email === "adminCoder@coder.com" ? "admin" : "usuario"
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

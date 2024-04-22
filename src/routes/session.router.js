const { Router } = require('express')
const User = require('../dao/models/user.model')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware' );
const { hashPassword, isValidPassword } = require('../utils/hashing')

const router = Router()

router.post('/login', userIsNotLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid credentials!' })
    }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found!' })
        }
    
        if (!isValidPassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid password!' })
        }

        req.session.user = {
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          _id: user._id.toString(),
          role: user.email === "adminCoder@coder.com" ? "admin" : "user",
        };

        console.log(req.session.user);

        res.redirect('/products');

    } catch (error) {
        console.error('Error while logging in: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', userIsNotLoggedIn, async (req, res) => {

    try {
        const { firstName, lastName, email, age, password } = req.body

       const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password: hashPassword(password)
            

        })
        req.session.user = { 
            email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id.toString(),
            role: user.email === "adminCoder@coder.com" ? "admin" : "user",
            age: user.age
        };

        console.log(req.session.user);

        res.redirect('/')
    }
    catch (err) {
        console.log(err)
        res.status(400).send('Error creating user!')
    }
})

router.get('/logout', userIsLoggedIn, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});



module.exports = router
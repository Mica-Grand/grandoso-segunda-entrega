const MongoStore = require('connect-mongo');
const session = require('express-session');
const defaultOptions = require('./defaultOptions');

const storage = MongoStore.create({
    dbName: 'ecommerce',
    mongoUrl: 'mongodb+srv://el12del8:Ramiro20@codertest.jek84kt.mongodb.net/',
    ttl: 900,
});

module.exports = session({
    store: storage,
    ...defaultOptions
});
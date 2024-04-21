const ProductModel = require('../models/product.model');


class ProductManager {
    constructor() {}

    async prepare() {
      
        if (ProductModel.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }


    async getAll(queryParams) {
        try {
            let { page = 1, limit = 10, sort, category, availability } = queryParams;

        const options = {
            sort: sort ? { price: sort } : undefined,
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };
            const queryObject = {};

        if (category) {
            queryObject.category = { $regex: new RegExp(category, 'i') };        }

        if (availability !== undefined) {
            queryObject.availability = availability === 'true'; 
        }

            const products = await ProductModel.paginate(queryObject, options);

            return {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage
            };
        } catch (error) {
            console.error('Error getting products:', error);
            throw new Error('Internal server error');
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id).lean();
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            console.error('Error getting product by ID:', error);
            throw new Error('Internal server error');
        }
    }

    async addProduct(title, description, code, price, stock, category, thumbnails) {
        try {
            const newProduct = new ProductModel({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            });
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error creating new product:', error);
            throw new Error('Internal server error');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Internal server error');
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Internal server error');
        }
    }
}

module.exports = ProductManager;
const Products = require('../models/product.model');

class ProductManager {
    constructor() {}

    async prepare() {
      
        if (Products.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }


    async getAll(queryParams) {
        try {
            let { limit = 10, page = 1, sort, category, availability } = queryParams;
    
            limit = parseInt(limit);
            page = parseInt(page);
    
            const skip = (page - 1) * limit;
    
            let queryOptions = {};
    
            if (category) {
                queryOptions.category = category;
            }
    
            if (availability) {
                queryOptions.status = availability === 'available' ? true : false;
            }
    
            let productsQuery = Product.find(queryOptions);
    
            if (sort) {
                let sortOption = {};
                switch (sort) {
                    case 'asc':
                        sortOption = { price: 1 };
                        break;
                    case 'desc':
                        sortOption = { price: -1 };
                        break;
                    default:
                        break;
                }
                productsQuery = productsQuery.sort(sortOption);
            }
    
            const totalProducts = await Product.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
    
            const products = await productsQuery.skip(skip).limit(limit);
    
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = page - 1;
            const nextPage = page + 1;
            const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;
    
            return {
                status: 'success',
                products,
                totalPages,
                currentPage: page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                prevLink,
                nextLink
            };
        } catch (error) {
            console.error('Error getting products:', error);
            throw new Error('Internal server error');
        }
    }
    
    

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
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
            const newProduct = new Product({
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
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
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
            const deletedProduct = await Product.findByIdAndDelete(id);
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

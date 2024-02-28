
const fs = require('fs').promises;

class ProductManager {
  #products;
  static #lastId = 0;
  filePath;

  constructor(filePath) {
      this.filePath = filePath;
      this.#products = [];
      this.loadProductsFromFile();
  }

  async saveProductsToFile() {
      try {
          const data = JSON.stringify(this.#products, null, 2);
          await fs.writeFile(this.filePath, data);
      } catch (error) {
          console.error('Error saving products to file:', error);
      }
  }

  async loadProductsFromFile() {
      try {
          const data = await fs.readFile(this.filePath, 'utf8');
          this.#products = JSON.parse(data);
      } catch (error) {
          if (error.code === 'ENOENT') {
              await this.saveProductsToFile();
              console.log('El archivo products.json ha sido creado.');
              return;
          }
          console.error('Error loading products from file:', error);
      }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
          console.error("All the fields are mandatory");
          return;
      }

      const newProduct = {
          id: ++ProductManager.#lastId,
          title,
          description,
          price,
          thumbnail,
          code,
          stock
      };

      this.#products.push(newProduct);

      await this.saveProductsToFile();
  }

  getProducts() {
      this.loadProductsFromFile();
      return this.#products;
  }

  async getProductById(id) {
      await this.loadProductsFromFile();
      const product = this.#products.find(product => product.id === id);
      if (!product) {
          console.error("Product not found. Invalid id");
          return;
      }
      return product;
  }

  async updateProduct(id, updatedFields) {
      try {
          await this.loadProductsFromFile();
          const productIndex = this.#products.findIndex(product => product.id === id);
          if (productIndex === -1) {
              console.error("Product not found.");
              return;
          }

          this.#products[productIndex] = { ...this.#products[productIndex], ...updatedFields };

          await this.saveProductsToFile();
      } catch (error) {
          console.error('Error updating product:', error);
      }
  }

  async deleteProduct(id) {
      await this.loadProductsFromFile();
      const productIndex = this.#products.findIndex(product => product.id === id);

      if (productIndex !== -1) {
          this.#products.splice(productIndex, 1);
          await this.saveProductsToFile();
          console.log(`Product with ID ${id} deleted successfully.`);
      } else {
          console.error(`Product with ID ${id} not found.`);
      }
  }
}

// Testing
const main = async () => {
  const productManager = new ProductManager('./products.json');


  const productsToAdd = [
    { name: "remera", description: "Este es un producto prueba", price: 200, image: "Sin imagen", code: "abc123", quantity: 25 },
    { name: "pantalon", description: "Este es otro un producto prueba", price: 400, image: "Otra sin imagen", code: "def456", quantity: 18 },
    { name: "gorra", description: "Este es otro un producto prueba", price: 600, image: "Otra sin imagen", code: "ghi789", quantity: 15 },
    { name: "campera", description: "Este es otro un producto prueba", price: 800, image: "Otra sin imagen", code: "jkl123", quantity: 10 },
    { name: "medias", description: "Este es otro un producto prueba", price: 50, image: "Otra sin imagen", code: "mno456", quantity: 30 },
    { name: "bufanda", description: "Este es otro un producto prueba", price: 100, image: "Otra sin imagen", code: "pqr789", quantity: 20 },
    { name: "sombrero", description: "Este es otro un producto prueba", price: 120, image: "Otra sin imagen", code: "stu012", quantity: 22 },
    { name: "guantes", description: "Este es otro un producto prueba", price: 80, image: "Otra sin imagen", code: "vwx345", quantity: 28 },
    { name: "musculosa", description: "Este es otro un producto prueba", price: 700, image: "Otra sin imagen", code: "yzab67", quantity: 12 },
    { name: "lentes", description: "Este es otro un producto prueba", price: 150, image: "Otra sin imagen", code: "cdef89", quantity: 15 }
];

for (const product of productsToAdd) {
    await productManager.addProduct(
        product.name,
        product.description,
        product.price,
        product.image,
        product.code,
        product.quantity
    );
}
console.log("Todos los productos: ", productManager.getProducts())
 

   console.log("Resultado de buscar producto por ID:", await productManager.getProductById(1));

  console.log("Resultado de buscar producto por ID invalido:", await productManager.getProductById(3));

  await productManager.updateProduct(1, {
      title: 'nuevo titulo',
      price: 899
  });

  console.log("Verificar si el producto se actualizó correctamente: ", await productManager.getProductById(1));

  await productManager.deleteProduct(1);

  console.log("Productos después de eliminar un producto:", productManager.getProducts());  

}






module.exports = ProductManager;

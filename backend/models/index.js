import Sequelize from 'sequelize';
import Carts from './cart.model.js';
import CartItems from './cart-item.model.js';
import Categories from './categories.model.js';
import Credentials from './credential.model.js';
import Orders from './order.model.js';
import OrderLines from './order-line.model.js';
import Products from './product.model.js';
import Reviews from './review.model.js';
import Users from './user.model.js';

const sequelize = new Sequelize('ecommerce', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const db = {
  Sequelize,
  sequelize,
  Carts: Carts(sequelize, Sequelize),
  CartItems: CartItems(sequelize, Sequelize),
  Categories: Categories(sequelize, Sequelize),
  Credentials: Credentials(sequelize, Sequelize),
  Orders: Orders(sequelize, Sequelize),
  OrderLines: OrderLines(sequelize, Sequelize),
  Products: Products(sequelize, Sequelize),
  Reviews: Reviews(sequelize, Sequelize),
  Users: Users(sequelize, Sequelize),
};

// Define relationships
db.Carts.belongsTo(db.Users, { foreignKey: 'created_by' });
db.CartItems.belongsTo(db.Carts, { foreignKey: 'cart_id' });
db.CartItems.belongsTo(db.Products, { foreignKey: 'product_id' });
db.Categories.belongsTo(db.Categories, { foreignKey: 'parent_category', as: 'parent' });
db.Credentials.belongsTo(db.Users, { foreignKey: 'user_id' });
db.Orders.belongsTo(db.Users, { foreignKey: 'user_id' });
db.OrderLines.belongsTo(db.Orders, { foreignKey: 'order_id' });
db.OrderLines.belongsTo(db.Products, { foreignKey: 'product_id' });
db.Products.belongsTo(db.Categories, { foreignKey: 'category_id' });
db.Reviews.belongsTo(db.Products, { foreignKey: 'product_id' });
db.Reviews.belongsTo(db.Users, { foreignKey: 'user_id' });

export default db;

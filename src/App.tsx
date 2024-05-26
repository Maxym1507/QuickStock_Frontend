import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import CreateCategory from './components/CreateCategory';
import CreateProduct from './components/CreateProduct';
import CreateOrder from './components/CreateOrder';
import './App.css'

function App() {
    return (
        <Router>
            <div className="container">
                <header className="header">
                    Warehouse Order Collection System
                </header>
                <nav>
                    <ul>
                        <li><a href="/categories">Categories</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/orders">Orders</a></li>
                        <li><a href="/create-category">Create Category</a></li>
                        <li><a href="/create-product">Create Product</a></li>
                        <li><a href="/create-order">Create Order</a></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/create-category" element={<CreateCategory />} />
                    <Route path="/create-product" element={<CreateProduct />} />
                    <Route path="/create-order" element={<CreateOrder />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './ProductList.css';

interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get<Product[]>(`${config.API_BASE_URL}/api/products`)
            .then((response) => setProducts(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.productId}>
                        {product.name} - {product.description} - ${product.price} - Quantity: {product.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;

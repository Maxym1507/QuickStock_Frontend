import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateOrder.css';

const CreateOrder: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<any[]>([]);
    const [orderDate, setOrderDate] = useState('');
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/api/products`)
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleAddProduct = () => {
        setOrderDetails([...orderDetails, { productId: '', quantity: 1 }]);
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        const newOrderDetails = [...orderDetails];
        newOrderDetails[index][field] = value;
        setOrderDetails(newOrderDetails);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newOrder = { orderDate, status, orderDetails: JSON.stringify(orderDetails) };
        try {
            await axios.post(`${config.API_BASE_URL}/api/orders`, newOrder);
            setStatus('Completed'); // Зміна статусу після успішного створення замовлення
            alert('Order created successfully!');
        } catch (error) {
            setStatus('Error'); // Зміна статусу при виникненні помилки
            console.error(error);
            alert('Failed to create order.');
        }
    };

    return (
        <div>
            <h1>Create Order</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Order Date:
                    <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
                </label>
                <br />
                {orderDetails.map((detail, index) => (
                    <div key={index}>
                        <label>
                            Product:
                            <select value={detail.productId} onChange={(e) => handleProductChange(index, 'productId', e.target.value)} required>
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.productId} value={product.productId}>{product.name}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>
                            Quantity:
                            <input type="number" value={detail.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} required />
                        </label>
                    </div>
                ))}
                <br />
                <button type="button" onClick={handleAddProduct}>Add Product</button>
                <br />
                <button type="submit">Create Order</button>
            </form>
            <p>Status: {status}</p>
        </div>
    );
};

export default CreateOrder;

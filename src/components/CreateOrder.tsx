import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateOrder.css';

const CreateOrder: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<any[]>([{ productId: '', quantity: 1 }]);
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/api/products`)
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [orderDetails]);

    const calculateTotal = () => {
        let total = 0;
        orderDetails.forEach(detail => {
            const product = products.find(product => product.productId == detail.productId);
            if (product) {
                total += product.price * detail.quantity;
            }
        });
        setTotalAmount(total);
    };

    const handleAddProduct = () => {
        setOrderDetails([...orderDetails, { productId: '', quantity: 1 }]);
    };

    const handleRemoveProduct = (index: number) => {
        const newOrderDetails = [...orderDetails];
        newOrderDetails.splice(index, 1);
        setOrderDetails(newOrderDetails);
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        const newOrderDetails = [...orderDetails];
        newOrderDetails[index][field] = value;
        setOrderDetails(newOrderDetails);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (orderDetails.length === 0) {
            alert('Cannot create an order with no products.');
            return;
        }
        const newOrder = { orderDate, status: 'Pending', orderDetails: JSON.stringify(orderDetails) };
        try {
            await axios.post(`${config.API_BASE_URL}/api/orders`, newOrder);
            alert('Order created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create order.');
        }
    };

    return (
        <div className="create-order">
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
                                    <option key={product.productId} value={product.productId}>{product.name} - ${product.price}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>
                            Quantity:
                            <input type="number" value={detail.quantity} onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} required />
                        </label>
                        <button type="button" className="remove-product-button" onClick={() => handleRemoveProduct(index)}>Remove</button>
                    </div>
                ))}
                <br />
                <button type="button" className="add-product-button" onClick={handleAddProduct}>Add Product</button>
                <br />
                <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
                <br />
                <button type="submit">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;

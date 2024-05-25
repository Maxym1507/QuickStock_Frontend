import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './OrderList.css';

interface OrderDetail {
    productId: number;
    quantity: number;
}

interface Order {
    orderId: number;
    orderDate: string;
    status: string;
    orderDetails: string; // JSON-encoded string
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        axios.get<Order[]>(`${config.API_BASE_URL}/api/orders`)
            .then((response) => setOrders(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.orderId}>
                        Order Date: {order.orderDate} - Status: {order.status}
                        <ul>
                            {JSON.parse(order.orderDetails).map((detail: OrderDetail) => (
                                <li key={detail.productId}>
                                    Product ID: {detail.productId}, Quantity: {detail.quantity}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;

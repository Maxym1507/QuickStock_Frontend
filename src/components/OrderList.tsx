import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './OrderList.css';

interface Product {
    productId: number;
    name: string;
    code: string;
    quantity: number;
}

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
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [listening, setListening] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/orders`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOrder = async (id: number) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/api/orders/${id}`);
            fetchOrders();
        } catch (error) {
            console.error('Failed to delete order', error);
            alert('Failed to delete order.');
        }
    };

    const handleCancelOrder = async (order: Order) => {
        try {
            order.status = "Cancelled";
            await axios.put(`${config.API_BASE_URL}/api/orders/${order.orderId}`, order);
            fetchOrders();
            alert('Order cancelled successfully!');
        } catch (error) {
            console.error('Failed to cancel order', error);
            alert('Failed to cancel order.');
        }
    };

    const handleCompleteOrder = async (order: Order) => {
        try {
            const orderDetails = JSON.parse(order.orderDetails);
            for (const detail of orderDetails) {
                const product = products.find(p => p.productId == detail.productId);
                if (product && product.quantity >= detail.quantity) {
                    product.quantity -= detail.quantity;
                    await axios.put(`${config.API_BASE_URL}/api/products/${product.productId}`, product);
                } else {
                    alert('Insufficient quantity for product: ' + getProductNameById(detail.productId));
                    return;
                }
            }
            order.status = "Completed";
            await axios.put(`${config.API_BASE_URL}/api/orders/${order.orderId}`, order);
            fetchOrders();
            alert('Order completed successfully!');
        } catch (error) {
            console.error('Failed to complete order', error);
            alert('Failed to complete order.');
        }
    };

    const canCompleteOrder = (order: Order) => {
        const orderDetails = JSON.parse(order.orderDetails);
        return orderDetails.every((detail: OrderDetail) => {
            const product = products.find(p => p.productId == detail.productId);
            return product && product.quantity >= detail.quantity;
        });
    };

    const getProductNameById = (id: number) => {
        const product = products.find(product => product.productId == id);
        return product ? product.name : 'Unknown Product';
    };

    const getProductCodeById = (id: number) => {
        const product = products.find(product => product.productId == id);
        return product ? product.code : 'Unknown Code';
    };

    const startListening = () => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.trim();
            handleVoiceCommand(transcript);
            setListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    const handleVoiceCommand = (command: string) => {
        const lowerCaseCommand = command.toLowerCase();
        console.error('INFO: ', lowerCaseCommand);
        if (lowerCaseCommand.includes('cancel order')) {
            const orderId = parseInt(lowerCaseCommand.split('cancel order ')[1]);
            const order = orders.find(o => o.orderId === orderId);
            if (order) handleCancelOrder(order);
        } else if (lowerCaseCommand.includes('complete order')) {
            const orderId = parseInt(lowerCaseCommand.split('complete order ')[1]);
            const order = orders.find(o => o.orderId === orderId);
            if (order && canCompleteOrder(order)) handleCompleteOrder(order);
        } else if (lowerCaseCommand.includes('delete order')) {
            const orderId = parseInt(lowerCaseCommand.split('delete order ')[1]);
            const order = orders.find(o => o.orderId === orderId);
            if (order) handleDeleteOrder(orderId);
        }
    };

    return (
        <div className="order-list">
            <h1>Orders</h1>
            <button onClick={startListening} disabled={listening} className="voice-command-button">
                {listening ? 'Listening...' : 'Voice Command'}
            </button>
            <ul>
                {orders.map(order => (
                    <li key={order.orderId}>
                        <div className="order-item">
                            <span>Order {order.orderId} - {order.status}</span>
                            <div className="order-buttons">
                                <button className="view-button" onClick={() => handleViewOrder(order)}>View</button>
                                <button className="delete-button" onClick={() => handleDeleteOrder(order.orderId)}>Delete</button>
                                {order.status === 'Pending' && (
                                    <>
                                        <button className="cancel-button" onClick={() => handleCancelOrder(order)}>Cancel</button>
                                        {canCompleteOrder(order)
                                            && (
                                                <button className="complete-button" onClick={() => handleCompleteOrder(order)}>Complete</button>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {modalOpen && selectedOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Order {selectedOrder.orderId}</h2>
                        <p>Status: {selectedOrder.status}</p>
                        <p>Order Date: {selectedOrder.orderDate}</p>
                        <h3>Order Details</h3>
                        <ul>
                            {JSON.parse(selectedOrder.orderDetails).map((detail: OrderDetail, index: number) => (
                                <li key={index}>
                                    {getProductCodeById(detail.productId)} - {getProductNameById(detail.productId)} - {detail.quantity}
                                </li>
                            ))}
                        </ul>
                        {selectedOrder.status === 'Pending' && (
                            <div className="modal-buttons">
                                <button className="cancel-button" onClick={() => handleCancelOrder(selectedOrder)}>Cancel</button>
                                {canCompleteOrder(selectedOrder) && (
                                    <button className="complete-button" onClick={() => handleCompleteOrder(selectedOrder)}>Complete</button>
                                )}
                            </div>
                        )}
                        <button className="close-button" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
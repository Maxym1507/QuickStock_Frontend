import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './ProductList.css';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [quantityToAdd, setQuantityToAdd] = useState<{ [key: number]: number }>({});
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/api/products/${id}`);
            setProducts(products.filter(product => product.productId !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product.');
        }
    };

    const handleAddQuantity = async (id: number) => {
        const product = products.find(product => product.productId === id);
        if (!product) return;

        const newQuantity = product.quantity + (quantityToAdd[id] || 0);

        try {
            await axios.put(`${config.API_BASE_URL}/api/products/${id}`, {
                ...product,
                quantity: newQuantity
            });
            fetchProducts();
            alert('Quantity added successfully!');
        } catch (error) {
            console.error('Failed to add quantity', error);
            alert('Failed to add quantity.');
        }
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleSaveProduct = async () => {
        try {
            await axios.put(`${config.API_BASE_URL}/api/products/${selectedProduct.productId}`, selectedProduct);
            setModalOpen(false);
            fetchProducts();
            alert('Product updated successfully!');
        } catch (error) {
            console.error('Failed to update product', error);
            alert('Failed to update product.');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setSelectedProduct({ ...selectedProduct, [field]: value });
    };

    return (
        <div className="product-list">
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.productId}>
                        <span>{product.name} - Quantity: {product.quantity}</span>
                        <div className="product-buttons">
                            <input
                                type="number"
                                value={quantityToAdd[product.productId] || 0}
                                onChange={(e) => setQuantityToAdd({
                                    ...quantityToAdd,
                                    [product.productId]: parseInt(e.target.value)
                                })}
                                min="0"
                            />
                            <button className="add-quantity-button" onClick={() => handleAddQuantity(product.productId)}>Add Quantity</button>
                            <button className="edit-button" onClick={() => handleEditProduct(product)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(product.productId)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {modalOpen && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Product</h2>
                        <label>
                            Name:
                            <input type="text" value={selectedProduct.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                        </label>
                        <br />
                        <label>
                            Code:
                            <input type="text" value={selectedProduct.code} onChange={(e) => handleInputChange('code', e.target.value)} required />
                        </label>
                        <br />
                        <label>
                            Description:
                            <input type="text" value={selectedProduct.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                        </label>
                        <br />

                        <label>
                            Price:
                            <input type="number" step="0.01" value={selectedProduct.price} onChange={(e) => handleInputChange('price', e.target.value)} required />
                        </label>
                        <br />
                        <label>
                            Quantity:
                            <input type="number" value={selectedProduct.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} required />
                        </label>
                        <br />
                        <button className="save-button" onClick={handleSaveProduct}>Save</button>
                        <button className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;

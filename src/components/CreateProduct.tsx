import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateProduct.css';

const CreateProduct: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [attributes, setAttributes] = useState('');

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/api/categories`)
            .then(response => setCategories(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newProduct = { code, name, description, photoUrl, categoryId, price, quantity, attributes };
        try {
            await axios.post(`${config.API_BASE_URL}/api/products`, newProduct);
            alert('Product created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create product.');
        }
    };

    return (
        <div>
            <h1>Create Product</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Code:
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                </label>
                <br />
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <br />
                <label>
                    Photo URL:
                    <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                </label>
                <br />
                <label>
                    Category:
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </label>
                <br />
                <label>
                    Quantity:
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </label>
                <br />
                <label>
                    Attributes (JSON format):
                    <textarea value={attributes} onChange={(e) => setAttributes(e.target.value)} />
                </label>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateProduct;

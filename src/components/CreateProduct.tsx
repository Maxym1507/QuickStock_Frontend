import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateProduct.css';

const CreateProduct: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryAttributes, setCategoryAttributes] = useState<any[]>([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [attributes, setAttributes] = useState<any>({});

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/api/categories`)
            .then(response => setCategories(response.data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (categoryId) {
            const selectedCategory = categories.find(category => category.categoryId == categoryId);
            if (selectedCategory) {
                setCategoryAttributes(JSON.parse(selectedCategory.attributes));
            } else {
                setCategoryAttributes([]);
            }
        }
    }, [categoryId, categories]);

    const handleAttributeChange = (name: string, value: any) => {
        setAttributes({ ...attributes, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newProduct = {
            code,
            name,
            description,
            photoUrl: "",
            categoryId: parseInt(categoryId),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            attributes: JSON.stringify(attributes)
        };
        try {
            await axios.post(`${config.API_BASE_URL}/api/products`, newProduct);
            alert('Product created successfully!');
            // Reset the form fields
            setCode('');
            setName('');
            setDescription('');
            setPhotoUrl('');
            setCategoryId('');
            setPrice('');
            setQuantity('');
            setAttributes('');
        } catch (error) {
            console.error(error);
            alert('Failed to create product.');
        }
    };

    return (
        <div className="create-product">
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
                    Category:
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <br />
                {categoryAttributes.map((attribute, index) => (
                    <div key={index}>
                        <label>
                            {attribute.name}:
                            {attribute.type === 'string' && (
                                <input type="text" onChange={(e) => handleAttributeChange(attribute.name, e.target.value)} required />
                            )}
                            {attribute.type === 'number' && (
                                <input type="number" onChange={(e) => handleAttributeChange(attribute.name, e.target.value)} required />
                            )}
                            {attribute.type === 'boolean' && (
                                <select onChange={(e) => handleAttributeChange(attribute.name, e.target.value === 'true')} required>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            )}
                        </label>
                    </div>
                ))}
                <br />
                <label>
                    Price:
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </label>
                <br />
                <label>
                    Quantity:
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateProduct;

import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateCategory.css';

const CreateCategory: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newCategory = { name, description, attributes };
        try {
            await axios.post(`${config.API_BASE_URL}/api/categories`, newCategory);
            alert('Category created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create category.');
        }
    };

    return (
        <div>
            <h1>Create Category</h1>
            <form onSubmit={handleSubmit}>
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
                    Attributes (JSON format):
                    <textarea value={attributes} onChange={(e) => setAttributes(e.target.value)} />
                </label>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateCategory;

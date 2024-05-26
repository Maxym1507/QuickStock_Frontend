import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateCategory.css';

const CreateCategory: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState<{ name: string, type: string }[]>([]);

    const handleAddAttribute = () => {
        setAttributes([...attributes, { name: '', type: 'string' }]);
    };

    const handleAttributeChange = (index: number, field: string, value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index] = { ...newAttributes[index], [field]: value };
        setAttributes(newAttributes);
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newCategory = {
            name,
            description,
            attributes: JSON.stringify(attributes),
        };
        try {
            await axios.post(`${config.API_BASE_URL}/api/categories`, newCategory);
            alert('Category created successfully!');
            setName('');
            setDescription('');
            setAttributes([]);
        } catch (error) {
            console.error('Failed to create category', error);
            alert('Failed to create category.');
        }
    };

    return (
        <div className="create-category">
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
                <h3>Attributes</h3>
                {attributes.map((attr, index) => (
                    <div key={index} className="attribute">
                        <label>
                            Attribute Name:
                            <input
                                type="text"
                                value={attr.name}
                                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Attribute Type:
                            <select
                                value={attr.type}
                                onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                                required
                            >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                            </select>
                        </label>
                        <button type="button" className="remove-attribute-button" onClick={() => handleRemoveAttribute(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" className="add-attribute-button" onClick={handleAddAttribute}>Add Attribute</button>
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateCategory;

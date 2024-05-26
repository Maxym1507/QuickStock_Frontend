import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './EditCategory.css';

interface Attribute {
    name: string;
    type: string;
}

interface EditCategoryProps {
    categoryId: number;
    onClose: () => void;
    onSave: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ categoryId, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/api/categories/${categoryId}`)
            .then(response => {
                const category = response.data;
                setName(category.name);
                setDescription(category.description);
                setAttributes(category.attributes ? JSON.parse(category.attributes) : []);
            })
            .catch(error => console.error('Failed to fetch category', error));
    }, [categoryId]);

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
        try {
            const updatedCategory = {
                categoryId,
                name,
                description,
                attributes: JSON.stringify(attributes),
            };
            await axios.put(`${config.API_BASE_URL}/api/categories/${categoryId}`, updatedCategory);
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to update category', error);
            alert('Failed to update category.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Category</h2>
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
                            <button type="button" onClick={() => handleRemoveAttribute(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAttribute}>Add Attribute</button>
                    <br />
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;

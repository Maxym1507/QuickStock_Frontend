import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import EditCategory from './EditCategory';
import './CategoryList.css';

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await axios.delete(`${config.API_BASE_URL}/api/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            alert('Failed to delete category.');
        }
    };

    const handleEditCategory = (id: number) => {
        setEditingCategoryId(id);
    };

    const handleCloseModal = () => {
        setEditingCategoryId(null);
    };

    const handleSave = () => {
        fetchCategories();
    };

    return (
        <div className="category-list">
            <h1>Categories</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.categoryId} className="category-item">
                        <span>{category.name} - {category.description}</span>
                        <div className="category-buttons">
                            <button className="edit-button" onClick={() => handleEditCategory(category.categoryId)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDeleteCategory(category.categoryId)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            {editingCategoryId !== null && (
                <EditCategory
                    categoryId={editingCategoryId}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default CategoryList;

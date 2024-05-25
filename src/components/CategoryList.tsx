import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CategoryList.css';

interface Category {
    categoryId: number;
    name: string;
    description: string;
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get<Category[]>(`${config.API_BASE_URL}/api/categories`)
            .then((response) => setCategories(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Categories</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.categoryId}>
                        {category.name} - {category.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;

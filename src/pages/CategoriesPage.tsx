import React, { useState, useEffect } from 'react';
import './CategoriesPage.css';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="categories-page"><p>Loading categories...</p></div>;

  return (
    <div className="categories-page">
      <h2>Browse by Category</h2>
      <div className="categories-grid">
        {categories.map((category: any) => (
          <a key={category.id} href={`/categories/${category.slug}`} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.bookCount} books</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;

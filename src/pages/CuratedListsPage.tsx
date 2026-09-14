import React, { useState, useEffect } from 'react';
import './CuratedListsPage.css';

function CuratedListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch('/api/curated-lists');
        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching curated lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  if (loading) return <div className="curated-lists-page"><p>Loading curated lists...</p></div>;

  return (
    <div className="curated-lists-page">
      <h2>Curated Lists</h2>
      <p className="subtitle">Handpicked collections of special book editions</p>
      <div className="lists-grid">
        {lists.map((list: any) => (
          <a key={list.id} href={`/curated-lists/${list.slug}`} className="list-card">
            <h3>{list.title}</h3>
            <p>{list.description}</p>
            <span className="book-count">{list.bookCount} books</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default CuratedListsPage;

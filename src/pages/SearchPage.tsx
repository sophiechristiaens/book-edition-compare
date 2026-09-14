import React, { useState } from 'react';
import './SearchPage.css';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'isbn'>('title');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/books/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <h2>Find Books & Compare Editions</h2>
        <p>Discover special editions across your favorite retailers</p>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-group">
          <input
            type="text"
            placeholder={
              searchType === 'title'
                ? 'Search by book title...'
                : 'Search by ISBN...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>

        <div className="search-options">
          <label>
            <input
              type="radio"
              value="title"
              checked={searchType === 'title'}
              onChange={(e) => setSearchType(e.target.value as 'title')}
            />
            By Title
          </label>
          <label>
            <input
              type="radio"
              value="isbn"
              checked={searchType === 'isbn'}
              onChange={(e) => setSearchType(e.target.value as 'isbn')}
            />
            By ISBN
          </label>
        </div>
      </form>

      <div className="search-results">
        {loading && <p className="loading">Searching...</p>}
        {results.length === 0 && !loading && searchQuery && (
          <p className="no-results">No books found. Try a different search.</p>
        )}
        {results.map((book: any) => (
          <div key={book.id} className="book-card">
            {book.coverArt && <img src={book.coverArt} alt={book.title} />}
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <a href={`/compare/${book.id}`} className="compare-btn">
              Compare Editions
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;

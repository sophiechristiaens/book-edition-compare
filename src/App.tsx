import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import ComparisonPage from './pages/ComparisonPage';
import CategoriesPage from './pages/CategoriesPage';
import CuratedListsPage from './pages/CuratedListsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/compare/:bookId" element={<ComparisonPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/curated-lists" element={<CuratedListsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ComparisonPage.css';

interface Edition {
  id: string;
  title: string;
  retailer: string;
  price: number;
  isbn: string;
  coverArt: string;
  hasSprayedEdges: boolean;
  hasDustJacket: boolean;
  isNakedBook: boolean;
  illustrations: string;
  introductions: string;
  specialFeatures: string[];
  availability: string;
}

function ComparisonPage() {
  const { bookId } = useParams();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}/editions`);
        const data = await response.json();
        setEditions(data);
      } catch (error) {
        console.error('Error fetching editions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, [bookId]);

  if (loading) return <div className="comparison-page"><p>Loading editions...</p></div>;
  if (editions.length === 0)
    return <div className="comparison-page"><p>No editions found</p></div>;

  const features = [
    { key: 'retailer', label: 'Retailer' },
    { key: 'price', label: 'Price' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'hasSprayedEdges', label: 'Sprayed Edges' },
    { key: 'hasDustJacket', label: 'Dust Jacket' },
    { key: 'isNakedBook', label: 'Naked Book' },
    { key: 'illustrations', label: 'Illustrations' },
    { key: 'introductions', label: 'Introductions' },
    { key: 'specialFeatures', label: 'Special Features' },
    { key: 'availability', label: 'Availability' },
  ];

  return (
    <div className="comparison-page">
      <h2>Compare Editions</h2>
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              {editions.map((edition) => (
                <th key={edition.id}>
                  {edition.title}
                  <span className="retailer-badge">{edition.retailer}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.key}>
                <td className="feature-name">{feature.label}</td>
                {editions.map((edition) => (
                  <td key={edition.id} className="feature-value">
                    {renderFeatureValue(edition, feature.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderFeatureValue(edition: Edition, feature: string): React.ReactNode {
  switch (feature) {
    case 'price':
      return `$${edition.price.toFixed(2)}`;
    case 'hasSprayedEdges':
    case 'hasDustJacket':
    case 'isNakedBook':
      return edition[feature as keyof Edition] ? '✓' : '✗';
    case 'specialFeatures':
      return (edition.specialFeatures || []).join(', ') || '-';
    case 'coverArt':
      return (
        <img
          src={edition.coverArt}
          alt={edition.title}
          className="edition-cover"
        />
      );
    default:
      return edition[feature as keyof Edition] || '-';
  }
}

export default ComparisonPage;

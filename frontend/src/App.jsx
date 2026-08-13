import { useEffect, useMemo, useState } from 'react';
import CategoryDropdown from './components/CategoryDropdown';
import { fetchCategories } from './services/categoryService';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (loadError) {
        setError('Unable to load categories right now.');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  return (
    <main style={{ minHeight: '100vh', background: '#f5f7ff', padding: '3rem 1.5rem' }}>
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '1rem',
          border: '1px solid #e7edf7',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
          padding: '2rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, color: '#52607a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Finance setup
          </p>
          <h1 style={{ margin: '0.4rem 0 0', fontSize: '2rem', color: '#111827' }}>Categories</h1>
        </div>

        {loading ? (
          <p style={{ color: '#52607a' }}>Loading categories...</p>
        ) : error ? (
          <p role="alert" style={{ color: '#b91c1c', fontWeight: 600 }}>
            {error}
          </p>
        ) : (
          <>
            <CategoryDropdown
              label="Entry category"
              categories={categories}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />

            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>Available categories</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {categories.map((category) => (
                  <span
                    key={category.id || category.name}
                    style={{
                      borderRadius: '999px',
                      padding: '0.45rem 0.8rem',
                      background: selectedCategoryId === category.id ? '#e0e7ff' : '#eef2ff',
                      color: '#1e3a8a',
                      fontWeight: 600,
                    }}
                  >
                    {category.icon ? `${category.icon} ` : ''}
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div
                style={{
                  marginTop: '1.5rem',
                  borderRadius: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '1rem',
                }}
              >
                <p style={{ margin: 0, color: '#64748b' }}>Selected</p>
                <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedCategory.icon ? `${selectedCategory.icon} ` : ''}
                  {selectedCategory.name}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

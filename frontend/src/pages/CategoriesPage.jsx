import { useCallback, useEffect, useState } from 'react';
import CategoryDropdown from '../components/CategoryDropdown';
import { fetchCategories } from '../services/categoryService';
import './pages.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setCategories(await fetchCategories()); }
    catch (err) { setError(err?.response?.data?.message || 'Unable to load categories right now.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const selectedCategory = categories.find((item) => item.id === selected);

  return (
    <section>
      <div className="page-header">
        <div><h2>Categories</h2><p>Browse and select expense categories.</p></div>
        <button className="button secondary" onClick={load} disabled={loading}>↻ Refresh</button>
      </div>
      {error && <div className="alert error" role="alert">{error}<button onClick={load}>Retry</button></div>}
      {loading ? <div className="state card"><div className="spinner" />Loading categories...</div> :
        <div className="grid category-grid">
          {categories.map((item) => (
            <button key={item.id} className={`category-card card ${selected === item.id ? 'selected' : ''}`} onClick={() => setSelected(item.id)}>
              <span className="category-icon" style={{ background: `${item.color}20` }}>{item.icon || '💰'}</span>
              <span><strong>{item.name}</strong><small>{selected === item.id ? 'Selected' : 'Expense category'}</small></span>
            </button>
          ))}
        </div>}
      {!loading && selectedCategory && <div className="selected-box card"><strong>Selected category</strong><span>{selectedCategory.icon} {selectedCategory.name}</span></div>}
      <div className="card category-selector">
        <h3>Category dropdown</h3>
        <CategoryDropdown label="Entry category" categories={categories} value={selected} onChange={setSelected} />
      </div>
    </section>
  );
}

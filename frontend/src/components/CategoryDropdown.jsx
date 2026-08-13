export default function CategoryDropdown({
  label = 'Category',
  categories = [],
  value = '',
  onChange,
  placeholder = 'Select a category',
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <label style={{ display: 'grid', gap: '0.5rem', textAlign: 'left' }}>
      <span>{label}</span>
      <select
        value={value}
        onChange={handleChange}
        aria-label={label}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          border: '1px solid #d8e1f1',
          backgroundColor: '#fff',
          fontSize: '1rem',
        }}
      >
        <option value="">{placeholder}</option>
        {categories.map((category) => (
          <option key={category.id || category.name} value={category.id || category.name}>
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}

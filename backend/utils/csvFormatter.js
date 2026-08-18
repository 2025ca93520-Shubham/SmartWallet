const escapeCsvValue = (value) => {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const formatDate = (value) => {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value || '';
};

export const expensesToCsv = (expenses) => {
  const rows = [
    ['Date', 'Category', 'Amount', 'Notes'],
    ...expenses.map((expense) => [
      formatDate(expense.date),
      expense.category,
      Number(expense.amount || 0).toFixed(2),
      expense.notes,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');
};
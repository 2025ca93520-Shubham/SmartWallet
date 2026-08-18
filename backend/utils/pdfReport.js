import PDFDocument from 'pdfkit';

const money = (amount) => `INR ${Number(amount || 0).toFixed(2)}`;

const periodLabel = (month, year) => new Date(year, month - 1, 1)
  .toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

export const createExpenseReportPdf = (summary) => new Promise((resolve, reject) => {
  const document = new PDFDocument({ margin: 50 });
  const chunks = [];

  document.on('data', (chunk) => chunks.push(chunk));
  document.on('end', () => resolve(Buffer.concat(chunks)));
  document.on('error', reject);

  document.fontSize(24).fillColor('#16213e').text('SmartWallet Expense Report');
  const reportPeriod = summary.period.label || periodLabel(summary.period.month, summary.period.year);
  document.moveDown(0.4).fontSize(11).fillColor('#64748b')
    .text(`Reporting period: ${reportPeriod}`);

  document.moveDown(1).fontSize(16).fillColor('#16213e').text('Expense Summary');
  document.moveDown(0.3).fontSize(12).fillColor('#1f2937')
    .text(`Total Expenses: ${money(summary.monthlyExpenses)}`);

  document.moveDown(1).fontSize(16).fillColor('#16213e').text('Expense Details');
  document.moveDown(0.3).fontSize(11).fillColor('#1f2937');
  if (!summary.expenses || summary.expenses.length === 0) {
    document.text('No expense details available for this period.');
  } else {
    document.font('Helvetica-Bold').text('Expense | Category | Amount | Notes').font('Helvetica');
    summary.expenses.forEach((expense) => {
      document.text(`${expense.description || 'Unnamed expense'} | ${expense.category} | ${money(expense.amount)} | ${expense.notes || 'No notes'}`);
    });
  }

  document.moveDown(1).fontSize(16).fillColor('#16213e').text('Category Breakdown');
  document.moveDown(0.3).fontSize(11).fillColor('#1f2937');
  if (summary.categoryBreakdown.length === 0) {
    document.text('No expenses recorded for this period.');
  } else {
    summary.categoryBreakdown.forEach((item) => {
      document.text(`${item.category}: ${money(item.amount)} (${item.percentage}%)`);
    });
  }

  document.moveDown(1).fontSize(16).fillColor('#16213e').text('Budget vs Remaining');
  document.moveDown(0.3).fontSize(11).fillColor('#1f2937');
  if (summary.budgetAnalysis.length === 0) {
    document.text('No budgets recorded for this period.');
  } else {
    summary.budgetAnalysis.forEach((item) => {
      document.text(`${item.category}: Budget ${money(item.budget)} | Spent ${money(item.spent)} | Remaining ${money(item.remaining)}`);
    });
    document.moveDown(0.5).font('Helvetica-Bold')
      .text(`Total Budget: ${money(summary.totalBudget)} | Total Remaining: ${money(summary.totalRemaining)}`)
      .font('Helvetica');
  }

  document.end();
});
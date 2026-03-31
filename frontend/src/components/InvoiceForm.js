import React, { useState } from 'react';
import axios from 'axios';
import './InvoiceForm.css';

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

const CATEGORIES = ['goods', 'services', 'digital', 'food', 'other'];

const TAX_API_URL = 'http://localhost:8082/api/tax';
const SAVE_API_URL = 'http://localhost:8081/api/invoices';

const initialForm = {
  invoiceNumber: '',
  customerName: '',
  customerEmail: '',
  state: '',
  amount: '',
  category: 'goods',
  description: '',
  invoiceDate: new Date().toISOString().split('T')[0],
};

function InvoiceForm({ onInvoiceSaved }) {
  const [form, setForm] = useState(initialForm);
  const [taxInfo, setTaxInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [taxLoading, setTaxLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
    setErrorMessage('');

    // Clear tax info when state or amount changes
    if (name === 'state' || name === 'amount') {
      setTaxInfo(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required';
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!form.invoiceDate) newErrors.invoiceDate = 'Invoice date is required';
    return newErrors;
  };

  const handleCalculateTax = async () => {
    if (!form.state || !form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setErrors(prev => ({
        ...prev,
        state: !form.state ? 'State is required to calculate tax' : '',
        amount: (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) ? 'Valid amount is required to calculate tax' : '',
      }));
      return;
    }

    setTaxLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${TAX_API_URL}/calculate`, {
        state: form.state,
        amount: Number(form.amount),
        category: form.category,
      });
      setTaxInfo(response.data);
    } catch (err) {
      setErrorMessage('Failed to calculate tax. Ensure the Tax API is running on port 8082.');
    } finally {
      setTaxLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Calculate tax first if not already done
      let currentTaxInfo = taxInfo;
      if (!currentTaxInfo) {
        const taxResponse = await axios.post(`${TAX_API_URL}/calculate`, {
          state: form.state,
          amount: Number(form.amount),
          category: form.category,
        });
        currentTaxInfo = taxResponse.data;
        setTaxInfo(currentTaxInfo);
      }

      // Save the invoice
      const invoicePayload = {
        invoiceNumber: form.invoiceNumber.trim(),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim() || null,
        state: form.state,
        amount: Number(form.amount),
        taxRate: currentTaxInfo.taxRate,
        taxAmount: currentTaxInfo.taxAmount,
        totalAmount: currentTaxInfo.totalAmount,
        category: form.category,
        description: form.description.trim() || null,
        invoiceDate: form.invoiceDate,
      };

      await axios.post(SAVE_API_URL, invoicePayload);
      setSuccessMessage(`Invoice ${form.invoiceNumber} saved successfully!`);
      setForm(initialForm);
      setTaxInfo(null);
      if (onInvoiceSaved) onInvoiceSaved();
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setErrorMessage(`Invoice number "${form.invoiceNumber}" already exists.`);
        } else if (err.response.status === 400) {
          setErrorMessage('Invalid invoice data. Please check your inputs.');
        } else {
          setErrorMessage('Failed to save invoice. Ensure the Save API is running on port 8081.');
        }
      } else {
        setErrorMessage('Cannot connect to APIs. Ensure both APIs are running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-form-container">
      <h2 className="form-title">Create New Invoice</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number *</label>
            <input
              id="invoiceNumber"
              name="invoiceNumber"
              type="text"
              value={form.invoiceNumber}
              onChange={handleChange}
              placeholder="e.g. INV-2024-001"
              className={errors.invoiceNumber ? 'error' : ''}
            />
            {errors.invoiceNumber && <span className="error-msg">{errors.invoiceNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="invoiceDate">Invoice Date *</label>
            <input
              id="invoiceDate"
              name="invoiceDate"
              type="date"
              value={form.invoiceDate}
              onChange={handleChange}
              className={errors.invoiceDate ? 'error' : ''}
            />
            {errors.invoiceDate && <span className="error-msg">{errors.invoiceDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerName">Customer Name *</label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className={errors.customerName ? 'error' : ''}
            />
            {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Customer Email</label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="customer@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            >
              <option value="">-- Select State --</option>
              {US_STATES.map(s => (
                <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
              ))}
            </select>
            {errors.state && <span className="error-msg">{errors.state}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter invoice description (optional)"
              rows={3}
            />
          </div>
        </div>

        <div className="tax-section">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCalculateTax}
            disabled={taxLoading}
          >
            {taxLoading ? 'Calculating...' : 'Calculate Tax'}
          </button>

          {taxInfo && (
            <div className="tax-result">
              <h3>Tax Breakdown</h3>
              <div className="tax-grid">
                <div className="tax-item">
                  <span className="tax-label">State</span>
                  <span className="tax-value">{taxInfo.state}</span>
                </div>
                <div className="tax-item">
                  <span className="tax-label">Tax Rate</span>
                  <span className="tax-value">{taxInfo.taxRate}%</span>
                </div>
                <div className="tax-item">
                  <span className="tax-label">Subtotal</span>
                  <span className="tax-value">${taxInfo.amount.toFixed(2)}</span>
                </div>
                <div className="tax-item">
                  <span className="tax-label">Tax Amount</span>
                  <span className="tax-value">${taxInfo.taxAmount.toFixed(2)}</span>
                </div>
                <div className="tax-item tax-total">
                  <span className="tax-label">Total</span>
                  <span className="tax-value">${taxInfo.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => { setForm(initialForm); setTaxInfo(null); setErrors({}); setErrorMessage(''); setSuccessMessage(''); }}
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;

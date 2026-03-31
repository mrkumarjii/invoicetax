import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './InvoiceList.css';

const SAVE_API_URL = 'http://localhost:8081/api/invoices';

function InvoiceList({ refreshTrigger }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [filterState, setFilterState] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = SAVE_API_URL;
      const params = new URLSearchParams();
      if (searchCustomer.trim()) params.set('customerName', searchCustomer.trim());
      if (filterState.trim()) params.set('state', filterState.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      setInvoices(response.data);
    } catch (err) {
      setError('Failed to load invoices. Ensure the Save API is running on port 8081.');
    } finally {
      setLoading(false);
    }
  }, [searchCustomer, filterState]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, refreshTrigger]);

  const handleDelete = async (id, invoiceNumber) => {
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;
    try {
      await axios.delete(`${SAVE_API_URL}/${id}`);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      if (selectedInvoice && selectedInvoice.id === id) setSelectedInvoice(null);
    } catch (err) {
      setError('Failed to delete invoice.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInvoices();
  };

  return (
    <div className="invoice-list-container">
      <h2 className="list-title">Invoices</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchCustomer}
          onChange={e => setSearchCustomer(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by state (e.g. CA)..."
          value={filterState}
          onChange={e => setFilterState(e.target.value)}
          maxLength={2}
          style={{ width: '180px' }}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => { setSearchCustomer(''); setFilterState(''); }}
        >
          Clear
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="empty-state">No invoices found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>State</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr
                  key={inv.id}
                  className={selectedInvoice && selectedInvoice.id === inv.id ? 'selected' : ''}
                  onClick={() => setSelectedInvoice(inv === selectedInvoice ? null : inv)}
                >
                  <td><strong>{inv.invoiceNumber}</strong></td>
                  <td>{inv.customerName}</td>
                  <td><span className="state-badge">{inv.state}</span></td>
                  <td>{inv.invoiceDate}</td>
                  <td>${inv.amount.toFixed(2)}</td>
                  <td>{inv.taxRate != null ? `${inv.taxRate}%` : '-'}</td>
                  <td><strong>${inv.totalAmount != null ? inv.totalAmount.toFixed(2) : inv.amount.toFixed(2)}</strong></td>
                  <td>
                    <button
                      className="btn-icon btn-delete"
                      onClick={e => { e.stopPropagation(); handleDelete(inv.id, inv.invoiceNumber); }}
                      title="Delete invoice"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <div className="invoice-detail">
          <h3>Invoice Details</h3>
          <button className="close-btn" onClick={() => setSelectedInvoice(null)}>×</button>
          <div className="detail-grid">
            <div className="detail-item"><span>Invoice #</span><strong>{selectedInvoice.invoiceNumber}</strong></div>
            <div className="detail-item"><span>Customer</span><strong>{selectedInvoice.customerName}</strong></div>
            {selectedInvoice.customerEmail && (
              <div className="detail-item"><span>Email</span><strong>{selectedInvoice.customerEmail}</strong></div>
            )}
            <div className="detail-item"><span>State</span><strong>{selectedInvoice.state}</strong></div>
            <div className="detail-item"><span>Date</span><strong>{selectedInvoice.invoiceDate}</strong></div>
            <div className="detail-item"><span>Category</span><strong>{selectedInvoice.category || '-'}</strong></div>
            <div className="detail-item"><span>Amount</span><strong>${selectedInvoice.amount.toFixed(2)}</strong></div>
            <div className="detail-item"><span>Tax Rate</span><strong>{selectedInvoice.taxRate != null ? `${selectedInvoice.taxRate}%` : '-'}</strong></div>
            <div className="detail-item"><span>Tax Amount</span><strong>${selectedInvoice.taxAmount != null ? selectedInvoice.taxAmount.toFixed(2) : '0.00'}</strong></div>
            <div className="detail-item total"><span>Total</span><strong>${selectedInvoice.totalAmount != null ? selectedInvoice.totalAmount.toFixed(2) : selectedInvoice.amount.toFixed(2)}</strong></div>
            {selectedInvoice.description && (
              <div className="detail-item detail-item-full"><span>Description</span><strong>{selectedInvoice.description}</strong></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;

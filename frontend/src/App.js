import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [refreshList, setRefreshList] = useState(0);

  const handleInvoiceSaved = () => {
    setRefreshList(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Invoice Tax System</h1>
        <p>Manage invoices with automatic tax calculation</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Invoice
        </button>
        <button
          className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          View Invoices
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'create' && (
          <InvoiceForm onInvoiceSaved={handleInvoiceSaved} />
        )}
        {activeTab === 'list' && (
          <InvoiceList refreshTrigger={refreshList} />
        )}
      </main>
    </div>
  );
}

export default App;

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Invoice Tax System/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  expect(screen.getByText(/Create Invoice/i)).toBeInTheDocument();
  expect(screen.getByText(/View Invoices/i)).toBeInTheDocument();
});

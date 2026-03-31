package com.invoicetax.saveapi.service;

import com.invoicetax.saveapi.model.Invoice;
import com.invoicetax.saveapi.repository.InvoiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice saveInvoice(Invoice invoice) {
        if (invoiceRepository.existsByInvoiceNumber(invoice.getInvoiceNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Invoice with number " + invoice.getInvoiceNumber() + " already exists"
            );
        }
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invoice not found with id: " + id
                ));
    }

    public Invoice getInvoiceByNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invoice not found with number: " + invoiceNumber
                ));
    }

    public List<Invoice> searchByCustomerName(String customerName) {
        return invoiceRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    public List<Invoice> getInvoicesByState(String state) {
        return invoiceRepository.findByState(state.toUpperCase());
    }

    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Invoice existing = getInvoiceById(id);
        existing.setCustomerName(updatedInvoice.getCustomerName());
        existing.setCustomerEmail(updatedInvoice.getCustomerEmail());
        existing.setState(updatedInvoice.getState());
        existing.setAmount(updatedInvoice.getAmount());
        existing.setTaxRate(updatedInvoice.getTaxRate());
        existing.setTaxAmount(updatedInvoice.getTaxAmount());
        existing.setTotalAmount(updatedInvoice.getTotalAmount());
        existing.setCategory(updatedInvoice.getCategory());
        existing.setDescription(updatedInvoice.getDescription());
        existing.setInvoiceDate(updatedInvoice.getInvoiceDate());
        return invoiceRepository.save(existing);
    }

    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Invoice not found with id: " + id
            );
        }
        invoiceRepository.deleteById(id);
    }
}

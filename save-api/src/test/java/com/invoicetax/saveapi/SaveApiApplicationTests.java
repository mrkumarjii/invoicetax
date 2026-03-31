package com.invoicetax.saveapi;

import com.invoicetax.saveapi.model.Invoice;
import com.invoicetax.saveapi.service.InvoiceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SaveApiApplicationTests {

    @Autowired
    private InvoiceService invoiceService;

    @Test
    void contextLoads() {
    }

    @Test
    void testSaveAndRetrieveInvoice() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-TEST-001");
        invoice.setCustomerName("Test Customer");
        invoice.setCustomerEmail("test@example.com");
        invoice.setState("CA");
        invoice.setAmount(100.0);
        invoice.setTaxRate(7.25);
        invoice.setTaxAmount(7.25);
        invoice.setTotalAmount(107.25);
        invoice.setCategory("goods");
        invoice.setInvoiceDate(LocalDate.now());

        Invoice saved = invoiceService.saveInvoice(invoice);

        assertNotNull(saved.getId());
        assertEquals("INV-TEST-001", saved.getInvoiceNumber());
        assertEquals("Test Customer", saved.getCustomerName());
        assertEquals("CA", saved.getState());
    }

    @Test
    void testDuplicateInvoiceNumberThrowsConflict() {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-DUP-001");
        invoice.setCustomerName("Customer A");
        invoice.setState("TX");
        invoice.setAmount(50.0);
        invoice.setInvoiceDate(LocalDate.now());
        invoiceService.saveInvoice(invoice);

        Invoice duplicate = new Invoice();
        duplicate.setInvoiceNumber("INV-DUP-001");
        duplicate.setCustomerName("Customer B");
        duplicate.setState("TX");
        duplicate.setAmount(75.0);
        duplicate.setInvoiceDate(LocalDate.now());

        assertThrows(ResponseStatusException.class, () -> invoiceService.saveInvoice(duplicate));
    }

    @Test
    void testGetInvoiceByIdNotFound() {
        assertThrows(ResponseStatusException.class, () -> invoiceService.getInvoiceById(9999L));
    }
}

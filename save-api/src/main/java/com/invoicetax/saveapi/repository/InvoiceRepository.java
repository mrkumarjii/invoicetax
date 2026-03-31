package com.invoicetax.saveapi.repository;

import com.invoicetax.saveapi.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByCustomerNameContainingIgnoreCase(String customerName);

    List<Invoice> findByState(String state);

    boolean existsByInvoiceNumber(String invoiceNumber);
}

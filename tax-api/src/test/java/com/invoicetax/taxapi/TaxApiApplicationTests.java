package com.invoicetax.taxapi;

import com.invoicetax.taxapi.model.TaxRequest;
import com.invoicetax.taxapi.model.TaxResponse;
import com.invoicetax.taxapi.service.TaxService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaxApiApplicationTests {

    @Autowired
    private TaxService taxService;

    @Test
    void contextLoads() {
    }

    @Test
    void testCalculateTaxForCalifornia() {
        TaxRequest request = new TaxRequest("CA", 100.0, "goods");
        TaxResponse response = taxService.calculateTax(request);

        assertEquals("CA", response.getState());
        assertEquals(100.0, response.getAmount());
        assertEquals(7.25, response.getTaxRate());
        assertEquals(7.25, response.getTaxAmount());
        assertEquals(107.25, response.getTotalAmount());
    }

    @Test
    void testCalculateTaxForNoTaxState() {
        TaxRequest request = new TaxRequest("OR", 200.0, "goods");
        TaxResponse response = taxService.calculateTax(request);

        assertEquals("OR", response.getState());
        assertEquals(0.0, response.getTaxRate());
        assertEquals(0.0, response.getTaxAmount());
        assertEquals(200.0, response.getTotalAmount());
    }

    @Test
    void testCalculateTaxUnknownStateUsesDefault() {
        TaxRequest request = new TaxRequest("XX", 100.0, "goods");
        TaxResponse response = taxService.calculateTax(request);

        assertEquals(5.0, response.getTaxRate());
        assertEquals(5.0, response.getTaxAmount());
        assertEquals(105.0, response.getTotalAmount());
    }

    @Test
    void testGetAllTaxRates() {
        var rates = taxService.getAllTaxRates();
        assertFalse(rates.isEmpty());
        assertTrue(rates.containsKey("CA"));
        assertTrue(rates.containsKey("TX"));
    }
}

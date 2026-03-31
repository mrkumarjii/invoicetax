package com.invoicetax.taxapi.service;

import com.invoicetax.taxapi.model.TaxRequest;
import com.invoicetax.taxapi.model.TaxResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TaxService {

    // US state sales tax rates (as percentages)
    private static final Map<String, Double> STATE_TAX_RATES = new HashMap<>();

    static {
        STATE_TAX_RATES.put("AL", 4.0);
        STATE_TAX_RATES.put("AK", 0.0);
        STATE_TAX_RATES.put("AZ", 5.6);
        STATE_TAX_RATES.put("AR", 6.5);
        STATE_TAX_RATES.put("CA", 7.25);
        STATE_TAX_RATES.put("CO", 2.9);
        STATE_TAX_RATES.put("CT", 6.35);
        STATE_TAX_RATES.put("DE", 0.0);
        STATE_TAX_RATES.put("FL", 6.0);
        STATE_TAX_RATES.put("GA", 4.0);
        STATE_TAX_RATES.put("HI", 4.0);
        STATE_TAX_RATES.put("ID", 6.0);
        STATE_TAX_RATES.put("IL", 6.25);
        STATE_TAX_RATES.put("IN", 7.0);
        STATE_TAX_RATES.put("IA", 6.0);
        STATE_TAX_RATES.put("KS", 6.5);
        STATE_TAX_RATES.put("KY", 6.0);
        STATE_TAX_RATES.put("LA", 4.45);
        STATE_TAX_RATES.put("ME", 5.5);
        STATE_TAX_RATES.put("MD", 6.0);
        STATE_TAX_RATES.put("MA", 6.25);
        STATE_TAX_RATES.put("MI", 6.0);
        STATE_TAX_RATES.put("MN", 6.875);
        STATE_TAX_RATES.put("MS", 7.0);
        STATE_TAX_RATES.put("MO", 4.225);
        STATE_TAX_RATES.put("MT", 0.0);
        STATE_TAX_RATES.put("NE", 5.5);
        STATE_TAX_RATES.put("NV", 6.85);
        STATE_TAX_RATES.put("NH", 0.0);
        STATE_TAX_RATES.put("NJ", 6.625);
        STATE_TAX_RATES.put("NM", 5.125);
        STATE_TAX_RATES.put("NY", 4.0);
        STATE_TAX_RATES.put("NC", 4.75);
        STATE_TAX_RATES.put("ND", 5.0);
        STATE_TAX_RATES.put("OH", 5.75);
        STATE_TAX_RATES.put("OK", 4.5);
        STATE_TAX_RATES.put("OR", 0.0);
        STATE_TAX_RATES.put("PA", 6.0);
        STATE_TAX_RATES.put("RI", 7.0);
        STATE_TAX_RATES.put("SC", 6.0);
        STATE_TAX_RATES.put("SD", 4.5);
        STATE_TAX_RATES.put("TN", 7.0);
        STATE_TAX_RATES.put("TX", 6.25);
        STATE_TAX_RATES.put("UT", 5.95);
        STATE_TAX_RATES.put("VT", 6.0);
        STATE_TAX_RATES.put("VA", 5.3);
        STATE_TAX_RATES.put("WA", 6.5);
        STATE_TAX_RATES.put("WV", 6.0);
        STATE_TAX_RATES.put("WI", 5.0);
        STATE_TAX_RATES.put("WY", 4.0);
    }

    // Default tax rate when state is not found
    private static final double DEFAULT_TAX_RATE = 5.0;

    public TaxResponse calculateTax(TaxRequest request) {
        String stateCode = request.getState().toUpperCase().trim();
        double taxRate = STATE_TAX_RATES.getOrDefault(stateCode, DEFAULT_TAX_RATE);

        double amount = request.getAmount();
        double taxAmount = Math.round((amount * taxRate / 100.0) * 100.0) / 100.0;
        double totalAmount = Math.round((amount + taxAmount) * 100.0) / 100.0;

        return new TaxResponse(
                stateCode,
                amount,
                taxRate,
                taxAmount,
                totalAmount,
                request.getCategory()
        );
    }

    public Map<String, Double> getAllTaxRates() {
        return new HashMap<>(STATE_TAX_RATES);
    }
}

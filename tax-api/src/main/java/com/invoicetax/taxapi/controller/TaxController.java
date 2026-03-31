package com.invoicetax.taxapi.controller;

import com.invoicetax.taxapi.model.TaxRequest;
import com.invoicetax.taxapi.model.TaxResponse;
import com.invoicetax.taxapi.service.TaxService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tax")
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class TaxController {

    private final TaxService taxService;

    public TaxController(TaxService taxService) {
        this.taxService = taxService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<TaxResponse> calculateTax(@Valid @RequestBody TaxRequest request) {
        TaxResponse response = taxService.calculateTax(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rates")
    public ResponseEntity<Map<String, Double>> getAllTaxRates() {
        return ResponseEntity.ok(taxService.getAllTaxRates());
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Tax API is running on port 8082");
    }
}

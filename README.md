# Invoice Tax System

A full-stack invoice management system with automatic tax calculation, consisting of three separate services:

| Service | Technology | Port |
|---------|-----------|------|
| `frontend/` | React | 3000 |
| `save-api/` | Java Spring Boot + H2 | 8081 |
| `tax-api/` | Java Spring Boot | 8082 |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               React Frontend (port 3000)             │
│   - Enter invoice details                            │
│   - Calculate tax via Tax API                        │
│   - Save invoices via Save API                       │
│   - View & search saved invoices                     │
└───────────┬───────────────────────┬─────────────────┘
            │                       │
            ▼                       ▼
┌───────────────────┐   ┌─────────────────────────┐
│  Save API (8081)  │   │   Tax API (8082)         │
│  Spring Boot      │   │   Spring Boot            │
│  H2 (in-memory)   │   │   US state tax rates     │
└───────────────────┘   └─────────────────────────┘
```

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+
- **Java** 17+
- **Maven** 3.8+

---

## Running the Application

### 1. Start the Tax API (port 8082)

```bash
cd tax-api
mvn spring-boot:run
```

### 2. Start the Save API (port 8081)

```bash
cd save-api
mvn spring-boot:run
```

### 3. Start the React Frontend (port 3000)

```bash
cd frontend
npm install
npm start
```

Open your browser to **http://localhost:3000**

---

## API Reference

### Tax API — `http://localhost:8082`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tax/calculate` | Calculate tax for an amount and state |
| GET | `/api/tax/rates` | Get all US state tax rates |
| GET | `/api/tax/health` | Health check |

**POST `/api/tax/calculate` request body:**
```json
{
  "state": "CA",
  "amount": 100.00,
  "category": "goods"
}
```

**Response:**
```json
{
  "state": "CA",
  "amount": 100.0,
  "taxRate": 7.25,
  "taxAmount": 7.25,
  "totalAmount": 107.25,
  "category": "goods"
}
```

---

### Save API — `http://localhost:8081`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/invoices` | Create a new invoice |
| GET | `/api/invoices` | Get all invoices (supports `?customerName=` and `?state=` filters) |
| GET | `/api/invoices/{id}` | Get invoice by ID |
| GET | `/api/invoices/number/{invoiceNumber}` | Get invoice by number |
| PUT | `/api/invoices/{id}` | Update an invoice |
| DELETE | `/api/invoices/{id}` | Delete an invoice |
| GET | `/api/invoices/health` | Health check |

**POST `/api/invoices` request body:**
```json
{
  "invoiceNumber": "INV-2024-001",
  "customerName": "Acme Corp",
  "customerEmail": "billing@acme.com",
  "state": "CA",
  "amount": 100.00,
  "taxRate": 7.25,
  "taxAmount": 7.25,
  "totalAmount": 107.25,
  "category": "goods",
  "description": "Professional services",
  "invoiceDate": "2024-01-15"
}
```

The H2 console is available at **http://localhost:8081/h2-console** (JDBC URL: `jdbc:h2:mem:invoicedb`).

---

## Running Tests

### Tax API tests
```bash
cd tax-api
mvn test
```

### Save API tests
```bash
cd save-api
mvn test
```

### Frontend tests
```bash
cd frontend
npm test -- --watchAll=false
```

---

## Tax Rates

The Tax API uses US state sales tax base rates. States with 0% tax include: **AK, DE, MT, NH, OR**.

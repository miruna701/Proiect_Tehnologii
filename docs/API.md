# Documentatie API — Magazin

## Descriere
Aplicatie web de cautare produse. Utilizatorul poate cauta un produs
dupa nume, vedea pretul si cantitatea, si adauga produse noi direct
din interfata.

---

## Cum rulezi proiectul

```bash
# Instaleaza dependentele
npm install

# Porneste serverul
npm start

# Ruleaza testele
npm test
```

---

## Endpoint-uri API

### GET /api/products
Returneaza toate produsele.

**Raspuns 200:**
```json
{
  "success": true,
  "data": [
    { "name": "Widget", "price": 25.00, "quantity": 5 }
  ]
}
```

---

### GET /api/products/search?name=Widget
Cauta un produs dupa nume (insensibil la majuscule).

**Raspuns 200 - produs gasit:**
```json
{
  "success": true,
  "data": { "name": "Widget", "price": 25.00, "quantity": 5 }
}
```

**Raspuns 404 - produs negasit:**
```json
{
  "success": false,
  "message": "Ne pare rau, produsul \"iPad\" nu a fost gasit."
}
```

---

### POST /api/products
Adauga un produs nou.

**Body:**
```json
{
  "name": "Sprocket",
  "price": 12.50,
  "quantity": 8
}
```

**Raspuns 201 - creat cu succes:**
```json
{
  "success": true,
  "data": { "name": "Sprocket", "price": 12.50, "quantity": 8 }
}
```

**Raspuns 409 - produsul exista deja:**
```json
{
  "success": false,
  "message": "Produsul \"Sprocket\" exista deja."
}
```

---

## Structure proiect
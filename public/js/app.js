"use strict";

/* =========================================
   API - comunicare cu serverul
   ========================================= */
const api = (() => {
  const BASE = "/api/products";

  async function searchProduct(name) {
    const res = await fetch(`${BASE}/search?name=${encodeURIComponent(name)}`);
    return res.json();
  }

  async function addProduct(name, price, quantity) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    });
    return res.json();
  }

  return { searchProduct, addProduct };
})();

/* =========================================
   UI - construire elemente HTML
   ========================================= */
const ui = (() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showFound(container, product) {
    container.innerHTML = `
      <div class="separator"></div>
      <div class="result-label">Nume</div>
      <div class="result-value">${escapeHtml(product.name)}</div>
      <div class="result-label">Pret</div>
      <div class="result-value">$${Number(product.price).toFixed(2)}</div>
      <div class="result-label">Cantitate disponibila</div>
      <div class="result-value">${product.quantity}</div>
    `;
  }

  function showNotFound(container, name) {
    container.innerHTML = `
      <div class="separator"></div>
      <div class="not-found">
        Ne pare rau, produsul nu a fost gasit in magazinul nostru.
      </div>
      <p class="add-question">
        Doriti sa adaugati produsul <strong>${escapeHtml(name)}</strong>?
      </p>
      <div class="form-grid">
        <div class="field">
          <label>Pret ($)</label>
          <input type="number" id="newPrice" min="0" step="0.01" placeholder="ex. 19.99" />
        </div>
        <div class="field">
          <label>Cantitate</label>
          <input type="number" id="newQty" min="0" step="1" placeholder="ex. 10" />
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-add" id="btnYes">Da, adauga produsul</button>
        <button class="btn-cancel" id="btnNo">Nu, multumesc</button>
      </div>
      <div id="addMsg"></div>
    `;
  }

  function showSuccess(container, name) {
    container.innerHTML = `
      <div class="separator"></div>
      <div class="success-box">
        Produsul <strong>${escapeHtml(name)}</strong> a fost adaugat cu succes!
        Il poti cauta acum.
      </div>
    `;
  }

  function showError(container, message) {
    container.innerHTML = `
      <div class="separator"></div>
      <div class="not-found">${escapeHtml(message)}</div>
    `;
  }

  return { showFound, showNotFound, showSuccess, showError };
})();

/* =========================================
   Cautare produs
   ========================================= */
async function handleSearch() {
  const input      = document.getElementById("searchInput");
  const resultArea = document.getElementById("resultArea");
  const name       = input.value.trim();

  if (!name) {
    resultArea.innerHTML = "";
    return;
  }

  const result = await api.searchProduct(name);

  if (result.success) {
    ui.showFound(resultArea, result.data);
  } else if (result.message && result.message.includes("nu a fost gasit")) {
    ui.showNotFound(resultArea, name);
    bindAddButtons(name);
  } else {
    ui.showError(resultArea, result.message);
  }
}

/* =========================================
   Adaugare produs
   ========================================= */
function bindAddButtons(name) {
  document.getElementById("btnYes").addEventListener("click", async () => {
    const price    = parseFloat(document.getElementById("newPrice").value);
    const quantity = parseInt(document.getElementById("newQty").value, 10);
    const addMsg   = document.getElementById("addMsg");

    if (isNaN(price) || price < 0) {
      addMsg.innerHTML = `
        <p style="color:#a32d2d;font-size:13px;margin-top:10px">
          Introduceti un pret valid.
        </p>`;
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      addMsg.innerHTML = `
        <p style="color:#a32d2d;font-size:13px;margin-top:10px">
          Introduceti o cantitate valida.
        </p>`;
      return;
    }

    const result     = await api.addProduct(name, price, quantity);
    const resultArea = document.getElementById("resultArea");

    if (result.success) {
      ui.showSuccess(resultArea, name);
      document.getElementById("searchInput").value = "";
    } else {
      addMsg.innerHTML = `
        <p style="color:#a32d2d;font-size:13px;margin-top:10px">
          ${result.message}
        </p>`;
    }
  });

  document.getElementById("btnNo").addEventListener("click", () => {
    document.getElementById("resultArea").innerHTML = "";
    document.getElementById("searchInput").value   = "";
  });
}

/* =========================================
   Initializare
   ========================================= */
document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
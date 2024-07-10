document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  // Fetch and display Shelo Nabel products
  productList.innerHTML = `
        <div class="product">
            <h3>Producto 1</h3>
            <p>Descripción del Producto 1</p>
        </div>
        <div class="product">
            <h3>Producto 2</h3>
            <p>Descripción del Producto 2</p>
        </div>
    `;
});

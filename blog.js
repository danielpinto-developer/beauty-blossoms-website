document.addEventListener("DOMContentLoaded", () => {
  const blogList = document.getElementById("blog-list");
  // Fetch and display blog posts
  blogList.innerHTML = `
        <div class="blog-post">
            <h3>Título del Blog 1</h3>
            <p>Contenido del Blog 1</p>
        </div>
        <div class="blog-post">
            <h3>Título del Blog 2</h3>
            <p>Contenido del Blog 2</p>
        </div>
    `;
});

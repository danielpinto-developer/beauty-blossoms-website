document.addEventListener("DOMContentLoaded", () => {
  const blogForm = document.getElementById("blog-form");
  blogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value;
    // Save the blog post
    console.log({ title, content, tags });
    alert("Publicación creada exitosamente");
  });
});

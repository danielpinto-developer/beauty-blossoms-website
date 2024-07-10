// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4eMq0Y8ERerdBIzsySqtG9QnisI3CBIc",
  authDomain: "bb27studio-loyalty-program.firebaseapp.com",
  projectId: "bb27studio-loyalty-program",
  storageBucket: "bb27studio-loyalty-program.appspot.com",
  messagingSenderId: "827670961717",
  appId: "1:827670961717:web:9e7b9d33ddd047dfcc9b7c",
  measurementId: "G-Y30PX1R10P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function displayBlogPosts() {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = ""; // Clear previous content

  const blogPostsSnapshot = await getDocs(collection(db, "blogPosts"));
  if (blogPostsSnapshot.empty) {
    blogContainer.innerHTML = "<p>No hay publicaciones por el momento</p>";
    return;
  }

  blogPostsSnapshot.forEach((doc) => {
    const blogData = doc.data();
    const postTitle = blogData.title;
    const postDate = blogData.date;
    const postTags = blogData.tags.join(", ");
    const postUrl = `/blog/${postTitle.replace(/\s+/g, "-").toLowerCase()}`;

    const postElement = document.createElement("div");
    postElement.className = "blog-post";
    postElement.innerHTML = `
      <h2 class="blog-title"><a href="${postUrl}">${postTitle}</a></h2>
      <p class="blog-date">Fecha: ${postDate}</p>
      <p class="blog-tags">Etiquetas: ${postTags}</p>
    `;
    blogContainer.appendChild(postElement);
  });
}

window.onload = displayBlogPosts;

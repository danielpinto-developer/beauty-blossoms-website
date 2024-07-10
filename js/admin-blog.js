// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("blogForm");
  const titleInput = document.getElementById("title");
  const tagsInput = document.getElementById("tags");
  const contentTextarea = document.getElementById("content");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const tags = tagsInput.value.split(",").map((tag) => tag.trim());
    const content = contentTextarea.value;

    if (!title || !tags || !content) {
      messageDiv.textContent = "Todos los campos son obligatorios.";
      messageDiv.style.color = "red";
      return;
    }

    try {
      const blogPost = {
        title,
        tags,
        content,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "blogPosts"), blogPost);
      messageDiv.textContent = "Publicación creada exitosamente!";
      messageDiv.style.color = "green";
      form.reset();
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      messageDiv.textContent = "Error al crear la publicación.";
      messageDiv.style.color = "red";
    }
  });
});

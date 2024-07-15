import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4eMq0Y8ERerdBIzsySqtG9QnisI3CBIc",
  authDomain: "bb27studio-loyalty-program.firebaseapp.com",
  projectId: "bb27studio-loyalty-program",
  storageBucket: "bb27studio-loyalty-program.appspot.com",
  messagingSenderId: "827670961717",
  appId: "1:827670961717:web:9e7b9d33ddd047dfcc9b7c",
  measurementId: "G-Y30PX1R10P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("blogForm");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Form submitted");

      const title = document.getElementById("title").value;
      const tags = document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim());
      const content = document.getElementById("content").value;
      console.log("Title:", title);
      console.log("Tags:", tags);
      console.log("Content:", content);

      const messageDiv = document.getElementById("message");

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

        console.log("Blog post:", blogPost);

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
  } else {
    console.error("Form not found");
  }
});

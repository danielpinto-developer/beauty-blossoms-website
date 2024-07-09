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

document
  .getElementById("createPostButton")
  .addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim());

    if (!title || !content || tags.length === 0) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "blogPosts"), {
        title: title,
        content: content,
        tags: tags,
        timestamp: new Date(),
      });
      alert("Publicación creada exitosamente!");
      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
      document.getElementById("tags").value = "";
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      alert("Error al crear la publicación.");
    }
  });

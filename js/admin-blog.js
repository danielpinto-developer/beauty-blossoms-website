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
  .getElementById("create-post-button")
  .addEventListener("click", async () => {
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const tags = document.getElementById("post-tags").value.split(",");

    try {
      const docRef = await addDoc(collection(db, "blogPosts"), {
        title,
        content,
        tags,
        date: new Date().toISOString(),
      });
      alert("Publicación creada exitosamente!");
      window.location.href = "dashboard";
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error al crear la publicación.");
    }
  });

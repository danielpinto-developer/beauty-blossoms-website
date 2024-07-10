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

async function fetchBlogPosts() {
  const querySnapshot = await getDocs(collection(db, "blogPosts"));
  const blogPostsDiv = document.getElementById("blog-posts");
  const noPostsMessage = document.getElementById("no-posts-message");

  if (querySnapshot.empty) {
    noPostsMessage.style.display = "block";
  } else {
    noPostsMessage.style.display = "none";
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postElement = document.createElement("div");
      postElement.className = "blog-post";
      postElement.innerHTML = `
        <h2><a href="blog/${doc.id}.html">${postData.title}</a></h2>
        <p>${postData.tags.join(", ")}</p>
        <p>${new Date(postData.date).toLocaleDateString()}</p>
      `;
      blogPostsDiv.appendChild(postElement);
    });
  }
}

fetchBlogPosts();

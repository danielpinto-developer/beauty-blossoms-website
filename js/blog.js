// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
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
  try {
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    const blogPostsContainer = document.getElementById("blogPostsContainer");

    if (!blogPostsContainer) {
      throw new Error("blogPostsContainer element not found");
    }

    blogPostsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add("blog-post");

      const postTitle = document.createElement("h2");
      const postLink = document.createElement("a");
      postLink.href = `blog/${post.title.replace(/\s+/g, "-").toLowerCase()}`;
      postLink.textContent = post.title;
      postTitle.appendChild(postLink);

      const postTags = document.createElement("p");
      postTags.textContent = `Tags: ${post.tags.join(", ")}`;

      const postDate = document.createElement("p");
      postDate.textContent = `Published on: ${new Date(
        post.timestamp.seconds * 1000
      ).toLocaleDateString()}`;

      postElement.appendChild(postTitle);
      postElement.appendChild(postTags);
      postElement.appendChild(postDate);
      blogPostsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error displaying blog posts:", error);
  }
}

window.onload = () => {
  displayBlogPosts();
};

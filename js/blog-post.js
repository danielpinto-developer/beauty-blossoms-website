import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
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

async function displayBlogPost() {
  const urlParams = new URLSearchParams(
    window.location.pathname.split("/").pop()
  );
  const title = urlParams.get("title");

  const blogPostContent = document.getElementById("blog-post-content");

  try {
    const docRef = doc(db, "blogPosts", title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const postData = docSnap.data();
      blogPostContent.innerHTML = `
        <h1>${postData.title}</h1>
        <p>Tags: ${postData.tags.join(", ")}</p>
        <p>Published on: ${new Date(
          postData.timestamp.seconds * 1000
        ).toLocaleDateString()}</p>
        <div>${postData.content}</div>
      `;
    } else {
      blogPostContent.innerHTML = "<p>No such document!</p>";
    }
  } catch (error) {
    console.error("Error fetching blog post: ", error);
    blogPostContent.innerHTML = "<p>Error fetching blog post.</p>";
  }
}

window.onload = displayBlogPost;

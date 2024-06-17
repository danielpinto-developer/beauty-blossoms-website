// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4eMq0Y8ERerdBIzsySqtG9QnisI3CBIc",
    authDomain: "bb27studio-loyalty-program.firebaseapp.com",
    projectId: "bb27studio-loyalty-program",
    storageBucket: "bb27studio-loyalty-program.appspot.com",
    messagingSenderId: "827670961717",
    appId: "1:827670961717:web:9e7b9d33ddd047dfcc9b7c",
    measurementId: "G-Y30PX1R10P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('addDataButton').addEventListener('click', async () => {
    try {
        await addDoc(collection(db, "testCollection"), {
            name: "Test Name",
            timestamp: new Date()
        });
        alert("Data added successfully!");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

document.getElementById('fetchDataButton').addEventListener('click', async () => {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ""; // Clear previous data
    try {
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        querySnapshot.forEach((doc) => {
            dataContainer.innerHTML += `<p>${doc.data().name} - ${doc.data().timestamp.toDate()}</p>`;
        });
    } catch (e) {
        console.error("Error fetching documents: ", e);
    }
});
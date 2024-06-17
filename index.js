// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function checkPhoneNumber() {
    const phoneNumber = document.getElementById('phone-number').value;
    const messageElement = document.getElementById('message');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            window.location.href = '/client.html?phone=' + phoneNumber; // Redirect to client page with phone number
        } else {
            messageElement.style.display = 'block'; // Show message if account not found
            messageElement.textContent = 'Cuenta no encontrada';
        }
    } catch (error) {
        console.error('Error checking phone number:', error);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
    }
}
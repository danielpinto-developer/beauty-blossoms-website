import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function displayClientInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');

    const clientInfoDiv = document.getElementById('client-info');
    clientInfoDiv.innerHTML = `<p>Phone: ${phoneNumber}</p><p>Name: ${name}</p>`;

    try {
        const querySnapshot = await getDocs(collection(db, `users/${phoneNumber}/services`));
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const service = doc.data();
                clientInfoDiv.innerHTML += `<p>Date: ${service.ServiceDate} - Service: ${service.ServiceType}</p>`;
            });
        } else {
            clientInfoDiv.innerHTML += '<p>No service records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

window.onload = displayClientInfo;
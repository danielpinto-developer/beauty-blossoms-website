// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

document.getElementById('checkPhoneNumberButton').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone-number').value;
    const messageElement = document.getElementById('message');
    const clientInfoDiv = document.getElementById('client-info');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            clientInfoDiv.style.display = 'block';
            document.querySelector('.admin-container').style.display = 'none';
            messageElement.style.display = 'none';
        } else {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Cuenta no encontrada';
            clientInfoDiv.style.display = 'none';
        }
    } catch (e) {
        console.error("Error fetching document: ", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
        clientInfoDiv.style.display = 'none';
    }
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB'); // Get current date in dd/mm/yyyy format

    console.log('Adding service:', { phoneNumber, service, date });

    const docRef = doc(db, "users", phoneNumber);
    
    try {
        await updateDoc(docRef, {
            services: arrayUnion({ date, type: service })
        });
        alert('Service added successfully');
        showTab('service-history');
        displayClientInfo(phoneNumber);
    } catch (error) {
        console.error('Error updating Firestore:', error);
        alert('Failed to add service');
    }
});

async function displayClientInfo(phoneNumber) {
    const userDoc = await getDoc(doc(db, "users", phoneNumber));

    if (userDoc.exists()) {
        const clientInfoDiv = document.getElementById('service-history');
        clientInfoDiv.innerHTML = '';

        const userData = userDoc.data();
        if (userData.services && userData.services.length > 0) {
            userData.services.forEach(entry => {
                clientInfoDiv.innerHTML += `<p>Date: ${entry.date} - Service: ${entry.type}</p>`;
            });
        } else {
            clientInfoDiv.innerHTML = '<p>No service records found.</p>';
        }
    } else {
        document.getElementById('service-history').innerHTML = '<p>No service records found.</p>';
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');
    if (phoneNumber) {
        displayClientInfo(phoneNumber);
    }
};
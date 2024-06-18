// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('buscar-button').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone-number').value;
    const messageElement = document.getElementById('message');
    const numeroContainer = document.querySelector('.numero');
    const clientInfoContainer = document.getElementById('client-info');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            displayClientInfo(phoneNumber);
            clientInfoContainer.style.display = 'block';
            messageElement.style.display = 'none';
            numeroContainer.style.display = 'none';
        } else {
            messageElement.style.display = 'block'; // Show message if account not found
            messageElement.textContent = 'Cuenta no encontrada';
            clientInfoContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking phone number:', error);
        messageElement.style.display = 'block'; // Show error message
        messageElement.textContent = 'Error checking account';
        clientInfoContainer.style.display = 'none';
    }
});

document.getElementById('previous-button').addEventListener('click', () => {
    showTab('service-history');
});

document.getElementById('add-points-button').addEventListener('click', () => {
    showTab('add-points');
});

document.getElementById('add-service-button').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB'); // Get current date in dd/mm/yyyy format

    console.log('Adding service:', { phoneNumber, service, date });

    await addService(phoneNumber, service, date);

    alert('Service added successfully!');

    showTab('service-history');
    displayClientInfo(phoneNumber);
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

async function addService(phoneNumber, service, date) {
    const docRef = doc(db, "users", phoneNumber);

    try {
        await updateDoc(docRef, {
            services: arrayUnion({ date, type: service })
        });
        console.log('Firestore updated successfully');
    } catch (error) {
        console.error('Error updating Firestore:', error);
    }
}

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
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } else {
        document.getElementById('service-history').innerHTML = '<p>No records found.</p>';
    }
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    if (phoneNumber) {
        displayClientInfo(phoneNumber);
    }
};
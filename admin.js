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

document.getElementById('buscarButton').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phone-number').value;
    const messageElement = document.getElementById('message');
    const clientInfoContainer = document.getElementById('client-info');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            messageElement.style.display = 'none';
            clientInfoContainer.style.display = 'block';
            document.getElementById('phone-number').style.display = 'none';
            document.getElementById('buscarButton').style.display = 'none';
            window.history.pushState({}, '', `/admin.html?phone=${phoneNumber}&name=${encodeURIComponent(userData.Name)}`);
        } else {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Cuenta no encontrada';
        }
    } catch (e) {
        console.error("Error checking phone number: ", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
    }
});

document.getElementById('showPreviousButton').addEventListener('click', () => {
    showTab('previous-section');
    displayClientInfo();
});

document.getElementById('showAddPointsButton').addEventListener('click', () => {
    showTab('add-points-section');
});

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB');

    try {
        const userDocRef = doc(db, "users", phoneNumber);
        await updateDoc(userDocRef, {
            services: arrayUnion({ date, type: service })
        });
        alert('Service added successfully!');
        showTab('previous-section');
        displayClientInfo();
    } catch (e) {
        console.error("Error adding service: ", e);
        alert('Error adding service');
    }
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'add-points-section') {
        document.getElementById('showPreviousButton').style.display = 'none';
        document.getElementById('showAddPointsButton').style.display = 'none';
    } else {
        document.getElementById('showPreviousButton').style.display = 'inline-block';
        document.getElementById('showAddPointsButton').style.display = 'inline-block';
    }
}

async function displayClientInfo() {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const clientInfoDiv = document.getElementById('previous-section');

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            clientInfoDiv.innerHTML = '';
            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(service => {
                    clientInfoDiv.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
                });
            } else {
                clientInfoDiv.innerHTML = '<p>No service records found.</p>';
            }
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}
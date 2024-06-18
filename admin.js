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
    const clientInfoContainer = document.getElementById('client-info');
    const numeroContainer = document.querySelector('.numero');

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
            numeroContainer.style.display = 'none';
            displayClientInfo(phoneNumber, userData.Name);
        } else {
            messageElement.style.display = 'block'; // Show message if account not found
            messageElement.textContent = 'Cuenta no encontrada';
        }
    } catch (e) {
        console.error("Error checking phone number: ", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
    }
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

document.getElementById('previousButton').addEventListener('click', () => {
    showTab('service-history');
    displayServiceHistory();
});

document.getElementById('addPointsButton').addEventListener('click', () => {
    showTab('add-points');
});

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB'); // Get current date in dd/mm/yyyy format

    try {
        const docRef = doc(db, "users", phoneNumber);
        await updateDoc(docRef, {
            services: arrayUnion({ date, type: service })
        });
        alert("Service added successfully!");
        document.getElementById('add-points').style.display = 'none';
        document.getElementById('previousButton').style.display = 'block';
        document.getElementById('addPointsButton').style.display = 'block';
    } catch (error) {
        console.error('Error adding service:', error);
    }
});

async function displayClientInfo(phoneNumber, name) {
    const clientInfoDiv = document.getElementById('client-info');
    clientInfoDiv.innerHTML = `<p>Phone: ${phoneNumber}</p><p>Name: ${name}</p>`;
    await displayServiceHistory();
}

async function displayServiceHistory() {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const serviceHistoryDiv = document.getElementById('service-history');

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.services && userData.services.length > 0) {
                serviceHistoryDiv.innerHTML = '';
                userData.services.forEach(service => {
                    serviceHistoryDiv.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
                });
            } else {
                serviceHistoryDiv.innerHTML = '<p>No service records found.</p>';
            }
        } else {
            serviceHistoryDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying service history:', error);
        serviceHistoryDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');
    if (phoneNumber && name) {
        displayClientInfo(phoneNumber, name);
    }
};
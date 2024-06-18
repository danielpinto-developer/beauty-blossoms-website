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

async function checkPhoneNumber() {
    const phoneNumber = document.getElementById('phone-number').value;
    const messageElement = document.getElementById('message');
    const numeroContainer = document.querySelector('.numero');
    const actionButtons = document.getElementById('action-buttons');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            messageElement.style.display = 'none';
            numeroContainer.style.display = 'none';
            actionButtons.style.display = 'block';
            window.location.href = `/admin.html?phone=${phoneNumber}&name=${encodeURIComponent(userData.Name)}`;
        } else {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Cuenta no encontrada';
        }
    } catch (e) {
        console.error("Error checking account:", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
    }
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

async function displayClientInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');

    document.getElementById('client-info').innerHTML = `<p>Phone: ${phoneNumber}</p><p>Name: ${name}</p>`;

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const clientInfoDiv = document.getElementById('service-history');
            clientInfoDiv.innerHTML = '';

            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(service => {
                    clientInfoDiv.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
                });
            } else {
                clientInfoDiv.innerHTML = '<p>No service records found.</p>';
            }
        } else {
            document.getElementById('client-info').innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        document.getElementById('client-info').innerHTML = '<p>Error fetching records.</p>';
    }
}

async function addService() {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB');

    try {
        const userRef = doc(db, "users", phoneNumber);
        await updateDoc(userRef, {
            services: arrayUnion({ date, type: service })
        });
        alert('Service added successfully!');
        showTab('service-history');
        displayClientInfo();
    } catch (e) {
        console.error("Error adding service: ", e);
        alert('Error adding service');
    }
}

document.getElementById('add-service-btn').addEventListener('click', addService);

window.onload = displayClientInfo;
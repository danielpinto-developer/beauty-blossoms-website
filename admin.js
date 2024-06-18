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

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            messageElement.style.display = 'none';
            document.querySelector('.numero').style.display = 'none';
            document.querySelector('.tabs').style.display = 'flex';
            document.getElementById('client-info').style.display = 'block';
            window.location.href = `/admin.html?phone=${phoneNumber}&name=${encodeURIComponent(userData.Name)}`;
        } else {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Cuenta no encontrada';
            document.getElementById('client-info').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking phone number:', error);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
        document.getElementById('client-info').style.display = 'none';
    }
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

async function displayServiceHistory(phoneNumber) {
    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const serviceHistoryDiv = document.getElementById('service-history');
            serviceHistoryDiv.innerHTML = '';
            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(service => {
                    serviceHistoryDiv.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
                });
            } else {
                serviceHistoryDiv.innerHTML = '<p>No service records found.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching service history:', error);
    }
}

document.querySelector('.tab-button[onclick="showTab(\'add-points\')"]').addEventListener('click', () => {
    document.getElementById('add-points').style.display = 'block';
    document.querySelector('.tabs').style.display = 'flex';
    document.getElementById('service-history').style.display = 'none';
});

document.querySelector('.tab-button[onclick="showTab(\'service-history\')"]').addEventListener('click', () => {
    document.getElementById('service-history').style.display = 'block';
    document.querySelector('.tabs').style.display = 'flex';
    document.getElementById('add-points').style.display = 'none';
});

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const date = new Date().toLocaleDateString('en-GB');

    console.log(`Adding service: ${service} for phone number: ${phoneNumber} on date: ${date}`);

    try {
        const userDocRef = doc(db, "users", phoneNumber);
        console.log('Document reference:', userDocRef);

        await updateDoc(userDocRef, {
            services: arrayUnion({ date, type: service })
        });
        console.log('Service added to Firestore');

        alert('Service added successfully');
        displayServiceHistory(phoneNumber);

        showTab('service-history');
        document.querySelector('.tabs').style.display = 'flex';
        document.getElementById('add-points').style.display = 'none';
    } catch (error) {
        console.error('Error adding service:', error);
    }
});

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');
    if (phoneNumber) {
        document.querySelector('.numero').style.display = 'none';
        document.querySelector('.tabs').style.display = 'flex';
        document.getElementById('client-info').style.display = 'block';
        displayServiceHistory(phoneNumber);
    }
};
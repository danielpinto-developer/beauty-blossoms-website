// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const services = {
                Eyelashes: userData.services.filter(service => service.type === "Eyelashes").length,
                Nails: userData.services.filter(service => service.type === "Nails").length,
                Pedicure: userData.services.filter(service => service.type === "Pedicure").length,
                Retouches: userData.services.filter(service => service.type === "Retouches").length
            };

            updateGrid('eyelashes-boxes', services.Eyelashes);
            updateGrid('nails-boxes', services.Nails);
            updateGrid('pedicure-boxes', services.Pedicure);
            updateGrid('retouches-boxes', services.Retouches);

            checkForDiscounts(services);
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

function updateGrid(elementId, count) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.backgroundColor = i < count ? 'green' : 'grey';
        container.appendChild(box);
    }
}

function checkForDiscounts(services) {
    let discountMessage = '';
    if (services.Eyelashes >= 5) discountMessage += '<p>Congrats, schedule your next Eyelashes appointment to receive your 20% discount.</p>';
    if (services.Nails >= 5) discountMessage += '<p>Congrats, schedule your next Nails appointment to receive your 20% discount.</p>';
    if (services.Pedicure >= 5) discountMessage += '<p>Congrats, schedule your next Pedicure appointment to receive your 20% discount.</p>';
    if (services.Retouches >= 5) discountMessage += '<p>Congrats, schedule your next Retouches appointment to receive your 30% discount.</p>';

    document.getElementById('discount-message').innerHTML = discountMessage;
}

window.onload = displayClientInfo;
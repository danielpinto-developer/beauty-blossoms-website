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
            displayGrid(userData.services);
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

function displayGrid(services) {
    const serviceCounts = {
        Eyelashes: services.filter(service => service.type === "Eyelashes").length,
        Nails: services.filter(service => service.type === "Nails").length,
        Pedicure: services.filter(service => service.type === "Pedicure").length,
        Retouches: services.filter(service => service.type === "Retouches").length
    };

    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = `
        <div class="row">
            <div class="label">Eyelashes</div>
            ${createBoxes(serviceCounts.Eyelashes, 5)}
            <div class="label">20%</div>
        </div>
        <div class="row">
            <div class="label">Nails</div>
            ${createBoxes(serviceCounts.Nails, 5)}
            <div class="label">20%</div>
        </div>
        <div class="row">
            <div class="label">Pedicure</div>
            ${createBoxes(serviceCounts.Pedicure, 5)}
            <div class="label">20%</div>
        </div>
        <div class="row">
            <div class="label">Retouches</div>
            ${createBoxes(serviceCounts.Retouches, 5)}
            <div class="label">30%</div>
        </div>
    `;

    checkDiscountEligibility(serviceCounts);
}

function createBoxes(filled, total) {
    let boxes = '';
    for (let i = 0; i < filled; i++) {
        boxes += '<div class="box filled"></div>';
    }
    for (let i = filled; i < total; i++) {
        boxes += '<div class="box"></div>';
    }
    return boxes;
}

function checkDiscountEligibility(serviceCounts) {
    const discountMessage = document.getElementById('discount-message');
    discountMessage.style.display = 'none';

    if (serviceCounts.Eyelashes >= 5 || serviceCounts.Nails >= 5 || serviceCounts.Pedicure >= 5 || serviceCounts.Retouches >= 5) {
        discountMessage.style.display = 'block';
    }
}

window.onload = displayClientInfo;
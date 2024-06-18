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

window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    const name = urlParams.get('name');
    displayClientInfo(phoneNumber, name);
};

async function displayClientInfo(phoneNumber, name) {
    const clientInfoDiv = document.getElementById('client-info');
    clientInfoDiv.innerHTML = `<p>Phone: ${phoneNumber}</p><p>Name: ${name}</p>`;

    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = `
        <div class="grid-row">
            <div class="service-label">Eyelashes</div>
            ${generateGrid('Eyelashes')}
            <div class="service-discount">20%</div>
        </div>
        <div class="grid-row">
            <div class="service-label">Nails</div>
            ${generateGrid('Nails')}
            <div class="service-discount">20%</div>
        </div>
        <div class="grid-row">
            <div class="service-label">Pedicure</div>
            ${generateGrid('Pedicure')}
            <div class="service-discount">20%</div>
        </div>
        <div class="grid-row">
            <div class="service-label">Retouches</div>
            ${generateGrid('Retouches')}
            <div class="service-discount">30%</div>
        </div>
    `;

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            updateGrid(userData.services);
            checkDiscountEligibility(userData.services);
        } else {
            console.error('No such document!');
        }
    } catch (error) {
        console.error('Error fetching document:', error);
    }
}

function generateGrid(service) {
    return Array(5).fill().map((_, i) => `<div class="grid-box" data-service="${service}" data-index="${i}"></div>`).join('');
}

function updateGrid(services) {
    const serviceCount = {
        Eyelashes: 0,
        Nails: 0,
        Pedicure: 0,
        Retouches: 0
    };

    services.forEach(service => {
        serviceCount[service.type]++;
    });

    Object.keys(serviceCount).forEach(service => {
        for (let i = 0; i < serviceCount[service]; i++) {
            document.querySelector(`.grid-box[data-service="${service}"][data-index="${i}"]`).classList.add('filled');
        }
    });
}

function checkDiscountEligibility(services) {
    const serviceCount = {
        Eyelashes: 0,
        Nails: 0,
        Pedicure: 0,
        Retouches: 0
    };

    services.forEach(service => {
        serviceCount[service.type]++;
    });

    Object.keys(serviceCount).forEach(service => {
        if (serviceCount[service] >= 5) {
            const discountMessage = document.getElementById('discount-message');
            discountMessage.style.display = 'block';
            discountMessage.textContent = `Congrats, schedule your next appointment to receive your discount for ${service}!`;
        }
    });
}
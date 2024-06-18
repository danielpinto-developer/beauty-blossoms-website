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

    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = `
        <div class="service-row">
            <div class="service-label">Eyelashes</div>
            <div class="service-boxes" data-service="Eyelashes">${generateBoxes(0)}</div>
            <div class="service-discount">20%</div>
        </div>
        <div class="service-row">
            <div class="service-label">Nails</div>
            <div class="service-boxes" data-service="Nails">${generateBoxes(0)}</div>
            <div class="service-discount">20%</div>
        </div>
        <div class="service-row">
            <div class="service-label">Pedicure</div>
            <div class="service-boxes" data-service="Pedicure">${generateBoxes(0)}</div>
            <div class="service-discount">20%</div>
        </div>
        <div class="service-row">
            <div class="service-label">Retouches</div>
            <div class="service-boxes" data-service="Retouches">${generateBoxes(0)}</div>
            <div class="service-discount">30%</div>
        </div>
    `;

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.services && userData.services.length > 0) {
                const serviceCounts = {
                    Eyelashes: 0,
                    Nails: 0,
                    Pedicure: 0,
                    Retouches: 0,
                };
                userData.services.forEach(service => {
                    if (serviceCounts[service.type] !== undefined) {
                        serviceCounts[service.type]++;
                    }
                });
                for (const serviceType in serviceCounts) {
                    const serviceBoxes = document.querySelector(`.service-boxes[data-service="${serviceType}"]`);
                    serviceBoxes.innerHTML = generateBoxes(serviceCounts[serviceType]);
                }
            }
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

function generateBoxes(filledCount) {
    let boxesHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < filledCount) {
            boxesHTML += '<div class="box completed"></div>';
        } else {
            boxesHTML += '<div class="box"></div>';
        }
    }
    return boxesHTML;
}

window.onload = displayClientInfo;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4eMq0Y8ERerdBIzsySqtG9QnisI3CBIc",
    authDomain: "bb27studio-loyalty-program.firebaseapp.com",
    projectId: "bb27studio-loyalty-program",
    storageBucket: "bb27studio-loyalty-program.appspot.com",
    messagingSenderId: "827670961717",
    appId: "1:827670961717:web:9e7b9d33ddd047dfcc9b7c",
    measurementId: "G-Y30PX1R10P"
};

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
            const servicesCount = {
                Eyelashes: 0,
                Nails: 0,
                Pedicure: 0,
                Retouches: 0
            };

            userData.services.forEach(service => {
                servicesCount[service.type]++;
            });

            const gridContainer = document.getElementById('grid-container');
            gridContainer.innerHTML = `
                <div class="service-row">
                    <span>Eyelashes</span>
                    ${generateBoxes(servicesCount.Eyelashes)}
                    <span>20%</span>
                </div>
                <div class="service-row">
                    <span>Nails</span>
                    ${generateBoxes(servicesCount.Nails)}
                    <span>20%</span>
                </div>
                <div class="service-row">
                    <span>Pedicure</span>
                    ${generateBoxes(servicesCount.Pedicure)}
                    <span>20%</span>
                </div>
                <div class="service-row">
                    <span>Retouches</span>
                    ${generateBoxes(servicesCount.Retouches)}
                    <span>30%</span>
                </div>
            `;

            checkForDiscounts(servicesCount);
        } else {
            document.getElementById('client-info').innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        document.getElementById('client-info').innerHTML = '<p>Error fetching records.</p>';
    }
}

function generateBoxes(count) {
    let boxes = '';
    for (let i = 0; i < 5; i++) {
        boxes += `<div class="box ${i < count ? 'green' : 'grey'}"></div>`;
    }
    return boxes;
}

function checkForDiscounts(servicesCount) {
    const discountMessage = document.getElementById('discount-message');
    discountMessage.style.display = 'none';
    discountMessage.innerHTML = '';

    Object.keys(servicesCount).forEach(service => {
        if (servicesCount[service] >= 5) {
            discountMessage.style.display = 'block';
            discountMessage.innerHTML = 'Congrats, schedule your next appointment to receive your discount!';
        }
    });
}

window.onload = displayClientInfo;
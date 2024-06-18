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
            const services = userData.services;

            const serviceTypes = ['Eyelashes', 'Nails', 'Pedicure', 'Retouches'];
            const serviceCount = {};

            serviceTypes.forEach(service => {
                serviceCount[service] = services.filter(s => s.type === service && !s.redeemed).length;
            });

            const gridDiv = document.getElementById('grid');
            gridDiv.innerHTML = '';

            serviceTypes.forEach(service => {
                let row = `<div class="grid-row">
                    <span>${service}</span>`;
                for (let i = 0; i < 5; i++) {
                    if (i < serviceCount[service]) {
                        row += `<div class="grid-box filled"></div>`;
                    } else {
                        row += `<div class="grid-box empty"></div>`;
                    }
                }
                row += `<span>${service === 'Retouches' ? '30%' : '20%'}</span></div>`;
                gridDiv.innerHTML += row;
            });

            const discountMessage = document.getElementById('discount-message');
            discountMessage.style.display = serviceTypes.some(service => serviceCount[service] >= 5) ? 'block' : 'none';
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

window.onload = displayClientInfo;
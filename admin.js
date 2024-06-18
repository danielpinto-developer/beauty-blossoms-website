import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

document.getElementById('buscarButton').addEventListener('click', async () => {
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
            window.history.pushState({}, '', `/admin.html?phone=${phoneNumber}&name=${encodeURIComponent(userData.Name)}`);
            displayClientInfo(phoneNumber);
        } else {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Cuenta no encontrada';
        }
    } catch (e) {
        console.error("Error fetching document: ", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
    }
});

async function displayClientInfo(phoneNumber) {
    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        const clientInfoDiv = document.getElementById('previous-section');
        clientInfoDiv.innerHTML = '';

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(entry => {
                    clientInfoDiv.innerHTML += `<p>Date: ${entry.date} - Service: ${entry.type}</p>`;
                });
            } else {
                clientInfoDiv.innerHTML = '<p>No records found.</p>';
            }
        } else {
            clientInfoDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        clientInfoDiv.innerHTML = '<p>Error fetching records.</p>';
    }
}

document.getElementById('showPreviousButton').addEventListener('click', () => {
    document.getElementById('previous-section').style.display = 'block';
    document.getElementById('add-points-section').style.display = 'none';
    document.getElementById('discounts-section').style.display = 'none';
});

document.getElementById('showAddPointsButton').addEventListener('click', () => {
    document.getElementById('previous-section').style.display = 'none';
    document.getElementById('add-points-section').style.display = 'block';
    document.getElementById('discounts-section').style.display = 'none';
});

document.getElementById('showDiscountsButton').addEventListener('click', () => {
    document.getElementById('previous-section').style.display = 'none';
    document.getElementById('add-points-section').style.display = 'none';
    document.getElementById('discounts-section').style.display = 'block';
    displayDiscounts();
});

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB');

    try {
        await updateDoc(doc(db, "users", phoneNumber), {
            services: arrayUnion({ date, type: service })
        });
        alert('Service added successfully!');
        displayClientInfo(phoneNumber);
    } catch (error) {
        console.error('Error updating Firestore:', error);
        alert('Error adding service');
    }
});

async function displayDiscounts() {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const discountsDiv = document.getElementById('discounts-section');
    discountsDiv.innerHTML = '';

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

            Object.keys(servicesCount).forEach(service => {
                if ((service !== 'Retouches' && servicesCount[service] >= 5) || (service === 'Retouches' && servicesCount[service] >= 5)) {
                    const serviceDiv = document.createElement('div');
                    serviceDiv.className = 'service-item';
                    serviceDiv.innerHTML = `<span>${service} Discount</span><button onclick="redeemDiscount('${service}')">Redeem</button>`;
                    discountsDiv.appendChild(serviceDiv);
                }
            });
        }
    } catch (error) {
        console.error('Error displaying discounts:', error);
    }
}

async function redeemDiscount(service) {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const services = userData.services.map(entry => {
                if (entry.type === service) {
                    entry.redeemed = true;
                }
                return entry;
            });

            await updateDoc(doc(db, "users", phoneNumber), { services });

            alert(`${service} discount redeemed!`);
            displayClientInfo(phoneNumber);
            displayDiscounts();
        }
    } catch (error) {
        console.error('Error redeeming discount:', error);
        alert('Error redeeming discount');
    }
}
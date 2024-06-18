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
            showTab('previous-section');
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
    showTab('previous-section');
});

document.getElementById('showAddPointsButton').addEventListener('click', () => {
    showTab('add-points-section');
});

document.getElementById('showDiscountsButton').addEventListener('click', () => {
    showTab('discounts-section');
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
        displayClientInfo(phoneNumber);
        alert('Service added successfully!');
        showTab('previous-section');
    } catch (error) {
        console.error('Error updating Firestore:', error);
        alert('Error adding service.');
    }
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

async function displayDiscounts() {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        const discountsDiv = document.getElementById('discounts-section');
        discountsDiv.innerHTML = '';

        if (userDoc.exists()) {
            const userData = userDoc.data();
            let hasDiscounts = false;
            ['Eyelashes', 'Nails', 'Pedicure', 'Retouches'].forEach(service => {
                const serviceCount = userData.services.filter(s => s.type === service).length;
                if (serviceCount >= 5) {
                    hasDiscounts = true;
                    discountsDiv.innerHTML += `
                        <div>
                            <span>${service} - ${service === 'Retouches' ? '30%' : '20%'} off</span>
                            <button onclick="redeemDiscount('${service}')">Redeem</button>
                        </div>
                    `;
                }
            });
            if (!hasDiscounts) {
                discountsDiv.innerHTML = '<p>No available discounts at the moment.</p>';
            }
        } else {
            discountsDiv.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying discounts:', error);
        document.getElementById('discounts-section').innerHTML = '<p>Error fetching discounts.</p>';
    }
}

async function redeemDiscount(service) {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    try {
        // Just simulate the redeem by showing an alert and not updating the database
        alert(`Discount for ${service} redeemed successfully!`);
        displayDiscounts();
        showTab('previous-section');
    } catch (error) {
        console.error('Error redeeming discount:', error);
        alert('Error redeeming discount.');
    }
}
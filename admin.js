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
        displayClientInfo(phoneNumber);
        alert("Service added successfully!");
        showTab('previous-section');
    } catch (error) {
        console.error('Error updating Firestore:', error);
        alert("Error adding service.");
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
            const servicesGrouped = groupServices(userData.services);

            let hasDiscounts = false;
            for (const [type, count] of Object.entries(servicesGrouped)) {
                if (count >= 5) {
                    hasDiscounts = true;
                    discountsDiv.innerHTML += `<p>${type} - <button onclick="redeemDiscount('${type}')">Redeem</button></p>`;
                }
            }

            if (!hasDiscounts) {
                discountsDiv.innerHTML = '<p>No available discounts at the moment.</p>';
            }
        } else {
            discountsDiv.innerHTML = '<p>No available discounts at the moment.</p>';
        }
    } catch (error) {
        console.error('Error displaying discounts:', error);
        discountsDiv.innerHTML = '<p>Error fetching discounts.</p>';
    }
}

async function redeemDiscount(type) {
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const userDocRef = doc(db, "users", phoneNumber);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedServices = userData.services.map(service => {
                if (service.type === type && !service.redeemed) {
                    return { ...service, redeemed: true };
                }
                return service;
            });

            await updateDoc(userDocRef, { services: updatedServices });
            displayDiscounts();
            alert(`${type} discount redeemed successfully!`);
        } else {
            console.error('Error redeeming discount: user document not found.');
            alert('Error redeeming discount.');
        }
    } catch (error) {
        console.error('Error redeeming discount:', error);
        alert('Error redeeming discount.');
    }
}

function groupServices(services) {
    return services.reduce((acc, service) => {
        if (!service.redeemed) {
            acc[service.type] = (acc[service.type] || 0) + 1;
        }
        return acc;
    }, {});
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}
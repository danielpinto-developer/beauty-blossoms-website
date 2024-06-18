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
    const numeroContainer = document.querySelector('.numero');
    const clientInfoContainer = document.getElementById('client-info');

    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            clientInfoContainer.style.display = 'block';
            messageElement.style.display = 'none';
            numeroContainer.style.display = 'none';
            window.location.href = `/admin.html?phone=${phoneNumber}&name=${encodeURIComponent(userData.Name)}`;
        } else {
            messageElement.style.display = 'block'; // Show message if account not found
            messageElement.textContent = 'Cuenta no encontrada';
            clientInfoContainer.style.display = 'none';
        }
    } catch (e) {
        console.error("Error checking account:", e);
        messageElement.style.display = 'block';
        messageElement.textContent = 'Error checking account';
        clientInfoContainer.style.display = 'none';
    }
});

document.getElementById('addServiceButton').addEventListener('click', async () => {
    const service = document.getElementById('service').value;
    const phoneNumber = new URLSearchParams(window.location.search).get('phone');
    const date = new Date().toLocaleDateString('en-GB'); // Get current date in dd/mm/yyyy format

    const docRef = doc(db, "users", phoneNumber);

    try {
        await updateDoc(docRef, {
            services: arrayUnion({ date, type: service })
        });
        alert('Service added successfully!');
        displayClientInfo(phoneNumber); // Refresh the service history
    } catch (error) {
        console.error('Error updating Firestore:', error);
        alert('Error adding service');
    }
});

document.getElementById('previousButton').addEventListener('click', () => {
    displayClientInfo(new URLSearchParams(window.location.search).get('phone'));
});

function displayClientInfo(phoneNumber) {
    getDoc(doc(db, "users", phoneNumber)).then(userDoc => {
        if (userDoc.exists()) {
            const clientInfoDiv = document.getElementById('client-info');
            const userData = userDoc.data();
            clientInfoDiv.innerHTML = `<p>Phone: ${phoneNumber}</p><p>Name: ${userData.Name}</p>`;
            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(service => {
                    clientInfoDiv.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
                });
            } else {
                clientInfoDiv.innerHTML += '<p>No service records found.</p>';
            }
        } else {
            document.getElementById('client-info').innerHTML = '<p>No records found.</p>';
        }
    }).catch(error => {
        console.error('Error fetching records:', error);
        document.getElementById('client-info').innerHTML = '<p>Error fetching records.</p>';
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phone');
    if (phoneNumber) {
        displayClientInfo(phoneNumber);
    }
};
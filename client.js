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

    const clientName = document.getElementById('client-name');
    clientName.textContent = `Client: ${name}`;

    const serviceGrid = document.getElementById('service-grid');
    serviceGrid.innerHTML = '';

    try {
        const userDoc = await getDoc(doc(db, "users", phoneNumber));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const services = { Eyelashes: 0, Nails: 0, Pedicure: 0, Retouches: 0 };
            if (userData.services && userData.services.length > 0) {
                userData.services.forEach(service => {
                    services[service.type]++;
                });
            }

            const serviceTypes = ["Eyelashes", "Nails", "Pedicure", "Retouches"];
            serviceTypes.forEach(serviceType => {
                const label = document.createElement('div');
                label.classList.add('grid-item', 'service-label');
                label.textContent = serviceType;
                serviceGrid.appendChild(label);

                for (let i = 0; i < 5; i++) {
                    const box = document.createElement('div');
                    box.classList.add('grid-item');
                    box.style.backgroundColor = i < services[serviceType] ? 'green' : 'grey';
                    serviceGrid.appendChild(box);
                }

                const discountLabel = document.createElement('div');
                discountLabel.classList.add('grid-item', 'discount-label');
                discountLabel.textContent = serviceType === "Retouches" ? "30%" : "20%";
                serviceGrid.appendChild(discountLabel);
            });
        } else {
            serviceGrid.innerHTML = '<p>No records found.</p>';
        }
    } catch (error) {
        console.error('Error displaying client info:', error);
        serviceGrid.innerHTML = '<p>Error fetching records.</p>';
    }
}

window.onload = displayClientInfo;
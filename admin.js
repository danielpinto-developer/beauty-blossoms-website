// Firebase configuration and initialization
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

async function checkPhoneNumber() {
  const phoneNumber = document.getElementById('phone-number').value;
  const messageElement = document.getElementById('message');

  if (!phoneNumber) {
    alert('Please enter a phone number');
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", phoneNumber));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('client-info').innerHTML = `
        <p>Phone Number: ${phoneNumber}</p>
        <p>Name: ${userData.Name}</p>
      `;
      document.querySelector('.numero').style.display = 'none';
      document.getElementById('client-info').style.display = 'block';
      messageElement.style.display = 'none';
    } else {
      messageElement.style.display = 'block';
      messageElement.textContent = 'Cuenta no encontrada';
    }
  } catch (error) {
    console.error('Error checking phone number:', error);
    messageElement.style.display = 'block';
    messageElement.textContent = 'Error checking account';
  }
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

async function addService() {
  const service = document.getElementById('service').value;
  const phoneNumber = new URLSearchParams(window.location.search).get('phone');
  const date = new Date().toLocaleDateString('en-GB');

  try {
    const docRef = doc(db, "users", phoneNumber);
    await updateDoc(docRef, {
      services: arrayUnion({ date, type: service })
    });
    alert('Service added successfully!');
    showTab('service-history');
    showPreviousServices(phoneNumber);
  } catch (error) {
    console.error('Error updating Firestore:', error);
  }
}

async function showPreviousServices(phoneNumber) {
  try {
    const userDoc = await getDoc(doc(db, "users", phoneNumber));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const serviceHistory = document.getElementById('service-history');
      serviceHistory.innerHTML = '';
      if (userData.services && userData.services.length > 0) {
        userData.services.forEach(service => {
          serviceHistory.innerHTML += `<p>Date: ${service.date} - Service: ${service.type}</p>`;
        });
      } else {
        serviceHistory.innerHTML = '<p>No service records found.</p>';
      }
    }
  } catch (error) {
    console.error('Error displaying service history:', error);
  }
}

document.getElementById('checkPhoneNumberButton').addEventListener('click', checkPhoneNumber);
document.getElementById('previousButton').addEventListener('click', () => {
  const phoneNumber = new URLSearchParams(window.location.search).get('phone');
  showTab('service-history');
  showPreviousServices(phoneNumber);
});
document.getElementById('addPointsButton').addEventListener('click', () => {
  showTab('add-points');
});
document.getElementById('addServiceButton').addEventListener('click', addService);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4eMq0Y8ERerdBIzsySqtG9QnisI3CBIc",
  authDomain: "bb27studio-loyalty-program.firebaseapp.com",
  projectId: "bb27studio-loyalty-program",
  storageBucket: "bb27studio-loyalty-program.appspot.com",
  messagingSenderId: "827670961717",
  appId: "1:827670961717:web:9e7b9d33ddd047dfcc9b7c",
  measurementId: "G-Y30PX1R10P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document
  .getElementById("checkPhoneNumberButton")
  .addEventListener("click", async () => {
    const phoneNumber = document.getElementById("phone-number").value;
    const messageElement = document.getElementById("message");
    const dataContainer = document.getElementById("dataContainer");

    if (!phoneNumber) {
      alert("Por favor, introduzca un número de teléfono");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", phoneNumber));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        messageElement.style.display = "none";
        window.location.href = `/client?phone=${phoneNumber}&name=${encodeURIComponent(
          userData.Name
        )}`;
      } else {
        messageElement.style.display = "block";
        messageElement.textContent = "Cuenta no encontrada";
        dataContainer.innerHTML = "";
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      messageElement.style.display = "block";
      messageElement.textContent = "Error en cuenta corriente";
      dataContainer.innerHTML = "";
    }
  });

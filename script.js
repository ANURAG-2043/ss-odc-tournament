import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRj7cMbeotzXYAsLkrvFyjiN9E8zb2on0",
  authDomain: "ss-odc-tournament.firebaseapp.com",
  projectId: "ss-odc-tournament",
  storageBucket: "ss-odc-tournament.firebasestorage.app",
  messagingSenderId: "79584920756",
  appId: "1:79584920756:web:651aecdf076c4af56dc3e1",
  measurementId: "G-HERRC8KC4J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const modal = document.getElementById("regModal");
const sportText = document.getElementById("selectedSportText");
const sportInput = document.getElementById("sportName");
const closeBtn = document.querySelector('.close-btn');
const cricketFields = document.getElementById("cricketFields");
const playerRoleInput = document.getElementById("playerRole");

// --- MODAL LOGIC ---

document.querySelectorAll('.card button').forEach(btn => {
    btn.onclick = function() {
        const sport = this.parentElement.querySelector('h3').innerText;
        sportText.innerText = sport;
        sportInput.value = sport;

        // Show/Hide Cricket specific fields
        if (sport === "Cricket") {
            cricketFields.style.display = "block";
            playerRoleInput.setAttribute("required", "true");
        } else {
            cricketFields.style.display = "none";
            playerRoleInput.removeAttribute("required");
        }

        modal.style.display = "block";
    }
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};

// --- FIREBASE SUBMISSION ---

document.getElementById('registrationForm').onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "Registering...";
    submitBtn.disabled = true;

    // Build the data object
    const registrationData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        team: document.getElementById('teamName').value,
        sport: sportInput.value,
        timestamp: new Date()
    };

    // Add role only if Cricket is selected
    if (sportInput.value === "Cricket") {
        registrationData.role = playerRoleInput.value;
    }

    try {
        await addDoc(collection(db, "registrations"), registrationData);
        alert(`Success! You are registered for ${sportInput.value}.`);
        modal.style.display = "none";
        e.target.reset();
    } catch (error) {
        console.error("Error saving data: ", error);
        alert("Registration failed. Check your Firebase Rules!");
    } finally {
        submitBtn.innerText = "Confirm Registration";
        submitBtn.disabled = false;
    }
};

// --- BACKGROUND ANIMATION ---

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('svg-container');
    const icons = ['🏏', '⚽', '🏸', '🏐', '🏓', '🏆'];
    
    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.classList.add('floating-svg');
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 10 + 10) + 's';
        span.style.animationDelay = Math.random() * 5 + 's';
        span.style.fontSize = (Math.random() * 20 + 20) + 'px';
        span.innerText = icons[Math.floor(Math.random() * icons.length)];
        container.appendChild(span);
    }
});
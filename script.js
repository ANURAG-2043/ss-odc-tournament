// Import Firebase SDK Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    increment, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRj7cMbeotzXYAsLkrvFyjiN9E8zb2on0",
    authDomain: "ss-odc-tournament.firebaseapp.com",
    projectId: "ss-odc-tournament",
    storageBucket: "ss-odc-tournament.firebasestorage.app",
    messagingSenderId: "79584920756",
    appId: "1:79584920756:web:651aecdf076c4af56dc3e1",
    measurementId: "G-HERRC8KC4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- DOM ELEMENTS ---
const modal = document.getElementById("regModal");
const sportText = document.getElementById("selectedSportText");
const sportInput = document.getElementById("sportName");
const closeBtn = document.querySelector('.close-btn');
const cricketFields = document.getElementById("cricketFields");
const playerRoleInput = document.getElementById("playerRole");
const hypeBtn = document.getElementById("hypeBtn");
const hypeCountDisplay = document.getElementById("hypeCount");

// --- REAL-TIME HYPE COUNTER ---

// Reference to the 'hype' document in the 'stats' collection
const hypeDocRef = doc(db, "stats", "hype");

// Listen for updates
onSnapshot(hypeDocRef, (snapshot) => {
    if (snapshot.exists()) {
        console.log("Current Hype Data:", snapshot.data());
        document.getElementById("hypeCount").innerText = snapshot.data().count || 0;
    } else {
        console.error("The document 'stats/hype' does not exist in Firestore!");
    }
});

// Update on click
document.getElementById("hypeBtn").onclick = async () => {
    console.log("Hype button clicked!");
    try {
        await updateDoc(hypeDocRef, {
            count: increment(1)
        });
        console.log("Count successfully increased in Firebase!");
    } catch (error) {
        console.error("Error updating count:", error);
        alert("Firebase Error: Make sure you created the 'stats/hype' document!");
    }
};

// --- MODAL & REGISTRATION LOGIC ---

// Open Modal when a sport card button is clicked
document.querySelectorAll('.card button').forEach(btn => {
    btn.onclick = function() {
        const sport = this.parentElement.querySelector('h3').innerText;
        sportText.innerText = sport;
        sportInput.value = sport;

        // Dynamic Field: Show role selection only for Cricket
        if (sport === "Cricket") {
            cricketFields.style.display = "block";
            playerRoleInput.setAttribute("required", "true");
        } else {
            cricketFields.style.display = "none";
            playerRoleInput.removeAttribute("required");
        }

        modal.style.display = "block";
    };
});

// Close Modal logic
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};

// Submit Form to Firebase Firestore
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

    // Include role only if the sport is Cricket
    if (sportInput.value === "Cricket") {
        registrationData.role = playerRoleInput.value;
    }

    try {
        await addDoc(collection(db, "registrations"), registrationData);
        alert(`Success! You are registered for ${sportInput.value}.`);
        modal.style.display = "none";
        e.target.reset();
    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please check your internet or Firebase permissions.");
    } finally {
        submitBtn.innerText = "Confirm Registration";
        submitBtn.disabled = false;
    }
};

// --- BACKGROUND ANIMATION ---

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('svg-container');
    const icons = ['🏏', '⚽', '🏸', '🏐', '🏓', '🏆', '👟'];
    
    // Generate floating icons
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.classList.add('floating-svg');
        
        // Randomize placement and animation
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 12 + 8) + 's';
        span.style.animationDelay = Math.random() * 5 + 's';
        span.style.fontSize = (Math.random() * 15 + 20) + 'px';
        
        span.innerText = icons[Math.floor(Math.random() * icons.length)];
        container.appendChild(span);
    }
});

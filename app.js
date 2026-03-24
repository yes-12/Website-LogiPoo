import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

// Link the HTML button to the function
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.onclick = login;
}

async function login() {
    console.log("Login attempt started...");
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in:", result.user.displayName);
        
        // Update the UI
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = result.user.displayName;
    } catch (error) {
        console.error("Login error details:", error);
        alert("Login failed: " + error.message);
    }
}

// Optional: Add Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        signOut(auth).then(() => location.reload());
    };
}

// This is the "Magic Watcher"
window.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. User:", user ? user.displayName : "None");

        if (user) {
            // Logged In State
            loginBtn.style.display = 'none';
            userInfo.style.display = 'block';
            userName.innerText = user.displayName;
        } else {
            // Logged Out State
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
        }
        
        // Final safety check: make sure the container is visible
        authSection.style.opacity = '1';
    });
});
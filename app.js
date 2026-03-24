import { signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, update the UI
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName;
    } else {
        // No user is signed in
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }
});
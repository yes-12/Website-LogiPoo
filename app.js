// 1. Imports (Only one of each!)
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

const provider = new GoogleAuthProvider();

// 2. Run everything after the HTML loads
window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    console.log("System Check: Script Active");

    // Handle Login Click
    if (loginBtn) {
        loginBtn.onclick = async () => {
            console.log("Button clicked: Starting Google Sign-In");
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error("Sign-in error:", error);
                alert("Login failed. Check the console (F12) for details.");
            }
        };
    }

    // Handle Logout Click
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            signOut(auth).then(() => {
                console.log("Signed out");
                location.reload();
            });
        };
    }

    // 3. The "Watcher" - This updates the UI automatically
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Logged in as:", user.displayName);
            loginBtn.style.display = 'none';
            userInfo.style.display = 'inline-block';
            userName.innerText = user.displayName;
        } else {
            console.log("No user session found.");
            loginBtn.style.display = 'inline-block';
            userInfo.style.display = 'none';
        }
    });
});
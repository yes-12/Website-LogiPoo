// 1. Only import the "Logic" functions from the CDN
import { signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 2. Import the "initialized" objects from your own config file
import { auth, db } from './firebase-config.js';

const provider = new GoogleAuthProvider();

// Connect the button in index.html to this function
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.onclick = login;
}

async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Welcome,", user.displayName);
        
        // Update UI
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').innerText = user.displayName;
    } catch (error) {
        console.error("Login failed:", error.message);
    }
}

// Logout Logic
document.getElementById('logout-btn').onclick = () => {
    signOut(auth).then(() => {
        location.reload(); // Refresh page on logout
    });
};

async function saveRating(projectId, score) {
    const user = auth.currentUser;
    if (!user) return alert("Please sign in to rate!");

    await setDoc(doc(db, "ratings", projectId), {
        userId: user.uid,
        userName: user.displayName,
        rating: score,
        timestamp: new Date()
    }, { merge: true });
    
    alert("Rating saved!");
}
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

const provider = new GoogleAuthProvider();

window.addEventListener('DOMContentLoaded', () => {

    // --- SEARCH FILTER LOGIC ---
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            projectCards.forEach(card => {
                // Get the title and description text
                const title = card.querySelector('h3').innerText.toLowerCase();
                const description = card.querySelector('p').innerText.toLowerCase();
                const tags = card.querySelector('.tags')?.innerText.toLowerCase() || "";

                // Check if query exists in any of those
                if (title.includes(query) || description.includes(query) || tags.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const reviewForm = document.getElementById('review-form-container');
    const loginPrompt = document.getElementById('login-to-review');

    // 1. Handle Login/Logout clicks
    if (loginBtn) {
        loginBtn.onclick = () => signInWithPopup(auth, provider);
    }
    if (logoutBtn) {
        logoutBtn.onclick = () => signOut(auth).then(() => location.reload());
    }

    // 2. The Watcher - This updates the UI on BOTH pages
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'inline-block';
                userName.innerText = user.displayName;
            }
            if (reviewForm) reviewForm.style.display = 'block';
            if (loginPrompt) loginPrompt.style.display = 'none';
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userInfo) userInfo.style.display = 'none';
            if (reviewForm) reviewForm.style.display = 'none';
            if (loginPrompt) loginPrompt.style.display = 'block';
        }
    });

    // 3. Initialize Project Page Logic
    if (window.location.pathname.includes("taxes-game")) {
        loadReviews("taxes-game");
        
        const submitBtn = document.getElementById('submit-review');
        if (submitBtn) {
            submitBtn.onclick = () => {
                const text = document.getElementById('review-text').value;
                if (text) postReview("taxes-game", text);
            };
        }
    }
});

// --- HELPER FUNCTIONS ---
async function postReview(projectId, text) {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in!");
    try {
        await addDoc(collection(db, "reviews"), {
            projectId: projectId,
            uid: user.uid,
            userName: user.displayName,
            text: text,
            timestamp: new Date()
        });
        document.getElementById('review-text').value = ""; 
    } catch (e) { console.error("Error adding review: ", e); }
}

function loadReviews(projectId) {
    const reviewsDisplay = document.getElementById('reviews-display');
    if (!reviewsDisplay) return;

    const q = query(
        collection(db, "reviews"), 
        where("projectId", "==", projectId),
        orderBy("timestamp", "desc")
    );

    onSnapshot(q, (snapshot) => {
        reviewsDisplay.innerHTML = ""; 
        snapshot.forEach((doc) => {
            const data = doc.data();
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review-card';
            // Safety check for timestamp to prevent crashes
            const dateStr = data.timestamp?.toDate ? data.timestamp.toDate().toLocaleDateString() : "Just now";
            
            reviewDiv.innerHTML = `
                <strong>${data.userName}</strong>
                <p>${data.text}</p>
                <small>${dateStr}</small>
                <hr>
            `;
            reviewsDisplay.appendChild(reviewDiv);
        });
        if (snapshot.empty) reviewsDisplay.innerHTML = "<p>No reviews yet. Be the first!</p>";
    });
}
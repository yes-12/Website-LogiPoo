import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

// This function launches the Google login window
async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Welcome,", user.displayName);
    } catch (error) {
        console.error("Login failed:", error.message);
    }
}

async function saveRating(projectId, score) {
    const user = auth.currentUser;
    if (!user) return alert("Please sign in to rate!");

    // Save to Firestore: "ratings" collection -> "project_id" document
    await setDoc(doc(db, "ratings", projectId), {
        userId: user.uid,
        rating: score,
        timestamp: new Date()
    }, { merge: true });
    
    alert("Rating saved!");
}
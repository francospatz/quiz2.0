import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsVLa4Vcl_HpP7pniixu--ZJ25UsjuJ38",
    authDomain: "quiz20-a09b1.firebaseapp.com",
    projectId: "quiz20-a09b1",
    storageBucket: "quiz20-a09b1.appspot.com",
    messagingSenderId: "830157734041",
    appId: "1:830157734041:web:b4d6e3c19d0ad0d5327808"
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();

async function login () {
    signInWithPopup(auth, provider)
        .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        createUserFS(user);
        window.location.href="./pages/home.html";
        
        
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
    await setPersistence(auth, browserLocalPersistence);
}

// Crea el usuario en Firestore (o no)
async function createUserFS (user) {
    const docData = {
        displayName: user.displayName,
        email: user.email
    }
    await setDoc(doc(db, "users", user.uid), docData);
}

// Función para logout
async function logout () {
    signOut(auth).then(() => {
        window.location.href="/index.html";
      }).catch((error) => {
        console.log(error)
      });
}

let gameScores = [];
let gameDates = [];

// Observador del estado de la sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
      let username = document.getElementById("username");
      if (username != null) {
        username.innerHTML = `${user.displayName}`;
      }
     
      let uid = user.uid;
      // ...
    } else {
        if (document.getElementById("username") != null) {
            let username = document.getElementById("username");
            username.innerHTML = "";
        }
        
    }
});

// Botón login
const googleLogin = document.getElementById("googleLogin");

if (googleLogin != null) {
    googleLogin.addEventListener("click", async () => {
        try {
            await login ();
        } catch (error) {
            console.log(error);
        }
    });
}

// Botón logout
const googleLogout = document.getElementById("googleLogout");

if (googleLogout != null) {
    googleLogout.addEventListener("click", async () => {
        try {
            await logout ();
        } catch (error) {
            console.log(error);
        }
    });
}

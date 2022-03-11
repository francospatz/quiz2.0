import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let today = "";

if (month < 10) {
    today = `${day}-0${month}-${year}`;
    console.log(`${day}-0${month}-${year}`);
} else {
    today = `${day}-${month}-${year}`;
    console.log(`${day}-${month}-${year}`);
}

let currentUserEmail;
// *****************************************************************************************************************************
async function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log(user);
            createUserFS(user);

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            console.log(errorCode);
        });
    await setPersistence(auth, browserLocalPersistence);

}
// *****************************************************************************************************************************
// Crea el usuario en Firestore si no existe todavía
let everyUser = [];
async function createUserFS(user) {
    const docData2 = {
        displayName: user.displayName,
        email: user.email,
        gameScore: [],
        dates: []
    }

    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach((u) => {
        everyUser.push(u.id);
    })
    console.log(everyUser);
    //console.log(allUsers);
    if (everyUser.includes(user.uid) == false) {
        await setDoc(doc(db, "users", user.uid), docData2);
    }
    window.location.href = "/pages/home.html";
}

// Función para logout
async function logout() {
    signOut(auth).then(() => {
        window.location.href = "/index.html";
    }).catch((error) => {
        console.log(error)
    });
}
// *****************************************************************************************************************************
// Observador del estado de la sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        let username = document.getElementById("username");
        if (username != null) {
            username.innerHTML = `${user.displayName}`;
        }
        currentUserEmail = user.email;
        console.log(currentUserEmail);

        printCanvas(auth.currentUser)

    } else {
        if (document.getElementById("username") != null) {
            let username = document.getElementById("username");
            username.innerHTML = "";
        }
    }
})

// Botón login
const googleLogin = document.getElementById("googleLogin");

if (googleLogin != null) {
    googleLogin.addEventListener("click", async () => {
        try {
            await login();
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
            await logout();
        } catch (error) {
            console.log(error);
        }
    });
}
// *****************************************************************************************************************************
// Gráfica
const canvas = document.getElementById("myChart");
async function printCanvas(currentUser) {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data().gameScore);
    console.log(docSnap.data().dates);

    const scores = docSnap.data().gameScore;
    const scoresFirst = ["Scores"];
    const scoresThen = scoresFirst.concat(scores);
    const dates = docSnap.data().dates;
    let indexOfScores = [];
    scores.forEach((e, i) => {
        //indexOfScores.push(`Attempt ${i + 1}`)
        indexOfScores.push(dates[i])
    })
    console.log(indexOfScores);

    if (indexOfScores.length < 5) {
        indexOfScores = ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"]
    }

    const footer = (tooltipItems) => {
        let datePoint;
        
        tooltipItems.forEach((e, i) => {
          datePoint = dates[i];

          i++;
        });
        return datePoint;
      };

    if (canvas != null) {

        const labels = indexOfScores;

        const data = {
            labels: labels,
            datasets: [{
                label: 'Score',
                backgroundColor: 'rgb(88, 29, 175)',
                borderColor: 'rgb(88, 29, 175)',
                data: scores,
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    
                },
                animations: {
                    tension: {
                      duration: 1000,
                      easing: 'linear',
                      from: 0.6,
                      to: 0,
                      loop: true
                    }
                  }
                /* elements: {
                    line: {
                        tension: 0.5
                    }
                } */,
                scales: {
                    y: {
                        suggestedMax: 10,
                        suggestedMin: 0
                    }
                }
            },
        };

        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    }
}




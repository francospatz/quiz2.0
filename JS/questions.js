import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsVLa4Vcl_HpP7pniixu--ZJ25UsjuJ38",
    authDomain: "quiz20-a09b1.firebaseapp.com",
    projectId: "quiz20-a09b1",
    storageBucket: "quiz20-a09b1.appspot.com",
    messagingSenderId: "830157734041",
    appId: "1:830157734041:web:b4d6e3c19d0ad0d5327808",
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore();

let quizForm = document.querySelector("#questions");
let options = document.querySelectorAll(".choices");
let label = document.querySelectorAll("label");
let enunciado = quizForm.querySelector("#enunciado");
const questions = [];
let currentUser;
let currentUserEmail;
let mensaje = document.querySelector(".mensaje")


let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let today;

if(month < 10){
    today = `${day}-0${month}-${year}`;
  console.log(`${day}-0${month}-${year}`);
}else{
    today = `${day}-${month}-${year}`;
  console.log(`${day}-${month}-${year}`);
}

let i = 0;
let correctas = 0;

async function getQuestions() {
    const reponse = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );
    const data = await reponse.json();
    const choice = await data.results.map((e) => {
        questions.push({
            cuestion: e.question,
            correcta: e.correct_answer,
            listQuest: [...e.incorrect_answers, e.correct_answer],
        });
    });
}
getQuestions().then(function () {
    let rand = [0, 1, 2, 3];
    function printitulo(inc) {
        enunciado.innerHTML = `${questions[inc].cuestion}`;
    }
    printitulo(i);
    function printoptions(inc) {
        rand.sort(function () {
            return Math.random() - 0.5;
        });
        label[0].innerHTML = `${questions[inc].listQuest[rand[0]]}`;
        label[1].innerHTML = `${questions[inc].listQuest[rand[1]]}`;
        label[2].innerHTML = `${questions[inc].listQuest[rand[2]]}`;
        label[3].innerHTML = `${questions[inc].listQuest[rand[3]]}`;
    }
    
    printoptions(i);
    quizForm.addEventListener("click", function (e) {
        e.preventDefault();
        i++;
        //console.log(questions[i].correcta);
        console.log(correctas);
        console.log("Esto tiene i ", i);
        if (i <= 9) {
            printitulo(i);
            printoptions(i);
        } else {
            // alert("Terminaste");
            message();
            getScores(auth.currentUser);
            //gamesArray(auth.currentUser);
        }
    });

    for (let i = 0; i < label.length; i++) {
        label[i].onclick = respuestas;
    }

    function respuestas() {
        for (let i = 0; i < 10; i++) {
            if (this.innerHTML == questions[i].correcta) {
                //alert("correcta");
                correctas++;
            }
        }
    }
});

// Actualizar el historial de partidas en firestore
async function getScores (user) {
    let datesArray = [];
    let gameScoreArray = [];

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    datesArray = docSnap.data().dates;
    datesArray.push(today);

    gameScoreArray = docSnap.data().gameScore;
    gameScoreArray.push(correctas);
    
    await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        dates: datesArray,
        gameScore: gameScoreArray
    })
}


function message() {
    const FScore = document.getElementById("finalScore");
    const msg = document.getElementById("msg")
    mensaje.style.display = "block";
    if (correctas<5) {
        msg.innerHTML="You Johnny 'Weak'"
        FScore.innerHTML = correctas + " /10";
    } else if (correctas>=5 && correctas <8) {
        msg.innerHTML="You 'Beyon' C "
        FScore.innerHTML = correctas + " /10";
    } else {
        msg.innerHTML="You 'The Rock' "
        FScore.innerHTML = correctas + " /10";
    }
 
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        let username = document.getElementById("username");
        let usuario = user;

        if (username != null) {
            username.innerHTML = `${user.displayName}`;
            currentUser = user;
            currentUserEmail = user.email;
            console.log(user.uid)
            console.log(currentUserEmail);
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

async function logout() {
    signOut(auth).then(() => {
        window.location.href = "/index.html";
    }).catch((error) => {
        console.log(error)
    });
}

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


// final score
function printScore (points) {
    const finalScore = document.getElementById("score");

    if (finalScore != null) {
        finalScore.innerHTML = points + "/10"
    }

}



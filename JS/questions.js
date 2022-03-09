import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
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
            alert("Terminaste");
            updateScore(correctas);
        }
    });
    for (let i = 0; i < label.length; i++) {
        label[i].onclick = respuestas;
    }
    function respuestas() {
        for (let i = 0; i < 10; i++) {
            if (this.innerHTML == questions[i].correcta) {
                alert("correcta");
                correctas++;
            }
        }
    }
});
/* 
async function updateScore (num) {
    const scoresRef = doc(db, "users", usuario, "gameScores");
    const scoresSnap = await getDocs(scoresRef);
    if (scoresSnap.exists()) {
        let data = scoresSnap.data();
        data.push(num);
        await setDoc(doc(scoresSnap)), {
            gameScores: data
        }
    }
    
}; */


let usuario;
onAuthStateChanged(auth, (user) => {
    if (user) {
        let username = document.getElementById("username");
        usuario = user;

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

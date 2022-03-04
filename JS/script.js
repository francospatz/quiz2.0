import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcvi4mG7jKGOdVFpVPkdXHZX39-EWIZ1M",
  authDomain: "quizauth-de8bf.firebaseapp.com",
  databaseURL:
    "https://quizauth-de8bf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizauth-de8bf",
  storageBucket: "quizauth-de8bf.appspot.com",
  messagingSenderId: "678292155420",
  appId: "1:678292155420:web:81fe5f7cea56a21f8683d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const db = getDatabase();

//Selector boton signUp


// *****************************************************************
// Validación de la contraseña

function checkEmail(email) {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return emailRegex.test(email);
}

function checkPassword(password) {
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

  //1. que incluya un carácter a-z
  //2. que incluya un carácter A-Z en cualquier posicion
  //3. que inlcuya un digito en cualquier posicion
  //4. que inlcuya un simbolo de los especificados
  //5. carácteres permitidos
  //6. longitud contraseña

  return passRegex.test(password);
}

const signUp = document.getElementById("form_SingUp");

if (signUp != null) {

    signUp.addEventListener("submit", (e) => {
        e.preventDefault();
      
        let usernameSignUp = document.getElementById("usernameSignUp").value;
        let emailSignUp = document.getElementById("emailSignUp").value;
        let passwordSignUp = document.getElementById("passwordSignUp").value;
        let passwordSignUp2 = document.getElementById("passwordSignUp2").value;
        
       
      //Valida password con pasword 2 y Regex y crea usuario si son válidos
        if (checkPassword(passwordSignUp) && checkEmail(emailSignUp) && passwordSignUp == passwordSignUp2) {
          createUserWithEmailAndPassword(auth, emailSignUp, passwordSignUp) //metodo importado, ver encabezado. Funcion asincrona
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              let userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
              let setWithMerge = userRef.set({
                  username: usernameSignUp,
                  email: emailSignUp
              }, {merge: true});

              alert("user created");
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorMessage);
            });
        } else if (passwordSignUp != passwordSignUp2) {
            alert("las contraseñas no coinciden");
        } else {
            alert("Introduzca email y/o contraseña válidos");
        }
      });
}
 


//Función para hacer log in
const logIn = document.getElementById("logIn-form");

if (logIn != null) {

    logIn.addEventListener("submit", (e) => {
        e.preventDefault();
        let emailLogIn = document.getElementById("emailLogIn").value;
        let passwordLogIn = document.getElementById("passwordLogIn").value;
      
        //metodo de Firebase para hacer log in
        signInWithEmailAndPassword(auth, emailLogIn, passwordLogIn)
          .then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            const date = new Date();
      
            update(ref(database, "users/" + user.uid), {//escribe en la BBDD
              last_login: date,
            });
      
            alert("User logged in!");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //alert(errorMessage);
          });
      });
}



const logOut = document.getElementById("logOut");

// **********************************************************
// LOG OUT

/* logOut.addEventListener("click", (e) => {
  e.preventDefault();

  signOut(auth)
    .then(() => {
      alert("Sign out successful");


    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}); */



// ************************************************************************

// Observador
/* onAuthStateChanged(auth, (currentUser) => {
  
  if (currentUser) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User


    //Si current user is true, indica la situación de login con border verde y vaciando inputs 
    logIn.style.border = "2px solid green";
    let emailLogIn = document.getElementById("emailLogIn");
    let passwordLogIn = document.getElementById("passwordLogIn");
    emailLogIn.value = "";
    passwordLogIn.value = "";
   

    // imprime el username de quien está logeado
    const userId = auth.currentUser.uid;
    return onValue(ref(db, '/users/' + userId), (snapshot) => {
    const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    document.getElementById("userLogged").innerHTML = "Usuario " + username;
    // ...
    }, {
     onlyOnce: true
    }); 
    

    
  } else {
    // User is signed out
    emailLogIn.value = "";
    passwordLogIn.value = "";
    logIn.style.border = "2px solid red";
    document.getElementById("userLogged").innerHTML = "Ningun usuario logado";

  }
}); */
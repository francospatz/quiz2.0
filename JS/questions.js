let quizForm = document.querySelector("#questions");
let options = document.querySelectorAll(".choices");
let label = quizForm.querySelectorAll("label");
let enunciado = quizForm.querySelector("#enunciado");

const questions = [];

async function validate() {
  for (let i = 0; i < 10; i++) {
    printQuestions(i);

    label.forEach((item) => {
      item.addEventListener("click", function () {
        console.log("funciona", item.innerHTML);
      });
    });

    console.log("Hace print de pregunta : ", i);
  }

  // for (let i ; i < options.length; i++){

  //     label[i].addEventListener("click", function () {
  //         console.log("corr : ",questions[i].correcta);
  //         if (label[i].innerHTML === questions[i].correcta) {
  //             console.log("correcto");
  //             // label[i].setAttribute("class", "correcta")
  //         } else {
  //             console.log("---------------------------------------");
  //             console.log("incorrecto:  ",label[i].innerHTML);
  //              console.log("esta es la correcta ",questions[i].correcta);
  //             // label[i].setAttribute("class", "incorrecta")
  //         }
  //     })
  // }

  // console.log("esta a la espera de una eleccion");
}

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
  console.log("pimero entra aqui en getQuestions");
  //destructurin del objeto, nos cojemos de choices lo que queremos y lo ponemos en un nuevo array
}

async function printQuestions(inc) {
  for (let i = inc; i < questions.length; i++) {
    enunciado.innerText = `${questions[i].cuestion}`;
    for (let j = 0; j < label.length; j++) {
      label[j].innerText = `${questions[i].listQuest[j]}`;
      console.log(" label", questions[i].listQuest[j]);
    }
  }
}

const priority = async () => {
  await getQuestions();
  await printQuestions();
  await validate();
};
priority();

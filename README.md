# quiz2.0

Autentificación con firebase auth

Al hacer login se almacena en firestore bajo el id del auth el nombre, email, y, si es la primera vez que se hace login en la aplicación, se almacenan también gameScore = [] y dates = [].

Una vez logeado, se enseña en pantalla la página home, que incluye una gráfica con el historial de partidas, un mensaje de bienvenida y un botón que redirige al propio quiz.
La gráfica no mostrará la fecha hasta que se hayan jugado 5 partidas.

Al finalizar el Quiz, se almacena en firestore la puntuación conseguida y la fecha en la que se finalizó el quiz (en sus respectivos arrays contenidos en el user).


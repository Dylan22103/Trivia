const categoria = document.getElementById('categoria')
categoria.addEventListener('click', obtenerCategorias);

function obtenerCategorias() {
    const urlCategorias = "https://opentdb.com/api_category.php";
    
    fetch(urlCategorias)
        .then(response => response.json())
        .then(responseJSON => {
            const categorias = responseJSON.trivia_categories;
            mostrarCategorias(categorias);
        })
        .catch(error => console.log(error));
}

function mostrarCategorias(categorias) {
    const selectCategoria = document.getElementById('categoria');
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.textContent = categoria.name;
        option.value = categoria.id;
        selectCategoria.appendChild(option);
    });
}


function generarTrivia() {
    var categoriaId = categoria.options[categoria.selectedIndex].value;
    var dificultad = document.getElementById("dificultad").value;
    var tipoRespuesta = document.getElementById("tipo-respuesta").value;

    // Realizar una solicitud a la API para obtener las preguntas
    var url = "https://opentdb.com/api.php?amount=10&category=" + categoriaId + "&difficulty=" + dificultad + "&type=" + tipoRespuesta;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Lógica para mostrar las preguntas y respuestas en el contenedor de contenedorTrivia
            var contenedorTrivia = document.getElementById("contenedorTrivia");
            contenedorTrivia.innerHTML = "";

            var preguntas = data.results;
            preguntas.forEach(function (pregunta, indice) {
                var elementoPregunta = document.createElement("div");
                elementoPregunta.innerHTML = "<p><strong>Pregunta " + (indice + 1) + ":</strong> " + pregunta.question + "</p>";

                // Mostrar las posibles respuestas
                if (tipoRespuesta === "multiple") {
                    var respuestas = pregunta.incorrect_answers.concat(pregunta.correct_answer);
                    mezclarArray(respuestas);
                    respuestas.forEach(function (respuesta) {
    var elementoRespuesta = document.createElement("p");
    if (respuesta === pregunta.correct_answer) {
        elementoRespuesta.innerHTML = "<input type='radio' name='respuesta" + indice + "' class='respuesta-correcta'>" + respuesta;
    } else {
        elementoRespuesta.innerHTML = "<input type='radio' name='respuesta" + indice + "'>" + respuesta;
    }
    elementoPregunta.appendChild(elementoRespuesta);
});
                } else if (tipoRespuesta === "boolean") {
                    var elementoRespuestaVerdadero = document.createElement("p");
                    elementoRespuestaVerdadero.innerHTML = "<input type='radio' name='respuesta" + indice + "' value='True'>Verdadero";
                    elementoPregunta.appendChild(elementoRespuestaVerdadero);
                
                    var elementoRespuestaFalso = document.createElement("p");
                    elementoRespuestaFalso.innerHTML = "<input type='radio' name='respuesta" + indice + "' value='False'>Falso";
                    elementoPregunta.appendChild(elementoRespuestaFalso);
                }
                
                contenedorTrivia.appendChild(elementoPregunta);
            });

            // Mostrar el botón para obtener el puntaje final
            var botonPuntaje = document.createElement("button");
            botonPuntaje.innerHTML = "Obtener Puntaje Final";
            botonPuntaje.onclick = calcularPuntaje;
            contenedorTrivia.appendChild(botonPuntaje);
        })
        .catch(error => console.error(error));
}

function calcularPuntaje() {
    var contenedorTrivia = document.getElementById("contenedorTrivia");
    var preguntas = contenedorTrivia.getElementsByTagName("div");
    var puntaje = 0;

    for (var i = 0; i < preguntas.length; i++) {
        var respuestaSeleccionada = preguntas[i].querySelector("input:checked").value;

        // Verificar si la respuesta es correcta y aumentar el puntaje en consecuencia
        if (respuestaSeleccionada === preguntas[i].querySelector(".respuesta-correcta").textContent) {
            puntaje += 100;
        }
    }

    // Mostrar el puntaje final
    var elementoPuntaje = document.createElement("p");
    elementoPuntaje.innerHTML = "Puntaje Final: " + puntaje;
    contenedorTrivia.appendChild(elementoPuntaje);
}

// Función para mezclar los elementos de un array de forma aleatoria
function mezclarArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
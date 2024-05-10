
// Agregar eventos a los checkboxes de "Activo" en la tabla de controles automáticos

document.addEventListener("DOMContentLoaded", function () {
    // Event listener
    //document.getElementById("automaticButton").addEventListener("click", function() { showControl('automatic') });
    //document.getElementById("manualButton").addEventListener("click", function() { showControl('manual') });
    //document.getElementById("configButton").addEventListener("click", function() { showControl('config') });
    // Event listener for send button

});

//valida los checkbox de Activo en la pagina de automatico y habilita o deshabilita los time
document.querySelectorAll('input[type="checkbox"][id$="Activo"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        // Obtener el prefijo del ID del checkbox actual (ej. lunes, martes, etc.)
        var prefix = this.id.replace(/(.*?)Activo/, '$1');

        // Habilitar o deshabilitar los checkboxes de "Alarma" y los campos de hora correspondientes
        var alarmaCheckbox = document.getElementById(prefix + "Alarma");
        var horaInicioInput = document.getElementById(prefix + "Inicio");
        var horaFinInput = document.getElementById(prefix + "Fin");

        if (this.checked) {
            alarmaCheckbox.disabled = false;
            alarmaCheckbox.checked = true;
            horaInicioInput.disabled = false;
            horaFinInput.disabled = false;

        } else {
            alarmaCheckbox.disabled = true;
            alarmaCheckbox.checked = false;
            horaInicioInput.disabled = true;
            horaFinInput.disabled = true;
            horaInicioInput.value = "";
            horaFinInput.value = "";
        }
    });
});

// Función de inicio de sesión
function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Simulación de autenticación (reemplazar con lógica real)
    if (username === "" && password === "") {
        // Ocultar el formulario de inicio de sesión y mostrar los controles
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Ingreso exitoso",
            showConfirmButton: false,
            timer: 1500
        });
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("errorMessage").style.display = "none";
        document.getElementById("controls").style.display = "block";

    } else {
        // Mostrar un mensaje de error si las credenciales son incorrectas
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Por favor, verifique su usuario y contraseña",
            showConfirmButton: false,
            timer: 3000
        });
        // Limpiar campos si los datos son incorrectos
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        return;
    }
}

// Actualizar la posición del texto de la versión al hacer scroll
window.onscroll = function () {
    var version = document.querySelector('.version');
    var rect = version.getBoundingClientRect();
    var bottomOffset = window.innerHeight - rect.bottom;
    version.style.transform = "translateY(" + bottomOffset + "px)";
};

// Función para mostrar los controles automáticos
function showAutomatic() {
    // Obtener todos los checkboxes de "Activo" en la tabla de controles automáticos
    var activoCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="Activo"]');

    // Iterar sobre cada checkbox de "Activo"
    activoCheckboxes.forEach(function (checkbox) {
        // Obtener el prefijo del ID del checkbox actual (ej. lunes, martes, etc.)
        var prefix = checkbox.id.replace(/(.*?)Activo/, '$1');

        // Obtener los checkboxes de "Alarma" y los campos de hora correspondientes a esa fila
        var alarmaCheckbox = document.getElementById(prefix + "Alarma");
        var horaInicioInput = document.getElementById(prefix + "Inicio");
        var horaFinInput = document.getElementById(prefix + "Fin");

        // Deshabilitar los checkboxes de "Alarma" y los campos de hora si el checkbox de "Activo" está desactivado
        if (!checkbox.checked) {
            alarmaCheckbox.disabled = true;
            alarmaCheckbox.checked = false;
            horaInicioInput.disabled = true;
            horaFinInput.disabled = true;
        }
    });

    // Mostrar los controles automáticos y ocultar los manuales
    document.getElementById("automaticControls").style.display = "block";
    document.getElementById("manualControls").style.display = "none";
    document.getElementById("configMenu").style.display = "none";
    // Mostrar el botón "Enviar al ESP8266"
    document.querySelector(".sendButton").style.display = "block";

}
/*
// Función para enviar datos al ESP8266
function automaticoToESP() {
    // Lógica para enviar datos al ESP8266 aquí
    var matrizDatos = [];

    // Obtener todas las filas de la tabla de controles automáticos
    var filas = document.querySelectorAll('#automaticControls table tr');

    // Iterar sobre cada fila de la tabla
    for (var i = 1; i < filas.length; i++) {
        var fila = filas[i];
        var datosFila = [];

        // Obtener los checkboxes y campos de hora de la fila actual
        var checkboxAlarma = fila.querySelector('input[type="checkbox"][id$="Alarma"]');
        var checkboxActivo = fila.querySelector('input[type="checkbox"][id$="Activo"]');
        var horaInicio = fila.querySelector('input[type="time"][id$="Inicio"]').value;
        var horaFin = fila.querySelector('input[type="time"][id$="Fin"]').value;

        // Convertir las horas en objetos Date para compararlas
        var horaInicioDate = new Date('1970-01-01T' + horaInicio);
        var horaFinDate = new Date('1970-01-01T' + horaFin);

        // Almacenar los valores en la matriz
        datosFila.push(horaInicio);
        datosFila.push(horaFin);
        datosFila.push(checkboxAlarma.checked);
        datosFila.push(checkboxActivo.checked);

        // Agregar los datos de la fila a la matriz
        matrizDatos.push(datosFila);

        if (horaInicioDate >= horaFinDate) {
            event.preventDefault(); // Evita que se envíe el formulario

            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: "La hora de inicial debe ser inferior a la hora final.<br>Por favor, revisa el día <b>" + obtenerDiaSemana(i) + "</b> y vuelve a intentarlo",
            });
            return; // Detiene la ejecución del bucle y la función
        }

        // Agregar los datos de la fila a la matriz
        matrizDatos.push(datosFila);

    }

    // Imprimir la matriz en la consola para verificar
    console.log(matrizDatos);
    
    // Ejemplo de cómo enviar los datos utilizando fetch()
    fetch('http://127.0.0.1:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(matrizDatos)
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Datos enviados!",
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log('Datos enviados correctamente al servidor');
            } else {
                console.error('Error al enviar los datos al servidor');
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: "Tal parece que algo salió mal!<br> Revisa todo e inténtalo de nuevo.",
            });
            console.error('Error:', error);
        });
}*/
function automaticoToESP() {
    

    var matrizDatos = [];

    // Obtener todas las filas de la tabla de controles automáticos
    var filas = document.querySelectorAll('#automaticControls table tr');

    // Iterar sobre cada fila de la tabla
    for (var i = 1; i < filas.length; i++) {
        var fila = filas[i];
        var datosFila = [];

        // Obtener los checkboxes y campos de hora de la fila actual
        var checkboxAlarma = fila.querySelector('input[type="checkbox"][id$="Alarma"]');
        var checkboxActivo = fila.querySelector('input[type="checkbox"][id$="Activo"]');
        var horaInicio = fila.querySelector('input[type="time"][id$="Inicio"]').value;
        var horaFin = fila.querySelector('input[type="time"][id$="Fin"]').value;

        // Convertir las horas en objetos Date para compararlas
        var horaInicioDate = new Date('1970-01-01T' + horaInicio);
        var horaFinDate = new Date('1970-01-01T' + horaFin);

        if(checkboxActivo.checked){

            if(horaInicio=="" || horaFin==""){

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: "Se debe seleccionar la hora inicial y la hora final.<br>Por favor, revisa el día <b>" + obtenerDiaSemana(i) + "</b> y vuelve a intentarlo",
                });
                return; // Detiene la ejecución del bucle y la función
                
            } else if (horaInicioDate >= horaFinDate) {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: "La hora de inicio debe ser anterior a la hora de finalización.<br>Por favor, revisa el día <b>" + obtenerDiaSemana(i) + "</b> y vuelve a intentarlo",
                });
                return; // Detiene la ejecución del bucle y la función
            }
        }
        

        // Almacenar los valores en la matriz
        datosFila.push(horaInicio);
        datosFila.push(horaFin);
        datosFila.push(checkboxAlarma.checked);
        datosFila.push(checkboxActivo.checked);

        // Agregar los datos de la fila a la matriz
        matrizDatos.push(datosFila);
    }

    // Imprimir la matriz en la consola para verificar
    console.log(matrizDatos);
    
    // Ejemplo de cómo enviar los datos utilizando fetch()
    fetch('http://127.0.0.1:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(matrizDatos)
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Datos enviados!",
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log('Datos enviados correctamente al servidor');
            } else {
                console.error('Error al enviar los datos al servidor');
            }
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: "Tal parece que algo salió mal!<br> Revisa todo e inténtalo de nuevo.",
            });
            console.error('Error:', error);
        });
}

function obtenerDiaSemana(numeroDia) {
    switch (numeroDia) {
        
        case 1:
            return "Lunes";
        case 2:
            return "Martes";
        case 3:
            return "Miércoles";
        case 4:
            return "Jueves";
        case 5:
            return "Viernes";
        case 6:
            return "Sábado";
        case 7:
        return "Domingo";
        default:
            return "Número de día inválido";
    }
}

function mostrarMensajeExito() {
    /*Swal.fire({
      title: "Buen trabajo!",
      text: "¡Se envió con éxito los datos!",
      icon: "success"
    });*/
    Swal.fire({
        position: "center",
        icon: "success",
        title: "¡Se envió con éxito los datos!",
        showConfirmButton: false,
        timer: 3000
    });
}

// Función para mostrar los controles manuales
function showManual() {
    // Mostrar los controles manuales y ocultar los automáticos
    document.getElementById("manualControls").style.display = "block";
    document.getElementById("automaticControls").style.display = "none";
    document.getElementById("configMenu").style.display = "none";
    // Mostrar el botón "Enviar al ESP8266"
    document.querySelector(".sendButton").style.display = "block";
}

// Función para activar todos los relés
function activateAll() {
    // Activar todos los interruptores de los relés
    var relays = document.querySelectorAll('.switch input[type="checkbox"]');
    relays.forEach(function (relay) {
        relay.checked = true;
    });
}
// Función para desactivar todos los relés
function deactivateAll() {
    // Desactivar todos los interruptores de los relés
    var relays = document.querySelectorAll('.switch input[type="checkbox"]');
    relays.forEach(function (relay) {
        relay.checked = false;
    });
}
function manualToESP() {
    var datos = guardarDatosTablaEnMatrizManual();

    // Aquí puedes proceder a enviar la matriz de datos al ESP8266
    console.log(datos); // Solo para verificar en la consola
    // Lógica para enviar los datos al ESP8266
    mostrarMensajeExito();

}
function guardarDatosTablaEnMatrizManual() {
    var matrizDatos = [];

    // Obtener todos los checkboxes de los relés
    var checkboxes = document.querySelectorAll('#manualControls input[type="checkbox"]');

    // Iterar sobre cada checkbox
    checkboxes.forEach(function (checkbox) {

        // Agregar el dato a la matriz
        matrizDatos.push(checkbox.checked);
    });

    return matrizDatos;
}

function showConfig() {

    // Obtener todos los checkboxes de "Activo" en la tabla de controles automáticos
    var activoCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="Activo"]');

    // Iterar sobre cada checkbox de "Activo"
    activoCheckboxes.forEach(function (checkbox) {
        // Obtener el prefijo del ID del checkbox actual (ej. lunes, martes, etc.)
        var prefix = checkbox.id.replace(/(.*?)Activo/, '$1');

        // Obtener los checkboxes de "Alarma" y los campos de hora correspondientes a esa fila
        var alarmaCheckbox = document.getElementById(prefix + "Alarma");
        var horaInicioInput = document.getElementById(prefix + "Inicio");
        var horaFinInput = document.getElementById(prefix + "Fin");

        // Deshabilitar los checkboxes de "Alarma" y los campos de hora si el checkbox de "Activo" está desactivado
        if (!checkbox.checked) {
            alarmaCheckbox.disabled = true;
            alarmaCheckbox.checked = false;
            horaInicioInput.disabled = true;
            horaFinInput.disabled = true;
        }
    });
    // Mostrar el menú de configuración y ocultar los demás controles
    document.getElementById("manualControls").style.display = "none";
    document.getElementById("automaticControls").style.display = "none";
    document.getElementById("configMenu").style.display = "block";
    // Mostrar el botón "Enviar al ESP8266"
    document.querySelector(".sendButton").style.display = "block";
}

// Función para guardar los correos electrónicos y validar antes de guardar
function saveMailToESP() {
    if (validarCorreos()) {
        // Lógica para guardar los correos electrónicos en una matriz
        var correosGuardados = guardarCorreosEnMatriz();
        // Simulación de envío al ESP8266
        // Mostrar la matriz de correos en la consola para verificar
        console.log(correosGuardados);
        mostrarMensajeExito()
    }
}

// Función para validar los correos electrónicos
function validarCorreos() {
    var correosValidos = true;

    // Obtener los inputs de los correos electrónicos
    var inputsCorreos = document.querySelectorAll('#configMenu input[type="email"]');

    // Iterar sobre cada input
    inputsCorreos.forEach(function (input) {
        var correo = input.value.trim();
        if (correo !== '' && !correo.endsWith('@uao.edu.co')) {
            if (!correo.endsWith('@UAO.EDU.CO')) {

                correosValidos = false;

                Swal.fire({
                    title: "Oops!",
                    html: "Parece ser que ingresaste algo mal en <br><b>" + correo + "</b> inténtalo nuevamente",
                    icon: "error"
                });

                return;
            }
        }
    });

    return correosValidos;
}

// Función para guardar los correos electrónicos en una matriz
function guardarCorreosEnMatriz() {
    var correos = [];

    // Obtener los inputs de los correos electrónicos
    var inputsCorreos = document.querySelectorAll('#configMenu input[type="email"]');

    // Iterar sobre cada input y guardar el correo en la matriz
    inputsCorreos.forEach(function (input) {
        var correo = input.value.trim();
        if (correo !== '') {
            correos.push(correo);
        }

    });

    return correos;
}

// Función para activar todos los relés
function saveUserPassToESP() {
    // Activar todos los interruptores de los relés
    mostrarMensajeExito()
}

// Función para activar todos los relés
function saveAlarmaToESP() {
    // Activar todos los interruptores de los relés
    mostrarMensajeExito()
}

function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
function toggleDropdown(checkboxId, dropdownId) {
    var checkbox = document.getElementById(checkboxId);
    var dropdown = document.getElementById(dropdownId);

    if (checkbox.checked) {
        dropdown.disabled = false;
    } else {
        dropdown.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Obtener referencias a los checkboxes
    var alarma1Checkbox = document.getElementById('alarmaActiva1');
    var alarma2Checkbox = document.getElementById('alarmaActiva2');
    var alarma3Checkbox = document.getElementById('alarmaActiva3');

    // Agregar evento change a cada checkbox
    alarma1Checkbox.addEventListener('change', function () {
        if (this.checked) {
            console.log("Alarma 1 seleccionada");
            // Aquí puedes agregar cualquier acción que desees cuando se seleccione Alarma 1
            document.getElementById('alarmaActiva2').disabled = false;
            document.getElementById('alarmaActiva3').disabled = true;

        } else {
            horaAlarma1
            document.getElementById('alarmaActiva2').disabled = true;
            document.getElementById('alarmaActiva3').disabled = true;
            document.getElementById('alarmaActiva2').checked = false;
            document.getElementById('alarmaActiva3').checked = false;
            document.getElementById('horaAlarma2').disabled = true;
            document.getElementById('horaAlarma3').disabled = true;
        }
    });

    alarma2Checkbox.addEventListener('change', function () {
        if (this.checked) {
            console.log("Alarma 2 seleccionada");
            // Aquí puedes agregar cualquier acción que desees cuando se seleccione Alarma 2
            document.getElementById('alarmaActiva3').disabled = false;
        } else {
            document.getElementById('alarmaActiva3').disabled = true;
            document.getElementById('alarmaActiva3').checked = false;
            document.getElementById('horaAlarma3').disabled = true;
        }
    });

    alarma3Checkbox.addEventListener('change', function () {
        if (this.checked) {
            console.log("Alarma 3 seleccionada");
            // Aquí puedes agregar cualquier acción que desees cuando se seleccione Alarma 3
        }
    });
});

// Función para actualizar la hora actual
function updateTime() {
    document.getElementById('currentTime').innerHTML = getCurrentTime();
}

// Actualizar la hora cada segundo
setInterval(updateTime, 1000);
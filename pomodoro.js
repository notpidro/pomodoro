//color-tema
const preferedColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

//vinculo con elementos de HTML
const slider = document.querySelector("#slider-tema");
const sobrePomodoro = document.querySelector(".que-es-pomodoro");
const infoPomodoro = document.querySelector(".info-pomodoro")
let mostrarTiempo = document.querySelector(".mostrar-tiempo");
const btnSumarTiempo = document.querySelector(".mas");
const btnRestarTiempo = document.querySelector(".menos");
const continuar = document.querySelector(".continuar");
let empezar = document.querySelector(".empezar");
const pausa = document.querySelector(".pausa");
const reiniciar = document.querySelector(".reiniciar");
const circuloIndicador = document.querySelector(".circulo-indicador");
let mostrarDescansoCorto = document.querySelector(".tiempo-descanso-corto");
let mostrarDescansoLargo = document.querySelector(".tiempo-descanso-largo");
const cajaMasMenos = document.querySelector(".caja-masmenos");
let checkAlertaSonora = document.querySelector("#alerta-sonora");
const labelAlertaSonora = document.querySelector(".alerta-sonora");
let volumenAlerta = document.querySelector("#volumen-alerta-sonora");
const alertaUno = new Audio("audios/alerta01.mp3");
const alertaDos = new Audio("audios/alerta02.mp3");
const alertaTres = new Audio("audios/alerta03.mp3");
let descripcion = document.querySelector(".mostrar-descripcion");
let ventanaModal = document.querySelector(".ventana-modal");
const btnModalCerrar = document.querySelector(".boton-modal-cerrar");
const btnModalContinuar = document.querySelector(".boton-modal-continuar");
const btnModalSi = document.querySelector(".boton-modal-si");
const btnModalNo = document.querySelector(".boton-modal-no");
let textoDentroModal = document.querySelector(".texto-dentro-modal");

//tiempos
let tiempo = 25;
let tiempoDescansoCorto = 5;
let tiempoDescansoLargo = 30;

//info totales
let descansos = 3;
let pomodorosCompletados = 0;
let ciclosCompletados = 0;

//volumen sonidos
let volumen = 0.5;
alertaTres.volume = volumen;

//calculos de tiempos
let momentoActual = tiempo;
let intermedioTiempo;
let tiempoActual;
let diferenciaTiempo = 0;
let actualMasTiempo;
let tiempoEnPausa;
let minutos;
let segundos;

//modal
let texto = "";

//marcadores
let marcador;
let marcadorLleno;
let tiempoTotal;
let tiempoTranscurrido;
let porcentajeActual;

let confirmacionContinuar;

//Mostrar/Ocultar en el HTML
descripcion.style.display = "none";
mostrarTiempo.textContent = tiempo + " minutos";
btnModalContinuar.style.display = "none";
// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
continuar.style.display = "none";
pausa.style.display = "none";
reiniciar.style.display = "none";
ventanaModal.style.display = "none";
infoPomodoro.style.display = "none";

//Crea y oculta los marcadores
crearMarcadores();
circuloIndicador.style.display = "none";

//funciones
//tema-color
const setTheme = (theme) => {
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem("theme", theme);
};

slider.addEventListener("click", () => {
	let switchToTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
	setTheme(switchToTheme);
});

setTheme(localStorage.getItem("theme") || preferedColorScheme);
//


function mostrarInfo() {
	mostrarModal();
	btnModalNo.style.display = "none";
	btnModalSi.style.display = "none";
	btnModalContinuar.style.display = "";
	infoPomodoro.style.display = "";
	btnModalContinuar.addEventListener("click", function () {
		ocultarModal();
		infoPomodoro.style.display = "none";
	});
	window.onclick = function (event) {
		if (event.target === ventanaModal) {
			ocultarModal();
			infoPomodoro.style.display = "none";
		}
	};
}



function suenaAlerta(audio) {
	if (checkAlertaSonora.checked) {
		audio.play();
	}
}

function volumenAlertaSon() {
	const maxSlider = 100;
	const maxVolume = 1;
	volumen = volumenAlerta.value;
	volumen = (maxVolume * volumen) / maxSlider;
	suenaAlerta(alertaTres);
	return (alertaTres.volume = volumen);
}

function mostrarModal(texto) {
	ventanaModal.style.display = "";
	textoDentroModal.textContent = texto;
}

function ocultarModal() {
	ventanaModal.style.display = "none";
}

function crearMarcadores() {
	const diametro = circuloIndicador.offsetWidth;
	const radio = diametro / 2.3;
	const cantidadMarcadores = 24;

	for (let i = 0; i < cantidadMarcadores; i++) {
		const angulo = (i / cantidadMarcadores) * 360;
		marcador = document.createElement("div");
		marcador.classList.add("marcador");
		marcador.setAttribute("id", `marcador-lleno-${Math.floor((i + 1) * 4.1666666667)}`);
		marcador.style.transform = `translate(1750%, 1750%) rotate(${angulo}deg) translate(${radio}px)`;
		circuloIndicador.appendChild(marcador);
	}
}

function limpiarMarcadores() {
	marcador = document.querySelectorAll(".marcador");
	marcador.forEach((marcador) => {
		marcador.classList.remove("activo");
	});
}

function llenarMarcadores(tiempo) {
	tiempoTotal = tiempo * 60000;
	tiempoTranscurrido = tiempoTotal - diferenciaTiempo;
	porcentajeActual = Math.floor((tiempoTranscurrido / tiempoTotal) * 100 + 2);

	marcadorLleno = document.querySelector(`#marcador-lleno-${porcentajeActual}`);

	if (marcadorLleno) {
		marcadorLleno.classList.add("activo");
	}
}

function sumarTiempo() {
	if (tiempo === 55) {
		return;
	}
	tiempo += 5;
	empezar.value = "Empezar";
	mostrarTiempo.textContent = tiempo + " minutos";
	// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
	// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
	// tiempoActual = new Date().getTime();
	return tiempo;
}

function restarTiempo() {
	if (tiempo === 10) {
		return;
	}
	tiempo -= 5;
	empezar.value = "Empezar";
	mostrarTiempo.textContent = tiempo + " minutos";
	// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
	// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
	// tiempoActual = new Date().getTime();
	return tiempo;
}

function pausarTiempo() {
	pausa.style.display = "none";
	continuar.style.display = "";
	clearInterval(intermedioTiempo);
	tiempoEnPausa = actualMasTiempo - new Date().getTime();
}

function continuarTiempo() {
	tiempoActual = new Date().getTime();
	actualMasTiempo = new Date(tiempoActual + tiempoEnPausa).getTime();
	intermedioTiempo = setInterval(() => correTiempo(momentoActual), 10);
	continuar.style.display = "none";
	pausa.style.display = "";
}

async function continuarSesion() {
	suenaAlerta(alertaTres);
	btnModalNo.style.display = "none";
	btnModalSi.style.display = "none";
	mostrarTiempo.textContent = "00:00";
	mostrarModal(texto);
	pausarTiempo();
	confirmacionContinuar = await confirmarContinuar();
	if (confirmacionContinuar) {
		btnModalContinuar.style.display = "none";
	}
}

function confirmarContinuar() {
	mostrarModal(texto);
	btnModalContinuar.style.display = "";
	return new Promise(function (resolve) {
		btnModalContinuar.addEventListener("click", function () {
			ocultarModal();
			resolve(true);
		});
	});
}

async function resetearLosTiempos() {
	pausarTiempo();
	btnModalNo.style.display = "";
	btnModalSi.style.display = "";
	btnModalContinuar.style.display = "none";
	texto = "Estas seguro que deseas reiniciar?";
	mostrarModal(texto);
	const confirmacion = await confirmarReset();
	if (confirmacion) {
		limpiarMarcadores();
		descansos = 3;
		pomodorosCompletados = 0;
		tiempoActual = 0;
		actualMasTiempo = 0;
		intermedioTiempo = null;
		volumenAlerta.style.display = "";
		mostrarTiempo.textContent = tiempo + " minutos";
		circuloIndicador.style.display = "none";
		mostrarTiempo.style.transform = "translate(0%, 0%)";
		mostrarTiempo.style.position = "";
		cajaMasMenos.style.display = "";
		checkAlertaSonora.style.display = "";
		labelAlertaSonora.style.display = "";
		continuar.style.display = "none";
		descripcion.style.display = "none";
		empezar.style.display = "";
		reiniciar.style.display = "none";
	} else {
		continuarTiempo();
	}
}

function confirmarReset() {
	mostrarModal(texto);
	return new Promise(function (resolve) {
		btnModalSi.addEventListener("click", function () {
			ocultarModal();
			resolve(true);
		});
		btnModalNo.addEventListener("click", function () {
			ocultarModal();
			resolve(false);
		});
		btnModalCerrar.addEventListener("click", function () {
			ocultarModal();
			resolve(false);
		});
		window.onclick = function (event) {
			if (event.target === ventanaModal) {
				ocultarModal();
				resolve(false);
			}
		};
	});
}

function tiemposEnCero() {
	tiempoActual = 0;
	actualMasTiempo = 0;
	intermedioTiempo = null;
	mostrarTiempo.textContent = "--:--";
}

function moverTiempo() {
	mostrarTiempo.style.transform = "translate(0%, -499%)";
	mostrarTiempo.style.position = "absolute";
}

function ocultarTextosBotones() {
	cajaMasMenos.style.display = "none";
	// mostrarDescansoCorto.style.display = "none";
	// mostrarDescansoLargo.style.display = "none";
	continuar.style.display = "none";
	checkAlertaSonora.style.display = "none";
	labelAlertaSonora.style.display = "none";
}

async function correTiempo(momentoActual) {
	tiempoActual = new Date().getTime();
	diferenciaTiempo = actualMasTiempo - tiempoActual;

	minutos = Math.floor(diferenciaTiempo / 60000);
	segundos = Math.floor((diferenciaTiempo % 60000) / 1000);

	llenarMarcadores(momentoActual);

	if (segundos < 10) {
		segundos = "0" + segundos;
	}

	if (minutos < 10) {
		minutos = "0" + minutos;
	}
	// console.log(segundos)
	if (momentoActual === tiempo) {
		descripcion.style.display = "";
		descripcion.textContent = "-- Pomodoro --";
		if ((segundos === "00") & (minutos === "00") & (descansos != 0)) {
			texto = "Termino el Pomodoro. Sigue descanso corto (" + tiempoDescansoCorto + "min)";
			continuarSesion();
			confirmacionContinuar = await confirmarContinuar();
			if (confirmacionContinuar) {
				// console.log("a");
				ocultarModal();
				tiemposEnCero();
				// console.log("baja volumen desde pomo");
				mostrarTiempo.textContent = "--:--";
				pomodorosCompletados += 1;
				// console.log("Pomodoros completados = " + pomodorosCompletados);
				// console.log("Cantidad de decansos: " + descansos);
				confirmacionContinuar = null;
				// console.log("confirmacion a null");
				descansoCorto();
				return;
			}
		} else if ((segundos === "00") & (minutos === "00") & (descansos === 0)) {
			texto = "Termino el Pomodoro. Sigue descanso largo (" + tiempoDescansoLargo + "min)";
			continuarSesion();
			confirmacionContinuar = await confirmarContinuar();
			if (confirmacionContinuar) {
				// console.log("baja volumen desde pomo");
				pomodorosCompletados += 1;
				// console.log("Pomodoros completados = " + pomodorosCompletados);
				mostrarTiempo.textContent = "--:--";
				confirmacionContinuar = null;
				// console.log("confirmacion a null");
				ocultarModal();
				tiemposEnCero();
				descansoLargo();
				return;
			}
		}
	}

	if (momentoActual === tiempoDescansoCorto) {
		descripcion.style.display = "";
		descripcion.textContent = "-- Descanso corto --";
		if ((segundos === "00") & (minutos === "00") & (descansos != 0)) {
			texto = "Termino el descanso corto. Sigue Pomodoro (" + tiempo + "min)";
			continuarSesion();
			confirmacionContinuar = await confirmarContinuar();
			if (confirmacionContinuar) {
				ocultarModal();
				tiemposEnCero();
				// console.log("baja volumen desde corto");
				descansos -= 1;
				mostrarTiempo.textContent = "--:--";
				confirmacionContinuar = null;
				// console.log("confirmacion a null");

				empezarPomodoro();
				return;
			}
		}
	}

	if (momentoActual === tiempoDescansoLargo) {
		descripcion.style.display = "";
		descripcion.textContent = "-- Descanso largo --";
		if ((segundos === "00") & (minutos === "00") & (descansos === 0)) {
			texto = "Termino el descanso largo";
			continuarSesion();
			confirmacionContinuar = await confirmarContinuar();
			if (confirmacionContinuar) {
				descansos = 3;
				ciclosCompletados += 1;
				// console.log("Pomodoros completados = " + pomodorosCompletados);
				// console.log("Ciclos completados: " + ciclosCompletados);
				mostrarTiempo.textContent = "COMPLETADO";
				reiniciar.style.display = "none";
				continuar.style.display = "none";
				empezar.style.display = "";
				// console.log("Cantidad de decansos: " + descansos);
				confirmacionContinuar = null;
				// console.log("confirmacion a null");

				tiemposEnCero();
				ocultarModal();
				return;
			}
		}
	}

	mostrarTiempo.textContent = minutos + ":" + segundos;
}

function empezarPomodoro() {
	volumenAlerta.style.display = "none";
	momentoActual = tiempo;
	circuloIndicador.style.display = "";
	limpiarMarcadores();
	moverTiempo();
	ocultarTextosBotones();
	// console.log("Empieza tiempo REGRESIVA");
	empezar.style.display = "none";
	reiniciar.style.display = "";
	pausa.style.display = "";
	tiempoActual = new Date().getTime();
	actualMasTiempo = new Date(tiempoActual + momentoActual * 60000).getTime();
	intermedioTiempo = setInterval(() => correTiempo(momentoActual), 10);
}

function descansoCorto() {
	momentoActual = tiempoDescansoCorto;
	// console.log("Empieza descanso CORTO");
	limpiarMarcadores();
	ocultarTextosBotones();
	empezar.style.display = "none";
	document.querySelector(".caja-masmenos").style.display = "none";
	pausa.style.display = "";
	reiniciar.style.display = "";

	tiempoActual = new Date().getTime();
	actualMasTiempo = new Date(tiempoActual + momentoActual * 60000).getTime();
	intermedioTiempo = setInterval(() => correTiempo(momentoActual), 10);
}

function descansoLargo() {
	momentoActual = tiempoDescansoLargo;
	limpiarMarcadores();
	ocultarTextosBotones();
	// console.log("Empieza descanso LARGO");
	empezar.style.display = "none";
	document.querySelector(".caja-masmenos").style.display = "none";
	pausa.style.display = "";
	reiniciar.style.display = "";

	tiempoActual = new Date().getTime();
	actualMasTiempo = new Date(tiempoActual + momentoActual * 60000).getTime();
	intermedioTiempo = setInterval(() => correTiempo(momentoActual), 10);
}

//Escucha eventos
btnSumarTiempo.addEventListener("click", sumarTiempo);
btnRestarTiempo.addEventListener("click", restarTiempo);
continuar.addEventListener("click", continuarTiempo);
empezar.addEventListener("click", empezarPomodoro);
pausa.addEventListener("click", pausarTiempo);
reiniciar.addEventListener("click", resetearLosTiempos);
volumenAlerta.addEventListener("input", volumenAlertaSon);
sobrePomodoro.addEventListener("click", mostrarInfo);
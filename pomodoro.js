//vinculo con elementos de HTML
let mostrarTiempo = document.querySelector(".mostrar-tiempo");
const btnSumarTiempo = document.querySelector(".mas");
const btnRestarTiempo = document.querySelector(".menos");
const continuar = document.querySelector(".continuar");
const empezar = document.querySelector(".empezar");
const pausa = document.querySelector(".pausa");
const reiniciar = document.querySelector(".reiniciar");
const circuloIndicador = document.querySelector(".circulo-indicador");
let mostrarDescansoCorto = document.querySelector(".tiempo-descanso-corto");
let mostrarDescansoLargo = document.querySelector(".tiempo-descanso-largo");
let checkAlertaSonora = document.querySelector("#alerta-sonora");
const labelAlertaSonora = document.querySelector(".alerta-sonora");

const cajaMasMenos = document.querySelector(".caja-masmenos");
const alertaUno = new Audio("audios/alerta01.mp3");
const alertaDos = new Audio("audios/alerta02.mp3");
let ventanaModal = document.querySelector(".ventana-modal");
const btnModalCerrar = document.querySelector(".boton-modal-cerrar");
const btnModalSi = document.querySelector(".boton-modal-si");
const btnModalNo = document.querySelector(".boton-modal-no");
let textoDentroModal = document.querySelector(".texto-dentro-modal");

//tiempos
let tiempo = 25;
let tiempoDescansoCorto = tiempo / 5;
let tiempoDescansoLargo = tiempoDescansoCorto + tiempo;

//info totales
let descansos = 3;
let pomodorosCompletados = 0;
let ciclosCompletados = 0;

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

//Mostrar/Ocultar en el HTML
mostrarTiempo.textContent = tiempo + " minutos";
// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
continuar.style.display = "none";
pausa.style.display = "none";
reiniciar.style.display = "none";
ventanaModal.style.display = "none";

//Crea y oculta los marcadores
crearMarcadores();
circuloIndicador.style.display = "none";

//funciones

function suenaAlerta(audio) {
	if (checkAlertaSonora.checked) {
		audio.play();
	}
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
	tiempoDescansoCorto = tiempo / 5;
	tiempoDescansoLargo = tiempoDescansoCorto + tiempo;
	empezar.value = "Empezar";
	mostrarTiempo.textContent = tiempo + " minutos";
	// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
	// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
	tiempoActual = new Date().getTime();
	return tiempo;
}

function restarTiempo() {
	if (tiempo === 5) {
		return;
	}
	tiempo -= 5;
	tiempoDescansoCorto = tiempo / 5;
	tiempoDescansoLargo = tiempoDescansoCorto + tiempo;
	empezar.value = "Empezar";
	mostrarTiempo.textContent = tiempo + " minutos";
	// mostrarDescansoCorto.textContent = "Descanso corto: " + tiempoDescansoCorto + " minutos";
	// mostrarDescansoLargo.textContent = "Descanso largo: " + tiempoDescansoLargo + " minutos";
	tiempoActual = new Date().getTime();
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

async function resetearLosTiempos() {
	pausarTiempo();
	texto = "Estas seguro que deseas resetear los tiempos?";
	mostrarModal(texto);
	const confirmacion = await confirmarReset();
	if (confirmacion) {
		limpiarMarcadores();
		tiempoActual = 0;
		actualMasTiempo = 0;
		intermedioTiempo = null;
		mostrarTiempo.textContent = "--:--";
		continuar.style.display = "none";
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

function correTiempo(momentoActual) {
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
	if (momentoActual === tiempo) {
		if ((segundos === "00") & (minutos === "00") & (descansos != 0)) {
			suenaAlerta(alertaDos);
			mostrarTiempo.textContent = "--:--";
			pomodorosCompletados += 1;
			pausarTiempo();
			tiemposEnCero();
			descansoCorto();
			console.log("Pomodoros completados = " + pomodorosCompletados);
			console.log("Cantidad de decansos: " + descansos);
			return;
		} else if ((segundos === "00") & (minutos === "00") & (descansos === 0)) {
			suenaAlerta(alertaDos);
			pomodorosCompletados += 1;
			console.log("Pomodoros completados = " + pomodorosCompletados);
			pausarTiempo();
			tiemposEnCero();
			mostrarTiempo.textContent = "--:--";
			descansoLargo();
			return;
		}
	}

	if (momentoActual === tiempoDescansoCorto) {
		if ((segundos === "00") & (minutos === "00") & (descansos != 0)) {
			descansos -= 1;
			pausarTiempo();
			tiemposEnCero();
			mostrarTiempo.textContent = "--:--";
			empezarPomodoro();
			return;
		}
	}

	if (momentoActual === tiempoDescansoLargo) {
		if ((segundos === "00") & (minutos === "00") & (descansos === 0)) {
			suenaAlerta(alertaUno);
			pausarTiempo();
			tiemposEnCero();
			descansos = 3;
			ciclosCompletados += 1;
			console.log("Pomodoros completados = " + pomodorosCompletados);
			console.log("Ciclos completados: " + ciclosCompletados);
			mostrarTiempo.textContent = "Pomo completado";
			console.log("Cantidad de decansos: " + descansos);
			return;
		}
	}

	mostrarTiempo.textContent = minutos + ":" + segundos;
}

function empezarPomodoro() {
	momentoActual = tiempo;
	circuloIndicador.style.display = "";
	limpiarMarcadores();
	moverTiempo();
	ocultarTextosBotones();
	console.log("Empieza tiempo REGRESIVA");
	empezar.style.display = "none";
	reiniciar.style.display = "";
	pausa.style.display = "";
	tiempoActual = new Date().getTime();
	actualMasTiempo = new Date(tiempoActual + momentoActual * 60000).getTime();
	intermedioTiempo = setInterval(() => correTiempo(momentoActual), 10);
}

function descansoCorto() {
	momentoActual = tiempoDescansoCorto;
	console.log("Empieza descanso CORTO");
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
	console.log("Empieza descanso LARGO");
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

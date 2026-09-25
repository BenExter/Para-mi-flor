/* ==========================================================
   PARA FLOR ❤️
   SCRIPT COMPLETO
========================================================== */


/* ==========================================================
   ELEMENTOS PRINCIPALES
========================================================== */

const portada = document.getElementById("portada");
const contenido = document.getElementById("contenido");
const botonAbrir = document.getElementById("abrir");
const corazones = document.getElementById("corazones");
const progreso = document.getElementById("progreso");


/* ==========================================================
   MÚSICA AMBIENTAL
========================================================== */

const musicaAmbiente =
    document.getElementById("musicaAmbiente");

const controlMusica =
    document.getElementById("controlMusica");

const iconoMusica =
    document.getElementById("iconoMusica");

let musicaPausada = false;
let fadeMusica = null;


/* ==========================================================
   PREFERENCIA DE MOVIMIENTO
========================================================== */

const reducirMovimiento =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* ==========================================================
   CORAZONES FLOTANTES DE LA PORTADA
========================================================== */

let intervaloCorazones = null;


function crearCorazon() {

    if (!corazones) return;

    const corazon =
        document.createElement("span");

    corazon.className =
        "corazon-flotante";


    const simbolos = [
        "♡",
        "♥",
        "♡"
    ];


    corazon.textContent =
        simbolos[
            Math.floor(
                Math.random() *
                simbolos.length
            )
        ];


    corazon.style.left =
        Math.random() * 100 + "%";


    corazon.style.fontSize =
        10 +
        Math.random() * 18 +
        "px";


    const duracion =
        7 +
        Math.random() * 7;


    corazon.style.animationDuration =
        duracion + "s";


    corazon.style.animationDelay =
        Math.random() + "s";


    corazones.appendChild(
        corazon
    );


    setTimeout(
        () => {

            corazon.remove();

        },
        (duracion + 2) * 1000
    );

}


/* Crear corazones solamente
   si las animaciones están activadas */

if (!reducirMovimiento) {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        setTimeout(
            crearCorazon,
            i * 250
        );

    }


    intervaloCorazones =
        setInterval(
            crearCorazon,
            850
        );

}


/* ==========================================================
   MÚSICA - FADE DE VOLUMEN
========================================================== */

function fadeVolumen(
    volumenObjetivo,
    duracion = 1200
) {

    if (!musicaAmbiente) return;


    if (fadeMusica) {

        clearInterval(
            fadeMusica
        );

    }


    const volumenInicial =
        musicaAmbiente.volume;


    const diferencia =
        volumenObjetivo -
        volumenInicial;


    const pasos = 30;

    let paso = 0;


    const intervalo =
        duracion / pasos;


    fadeMusica =
        setInterval(
            () => {

                paso++;


                const nuevoVolumen =
                    volumenInicial +
                    diferencia *
                    (paso / pasos);


                musicaAmbiente.volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            nuevoVolumen
                        )
                    );


                if (paso >= pasos) {

                    clearInterval(
                        fadeMusica
                    );

                    fadeMusica = null;


                    musicaAmbiente.volume =
                        volumenObjetivo;

                }

            },
            intervalo
        );

}


/* ==========================================================
   INICIAR MÚSICA
========================================================== */

function iniciarMusicaAmbiental() {

    if (!musicaAmbiente) {

        console.warn(
            "No se encontró el elemento de música ambiental."
        );

        return;

    }


    musicaAmbiente.volume = 0;


    musicaAmbiente
        .play()

        .then(
            () => {

                musicaPausada = false;


                if (controlMusica) {

                    controlMusica.classList.remove(
                        "pausada"
                    );

                    controlMusica.classList.add(
                        "visible"
                    );


                    controlMusica.setAttribute(
                        "aria-label",
                        "Pausar música"
                    );


                    controlMusica.title =
                        "Pausar música";

                }


                /*
                La música llega lentamente
                al 18% de volumen.
                */

                fadeVolumen(
                    0.18,
                    2500
                );

            }
        )

        .catch(
            error => {

                console.log(
                    "El navegador no permitió iniciar la música:",
                    error
                );


                /*
                Dejamos visible el botón por si
                el usuario quiere iniciarla manualmente.
                */

                if (controlMusica) {

                    controlMusica.classList.add(
                        "visible",
                        "pausada"
                    );

                }

            }
        );

}


/* ==========================================================
   BOTÓN PLAY / PAUSA DE MÚSICA
========================================================== */

if (
    controlMusica &&
    musicaAmbiente
) {

    controlMusica.addEventListener(
        "click",
        () => {

            /*
            SI ESTÁ PAUSADA
            */

            if (musicaAmbiente.paused) {

                musicaAmbiente.volume = 0;


                musicaAmbiente
                    .play()

                    .then(
                        () => {

                            musicaPausada = false;


                            controlMusica.classList.remove(
                                "pausada"
                            );


                            controlMusica.setAttribute(
                                "aria-label",
                                "Pausar música"
                            );


                            controlMusica.title =
                                "Pausar música";


                            fadeVolumen(
                                0.18,
                                1000
                            );

                        }
                    )

                    .catch(
                        error => {

                            console.log(
                                "No se pudo reproducir la música:",
                                error
                            );

                        }
                    );

            }


            /*
            SI ESTÁ SONANDO
            */

            else {

                musicaPausada = true;


                controlMusica.classList.add(
                    "pausada"
                );


                controlMusica.setAttribute(
                    "aria-label",
                    "Reproducir música"
                );


                controlMusica.title =
                    "Reproducir música";


                /*
                Bajamos el volumen
                antes de pausarla.
                */

                fadeVolumen(
                    0,
                    600
                );


                setTimeout(
                    () => {

                        if (
                            musicaPausada &&
                            musicaAmbiente
                        ) {

                            musicaAmbiente.pause();

                        }

                    },
                    650
                );

            }

        }
    );

}


/* ==========================================================
   ABRIR LA PÁGINA
========================================================== */

if (botonAbrir) {

    botonAbrir.addEventListener(
        "click",
        () => {

            /*
            Empezamos la música porque
            el usuario ya interactuó con
            la página.
            */

            iniciarMusicaAmbiental();


            /*
            Animación de salida
            de la portada.
            */

            portada.classList.add(
                "saliendo"
            );


            /*
            Dejamos de crear corazones.
            */

            if (
                intervaloCorazones
            ) {

                clearInterval(
                    intervaloCorazones
                );

            }


            /*
            Después mostramos
            la página principal.
            */

            setTimeout(
                () => {

                    portada.style.display =
                        "none";


                    contenido.classList.remove(
                        "oculto"
                    );


                    window.scrollTo({
                        top: 0,

                        behavior:
                            reducirMovimiento
                                ? "auto"
                                : "smooth"
                    });


                    iniciarObservadores();


                    actualizarProgreso();

                    actualizarTimeline();

                },
                reducirMovimiento
                    ? 10
                    : 950
            );

        }
    );

}


/* ==========================================================
   ANIMACIONES AL HACER SCROLL
========================================================== */

let observadoresIniciados =
    false;


function iniciarObservadores() {

    if (
        observadoresIniciados
    ) {

        return;

    }


    observadoresIniciados =
        true;


    const elementos =
        document.querySelectorAll(
            `
            .reveal,
            .reveal-card,
            .reveal-foto,
            .reveal-recuerdo,
            .reveal-carta
            `
        );


    /*
    Si el dispositivo tiene
    animaciones reducidas.
    */

    if (reducirMovimiento) {

        elementos.forEach(
            elemento => {

                elemento.classList.add(
                    "visible"
                );

            }
        );


        iniciarFlor();

        return;

    }


    const observer =
        new IntersectionObserver(
            entradas => {

                entradas.forEach(
                    entrada => {

                        if (
                            !entrada.isIntersecting
                        ) {

                            return;

                        }


                        const elemento =
                            entrada.target;


                        /*
                        Animación escalonada
                        de las tarjetas.
                        */

                        if (
                            elemento.classList.contains(
                                "reveal-card"
                            )
                        ) {

                            const cards =
                                Array.from(
                                    document.querySelectorAll(
                                        ".reveal-card"
                                    )
                                );


                            const indice =
                                cards.indexOf(
                                    elemento
                                ) % 4;


                            elemento.style.transitionDelay =
                                indice *
                                0.11 +
                                "s";

                        }


                        /*
                        Animación escalonada
                        de las fotos.
                        */

                        if (
                            elemento.classList.contains(
                                "reveal-foto"
                            )
                        ) {

                            const fotos =
                                Array.from(
                                    document.querySelectorAll(
                                        ".reveal-foto"
                                    )
                                );


                            const indice =
                                fotos.indexOf(
                                    elemento
                                );


                            elemento.style.transitionDelay =
                                indice *
                                0.12 +
                                "s";

                        }


                        /*
                        Mostrar elemento.
                        */

                        elemento.classList.add(
                            "visible"
                        );


                        observer.unobserve(
                            elemento
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elementos.forEach(
        elemento => {

            observer.observe(
                elemento
            );

        }
    );


    iniciarFlor();

}


/* ==========================================================
   BARRA DE PROGRESO SUPERIOR
========================================================== */

function actualizarProgreso() {

    if (
        !contenido ||
        contenido.classList.contains(
            "oculto"
        )
    ) {

        if (progreso) {

            progreso.style.width =
                "0%";

        }

        return;

    }


    const scrollActual =
        window.scrollY;


    const alturaTotal =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (alturaTotal <= 0) {

        progreso.style.width =
            "100%";

        return;

    }


    const porcentaje =
        Math.min(
            100,
            Math.max(
                0,
                (
                    scrollActual /
                    alturaTotal
                ) * 100
            )
        );


    progreso.style.width =
        porcentaje + "%";

}


window.addEventListener(
    "scroll",
    actualizarProgreso,
    {
        passive: true
    }
);


/* ==========================================================
   VISOR DE FOTOS
========================================================== */

const visor =
    document.getElementById(
        "visor"
    );

const fotoGrande =
    document.getElementById(
        "fotoGrande"
    );

const textoFoto =
    document.getElementById(
        "textoFoto"
    );

const cerrarVisor =
    document.getElementById(
        "cerrarVisor"
    );

const polaroids =
    document.querySelectorAll(
        ".polaroid"
    );


function abrirFoto(
    ruta,
    texto
) {

    if (
        !visor ||
        !fotoGrande ||
        !textoFoto
    ) {

        return;

    }


    fotoGrande.src =
        ruta;


    textoFoto.textContent =
        texto;


    visor.classList.add(
        "abierto"
    );


    visor.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "no-scroll"
    );

}


function cerrarFoto() {

    if (!visor) return;


    visor.classList.remove(
        "abierto"
    );


    visor.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "no-scroll"
    );


    /*
    Quitamos la imagen después
    de cerrar la animación.
    */

    setTimeout(
        () => {

            if (
                !visor.classList.contains(
                    "abierto"
                ) &&
                fotoGrande
            ) {

                fotoGrande.src = "";

            }

        },
        450
    );

}


/* Abrir cada foto */

polaroids.forEach(
    polaroid => {

        polaroid.addEventListener(
            "click",
            () => {

                abrirFoto(
                    polaroid.dataset.foto,
                    polaroid.dataset.texto
                );

            }
        );

    }
);


/* Botón cerrar */

if (cerrarVisor) {

    cerrarVisor.addEventListener(
        "click",
        cerrarFoto
    );

}


/* Cerrar tocando el fondo */

if (visor) {

    visor.addEventListener(
        "click",
        evento => {

            if (
                evento.target === visor
            ) {

                cerrarFoto();

            }

        }
    );

}


/* Cerrar con ESC */

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            visor &&
            visor.classList.contains(
                "abierto"
            )
        ) {

            cerrarFoto();

        }

    }
);


/* ==========================================================
   FLOR ANIMADA
========================================================== */

const seccionFlor =
    document.getElementById(
        "seccionFlor"
    );

const florAnimada =
    document.getElementById(
        "florAnimada"
    );

const mensajeFlor =
    document.getElementById(
        "mensajeFlor"
    );


let florIniciada =
    false;


function activarFlor() {

    if (
        florIniciada ||
        !florAnimada
    ) {

        return;

    }


    florIniciada =
        true;


    florAnimada.classList.add(
        "activa"
    );


    setTimeout(
        () => {

            if (mensajeFlor) {

                mensajeFlor.classList.add(
                    "visible"
                );

            }

        },
        reducirMovimiento
            ? 0
            : 2100
    );

}


function iniciarFlor() {

    if (
        !seccionFlor
    ) {

        return;

    }


    if (
        reducirMovimiento
    ) {

        activarFlor();

        return;

    }


    const observerFlor =
        new IntersectionObserver(
            entradas => {

                entradas.forEach(
                    entrada => {

                        if (
                            entrada.isIntersecting
                        ) {

                            activarFlor();


                            observerFlor.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.28
            }
        );


    observerFlor.observe(
        seccionFlor
    );

}


/* ==========================================================
   LÍNEA DEL TIEMPO
========================================================== */

const timeline =
    document.getElementById(
        "timeline"
    );

const timelineProgreso =
    document.getElementById(
        "timelineProgreso"
    );


function actualizarTimeline() {

    if (
        !timeline ||
        !timelineProgreso ||
        !contenido ||
        contenido.classList.contains(
            "oculto"
        )
    ) {

        return;

    }


    const rect =
        timeline.getBoundingClientRect();


    const ventana =
        window.innerHeight;


    const inicio =
        ventana * 0.75;


    const distancia =
        inicio -
        rect.top;


    const recorrido =
        rect.height +
        ventana * 0.25;


    let porcentaje =
        distancia /
        recorrido;


    porcentaje =
        Math.max(
            0,
            Math.min(
                1,
                porcentaje
            )
        );


    timelineProgreso.style.height =
        porcentaje *
        100 +
        "%";

}


window.addEventListener(
    "scroll",
    actualizarTimeline,
    {
        passive: true
    }
);


/* ==========================================================
   SORPRESA FINAL
========================================================== */

const pantallaSobre =
    document.getElementById(
        "pantallaSobre"
    );

const sobre =
    document.getElementById(
        "sobre"
    );

const descubrir =
    document.getElementById(
        "descubrir"
    );

const mensajeFinal =
    document.getElementById(
        "mensajeFinal"
    );

const ultimaCosa =
    document.getElementById(
        "ultimaCosa"
    );

const ultimaPantalla =
    document.getElementById(
        "ultimaPantalla"
    );

const volverInicio =
    document.getElementById(
        "volverInicio"
    );

const petalosFinales =
    document.getElementById(
        "petalosFinales"
    );


let sorpresaAbierta =
    false;


let intervaloPetalos =
    null;


/* ==========================================================
   CREAR PÉTALOS DEL FINAL
========================================================== */

function crearPetaloFinal() {

    if (
        !petalosFinales
    ) {

        return;

    }


    const petalo =
        document.createElement(
            "span"
        );


    const simbolos = [
        "🌸",
        "♡",
        "🌷"
    ];


    petalo.className =
        "petalo-final";


    petalo.textContent =
        simbolos[
            Math.floor(
                Math.random() *
                simbolos.length
            )
        ];


    petalo.style.left =
        Math.random() *
        100 +
        "%";


    petalo.style.fontSize =
        10 +
        Math.random() *
        13 +
        "px";


    const duracion =
        7 +
        Math.random() *
        6;


    petalo.style.animationDuration =
        duracion +
        "s";


    petalo.style.animationDelay =
        Math.random() *
        0.8 +
        "s";


    petalosFinales.appendChild(
        petalo
    );


    setTimeout(
        () => {

            petalo.remove();

        },
        (
            duracion +
            2
        ) * 1000
    );

}


/* ==========================================================
   ABRIR EL SOBRE
========================================================== */

if (descubrir) {

    descubrir.addEventListener(
        "click",
        () => {

            if (
                sorpresaAbierta
            ) {

                return;

            }


            sorpresaAbierta =
                true;


            if (sobre) {

                sobre.classList.add(
                    "abierto"
                );

            }


            descubrir.disabled =
                true;


            /*
            Desaparece la pantalla
            del sobre.
            */

            setTimeout(
                () => {

                    if (
                        pantallaSobre
                    ) {

                        pantallaSobre.style.opacity =
                            "0";


                        pantallaSobre.style.pointerEvents =
                            "none";

                    }

                },
                reducirMovimiento
                    ? 0
                    : 1100
            );


            /*
            Aparece el mensaje.
            */

            setTimeout(
                () => {

                    if (
                        mensajeFinal
                    ) {

                        mensajeFinal.classList.add(
                            "visible"
                        );

                    }


                    /*
                    Crear pétalos.
                    */

                    if (
                        !reducirMovimiento
                    ) {

                        for (
                            let i = 0;
                            i < 15;
                            i++
                        ) {

                            setTimeout(
                                crearPetaloFinal,
                                i * 150
                            );

                        }


                        intervaloPetalos =
                            setInterval(
                                crearPetaloFinal,
                                850
                            );

                    }

                },
                reducirMovimiento
                    ? 10
                    : 1500
            );

        }
    );

}


/* ==========================================================
   UNA ÚLTIMA COSITA
========================================================== */

if (ultimaCosa) {

    ultimaCosa.addEventListener(
        "click",
        () => {

            /*
            Detener pétalos.
            */

            if (
                intervaloPetalos
            ) {

                clearInterval(
                    intervaloPetalos
                );


                intervaloPetalos =
                    null;

            }


            /*
            Ocultar mensaje.
            */

            if (mensajeFinal) {

                mensajeFinal.classList.remove(
                    "visible"
                );

            }


            /*
            Mostrar pantalla final.
            */

            setTimeout(
                () => {

                    if (
                        ultimaPantalla
                    ) {

                        ultimaPantalla.classList.add(
                            "visible"
                        );

                    }

                },
                reducirMovimiento
                    ? 10
                    : 800
            );

        }
    );

}


/* ==========================================================
   VOLVER AL COMIENZO
========================================================== */

if (volverInicio) {

    volverInicio.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,

                behavior:
                    reducirMovimiento
                        ? "auto"
                        : "smooth"
            });

        }
    );

}


/* ==========================================================
   AJUSTAR AL CAMBIAR TAMAÑO DE PANTALLA
========================================================== */

window.addEventListener(
    "resize",
    () => {

        actualizarProgreso();

        actualizarTimeline();

    }
);


/* ==========================================================
   ESTADO INICIAL
========================================================== */

actualizarProgreso();
let player;
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRL2FvSO7OKtsSJh6NDomcmVTGxnqXcVQrx1QnmhWdPSZkeax1fCld4yw9Vg-C36wB7bambdSeyi3Z2/pub?gid=0&single=true&output=csv';

// 1. Cargar datos del Google Sheet
async function cargarDatos() {
    try {
        const respuesta = await fetch(sheetUrl);
        const texto = await respuesta.text();
        const filas = texto.split('\n').slice(1); // Omitimos la cabecera (Etiqueta, Enlace)
        
        const contenedor = document.getElementById('audio-selector');
        contenedor.innerHTML = ''; // Limpiar mensaje de carga

        filas.forEach(fila => {
            const columnas = fila.split(',');
            if (columnas.length >= 2) {
                const etiqueta = columnas[0].trim();
                const enlace = columnas[1].trim();
                const videoId = extraerID(enlace);

                // Crear el botón dinámicamente
                const btn = document.createElement('button');
                btn.className = 'track-btn';
                btn.innerText = etiqueta;
                btn.onclick = () => cambiarAudio(videoId, etiqueta);
                contenedor.appendChild(btn);
            }
        });
    } catch (error) {
        console.error("Error cargando el Sheets:", error);
    }
}

// 2. Extraer ID de YouTube
function extraerID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 3. API de YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0', videoId: '',
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: { 'onReady': () => { cargarDatos(); configurarControles(); } }
    });
}

function configurarControles() {
    document.getElementById('playBtn').onclick = () => {
        player.playVideo();
        document.getElementById('visualizer').classList.add('playing');
    };
    document.getElementById('pauseBtn').onclick = () => {
        player.pauseVideo();
        document.getElementById('visualizer').classList.remove('playing');
    };
    document.getElementById('volumeSlider').oninput = (e) => player.setVolume(e.target.value);
}

function cambiarAudio(id, nombre) {
    if (player && id) {
        player.loadVideoById(id);
        document.getElementById('videoTitle').innerText = nombre;
        document.getElementById('visualizer').classList.add('playing');
    }
}

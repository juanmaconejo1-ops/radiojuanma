let player;

// Función obligatoria para la API de YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '300',
        width: '300',
        videoId: '', // Vacío al inicio
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    const loadBtn = document.getElementById('loadBtn');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    // Cargar video desde la URL
    loadBtn.addEventListener('click', () => {
        const url = document.getElementById('youtubeUrl').value;
        const videoId = extractVideoId(url);
        if (videoId) {
            player.loadVideoById(videoId);
            document.getElementById('videoTitle').innerText = "Cargado correctamente";
        } else {
            alert("URL de YouTube no válida");
        }
    });

    playBtn.addEventListener('click', () => player.playVideo());
    pauseBtn.addEventListener('click', () => player.pauseVideo());
    
    volumeSlider.addEventListener('input', (e) => {
        player.setVolume(e.target.value);
    });
}

// Función para extraer el ID del video de la URL
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Получение элементов страницы с помощью селекторов
let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');
let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');
let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.querySelector('audio');

// Инициализация переменных состояния и индекса текущего трека
let track_index = 0;
let isPlaying = false;
let updateTimer;

// Массив с информацией о музыке
const music_list = [
    {
        img : 'images/ТДД.jpg',
        name : 'Отпускай',
        artist : 'Три дня дождя',
        music : 'music/Три дня дождя - Отпускай.mp3'
    },
    {
        img : 'images/Stromae.jpg',
        name : 'Stromae',
        artist : 'L’enfer',
        music : 'music/Stromae — L’enfer.mp3'
    },
    {
        img : 'images/faded.png',
        name : 'Faded',
        artist : 'Alan Walker',
        music : 'music/Faded.mp3'
    },
    {
        img : 'images/ДДТ.jpg',
        name : 'Что такое осень',
        artist : 'ДДТ',
        music : 'music/ДДТ — Что такое осень.mp3'
    }
];

// Загрузка трека по его индексу
loadTrack(track_index);

// Функция для загрузки трека
function loadTrack(track_index) {
    // Очистка интервала обновления
    clearInterval(updateTimer);
    // Сброс значений
    reset();

    // Загрузка трека
    curr_track.src = music_list[track_index].music;
    curr_track.load();

    // Установка обложки трека, названия и исполнителя
    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    // Установка интервала обновления
    updateTimer = setInterval(setUpdate, 1000);

    // Добавление обработчика события 'ended' для перехода к следующему треку после завершения текущего
    curr_track.addEventListener('ended', nextTrack);
    random_bg_color(); // Изменение случайного фона
}

// Генерация случайного цвета фона
function random_bg_color() {
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a) {
        for (let i = 0; i < 6; i++) {
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }

    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";
    document.body.style.background = gradient;
}

// Сброс значений текущего времени, продолжительности и ползунка
function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

// Функция для воспроизведения или паузы трека
function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

// Функция для воспроизведения трека
function playTrack() {
    if (!context) {
        preparation();
    }
    curr_track.play();
    loop();
    isPlaying = true;
    track_art.classList.add('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

// Функция для приостановки трека
function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

// Функция для перехода к следующему треку
function nextTrack() {
    if (track_index < music_list.length - 1) {
        track_index += 1;
    } else if (track_index < music_list.length - 1) {
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

// Функция для перехода к предыдущему треку
function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    } else {
        track_index = music_list.length - 1;
    }
    loadTrack(track_index);
    playTrack();
}

// Функция для установки текущего времени трека по положению ползунка
function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

// Функция для установки громкости трека
function setVolume() {
    curr_track.volume = 100;
}

// Функция для обновления времени и положения ползунка
function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// Инициализация визуализации музыки
let audio, context, analyser, src, array, logo;
const num = 32;
array = new Uint8Array(num);
const wrapper = document.querySelector('.wrapper');
items = document.querySelectorAll(".stroke");

// Подготовка аудио-контекста и анализатора
function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    src = context.createMediaElementSource(curr_track);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

// Функция для анимации отображения аудивизуализации
function loop() {
    if (!curr_track.paused) {
        window.requestAnimationFrame(loop);
    }
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    for (var i = 0; i < items.length; i++) {
        height = array[i + num];
        items[i].style.opacity = 0.008 * height;
        if (height < 150) {
            items[i].style.height = height / 5 - 20 + 'px';
        } else if (height > 150 && height < 200) {
            items[i].style.height = height / 4 - 20 + 'px';
        } else {
            items[i].style.height = height / 2 - 40 + 'px';
        }
    }
}

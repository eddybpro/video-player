const container = document.querySelector('.container');
const mainVideo = container.querySelector('video');
const progressBar = container.querySelector('.progress-bar');
const videoTimeLine = container.querySelector('.video-timeline');
const playPauseBtn = container.querySelector('.play-pause i');
const skipBackwardBtn = container.querySelector('.skip-backward');
const skipForwardBtn = container.querySelector('.skip-forward');
const volumeBtn = container.querySelector('.volume i');
const volumeSlider = container.querySelector('.left input');
const currentVidTime = container.querySelector('.current-time');
const videoDuration = container.querySelector('.video-duration');
const speedBtn = container.querySelector('.playback-speed span');
const speedOptions = container.querySelector('.speed-options');
const picInPicBtn = container.querySelector('.pic-in-pic span');
const fullScreenBtn = container.querySelector('.fullscreen i');
let timer;


const hideControls = ()=>{
    if(mainVideo.paused) return;
    timer = setTimeout(()=>{
        container.classList.remove('show-controls');
    }, 3000)
}

hideControls();

container.addEventListener('mousemove', ()=>{
    container.classList.add('show-controls');
    clearTimeout(timer);
    hideControls();
})

const formatTime = time =>{
    let seconds = Math.floor(time % 60);
    let mins = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = seconds < 10? '0' + seconds: seconds;
    mins = mins < 10? '0' + mins: mins;
    hours = hours < 10? '0' + hours: hours;

    if(hours == 0){
        return `${mins}:${seconds}`
    }
    return `${hours}:${mins}:${seconds}`
}

mainVideo.addEventListener('timeupdate', e=>{
    let {currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
})

mainVideo.addEventListener('loadeddata', e=>{
    videoDuration.innerText = formatTime(e.target.duration);
})

videoTimeLine.addEventListener('click', e=>{
    let timeLineWidth = videoTimeLine.clientWidth;
    mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration; 
})

const draggableProgressBar = e=>{
    let timeLineWidth = videoTimeLine.clientWidth;
    progressBar.style.width =`${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration; 
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

videoTimeLine.addEventListener('mousedown', ()=>{
    videoTimeLine.addEventListener('mousemove', draggableProgressBar)
})

document.addEventListener('mouseup', ()=>{
    videoTimeLine.removeEventListener('mousemove', draggableProgressBar)
})

videoTimeLine.addEventListener('mousemove', e=>{
    const progressTime = videoTimeLine.querySelector('span');
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timeLineWidth = videoTimeLine.clientWidth;
    let percent = (e.offsetX / timeLineWidth) * mainVideo.duration;
    progressTime.innerText =formatTime(percent);
})

volumeBtn.addEventListener('click', ()=> {
    if(!volumeBtn.classList.contains('fa-volume-high')){
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }else{
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    }

    volumeSlider.value = mainVideo.volume;
})

volumeSlider.addEventListener('input', e=>{
    mainVideo.volume = e.target.value;

    if(e.target.value == 0){
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    }else{
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
})

speedBtn.addEventListener('click', ()=>{
    speedOptions.classList.toggle('show');
})

speedOptions.querySelectorAll('li').forEach(option =>{
    option.addEventListener('click', ()=>{
        mainVideo.playbackRate =option.dataset.speed ;
        speedOptions.querySelector('.active').classList.remove('active');
        option.classList.add('active');
    })
})

document.addEventListener('click', e =>{
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show');
    }
})

picInPicBtn.addEventListener('click', ()=>{
    mainVideo.requestPictureInPicture();
})

fullScreenBtn.addEventListener('click', ()=>{
    container.classList.toggle('fullscreen');
    if(document.fullscreenElement){
        fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
        container.requestFullscreen();
})

skipBackwardBtn.addEventListener('click', () =>{
    mainVideo.currentTime -= 5;
})

skipForwardBtn.addEventListener('click', () =>{
    mainVideo.currentTime += 5;
})

playPauseBtn.addEventListener('click', ()=>{
    mainVideo.paused ? mainVideo.play(): mainVideo.pause();
})

mainVideo.addEventListener('play', ()=>{
    playPauseBtn.classList.replace('fa-play', 'fa-pause')
})

mainVideo.addEventListener('pause', ()=>{
    playPauseBtn.classList.replace('fa-pause', 'fa-play')
})

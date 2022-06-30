const videoPlayer = {}

videoPlayer.player = document.querySelector(".player");
videoPlayer.video = document.querySelector("video");
videoPlayer.progressRange = document.querySelector(".progress-range");
videoPlayer.progressBar = document.querySelector(".progress-bar");
videoPlayer.playBtn = document.getElementById("play-btn");
videoPlayer.volumeIcon = document.getElementById("volume-icon");
videoPlayer.volumeRange = document.querySelector(".volume-range");
videoPlayer.volumeBar = document.querySelector(".volume-bar");
videoPlayer.currrentTime = document.querySelector(".time-elapsed");
videoPlayer.duration = document.querySelector(".time-duration");
videoPlayer.speed = document.querySelector(".player-speed");
videoPlayer.fullscreenBtn = document.querySelector(".fullscreen");

// Play & Pause ----------------------------------- //

function showPlayIcon() {
  videoPlayer.playBtn.classList.replace("fa-pause", "fa-play");
  videoPlayer.playBtn.setAttribute("title", "Play");
}

function togglePlay() {
  if (videoPlayer.video.paused) {
    videoPlayer.video.play();
    videoPlayer.playBtn.classList.replace("fa-play", "fa-pause");
    videoPlayer.playBtn.setAttribute("title", "Pause");
  } else {
    videoPlayer.video.pause();
    showPlayIcon();
  }
}

// On Video End, show Play Button Icon
videoPlayer.video.addEventListener("ended", showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

// Update Progress Bar as video plays
function updateProgress() {
  videoPlayer.progressBar.style.width = `${(videoPlayer.video.currentTime / videoPlayer.video.duration) * 100}%`;
  videoPlayer.currrentTime.textContent = `${displayTime(videoPlayer.video.currentTime)} /`;
  videoPlayer.duration.textContent = `${displayTime(videoPlayer.video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
  const newTime = e.offsetX / videoPlayer.progressRange.offsetWidth;
  videoPlayer.progressBar.style.width = `${newTime * 100}%`;
  videoPlayer.video.currentTime = newTime * videoPlayer.video.duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;

// Volume Bar
function changeVolume(e) {
  let volume = e.offsetX / videoPlayer.volumeRange.offsetWidth;
  // Rounding Volume up or down
  if (volume < 0.1) {
    volume = 0;
  }
  if (volume > 0.9) {
    volume = 1;
  }
  videoPlayer.volumeBar.style.width = `${volume * 100}%`;
  videoPlayer.video.volume = volume;
  // Change Icon depending on Volume
  videoPlayer.volumeIcon.className = "";
  if (volume > 0.5) {
    videoPlayer.volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (volume < 0.5 && volume > 0) {
    videoPlayer.volumeIcon.classList.add("fas", "fa-volume-down");
  } else if (volume === 0) {
    videoPlayer.volumeIcon.classList.add("fas", "fa-volume-off");
  }
  lastVolume = volume;
}

// Mute/Unmute
function toggleMute() {
  videoPlayer.volumeIcon.className = "";
  if (videoPlayer.video.volume) {
    lastVolume = videoPlayer.video.volume;
    videoPlayer.video.volume = 0;
    videoPlayer.volumeBar.style.width = 0;
    videoPlayer.volumeIcon.classList.add("fas", "fa-volume-mute");
    videoPlayer.volumeIcon.setAttribute("title", "Unmute");
  } else {
    videoPlayer.video.volume = lastVolume;
    videoPlayer.volumeBar.style.width = `${lastVolume * 100}%`;
    videoPlayer.volumeIcon.classList.add("fas", "fa-volume-up");
    videoPlayer.volumeIcon.setAttribute("title", "Mute");
  }
}

// Change Playback Speed -------------------- //

function changeSpeed() {
  videoPlayer.video.playbackRate = videoPlayer.speed.value;
}

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
  videoPlayer.video.classList.add("video-fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  videoPlayer.video.classList.remove("video-fullscreen");
}

let fullscreen = false;

//  Toggle Fullscreen

function toggleFullscreen() {
  !fullscreen ? openFullscreen(videoPlayer.player) : closeFullscreen();
  fullscreen = !fullscreen;
}

// Event Listeners
videoPlayer.playBtn.addEventListener("click", togglePlay);
videoPlayer.video.addEventListener("click", togglePlay);
videoPlayer.video.addEventListener("timeupdate", updateProgress);
videoPlayer.video.addEventListener("canplay", updateProgress);
videoPlayer.progressRange.addEventListener("click", setProgress);
videoPlayer.volumeRange.addEventListener("click", changeVolume);
videoPlayer.volumeIcon.addEventListener("click", toggleMute);
videoPlayer.speed.addEventListener("change", changeSpeed);
videoPlayer.fullscreenBtn.addEventListener("click", toggleFullscreen);

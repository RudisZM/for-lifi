const audio = document.getElementById("bg-music");
if (audio) {
  audio.load();
  document.addEventListener(
    "click",
    function () {
      audio
        .play()
        .then(() => console.log("Musik mulai dimainkan!"))
        .catch((err) => console.log("Gagal memutar musik:", err));
    },
    { once: true }
  );
}

window.onload = () => {
  const sentences = [
    "Sejak pertama aku menatap langit, aku tahu akan ada satu bintang yang menuntunku padamu.",
    "Kau adalah doa yang tak pernah berhenti kupanjatkan, hadir dalam setiap hela nafasku.",
    "Aku ingin mencintaimu seribu tahun lagi, dan seribu tahun setelahnya.",
    "Jika dunia runtuh sekalipun, cintaku padamu akan tetap abadi.",
    "Setiap detak jantungku berbisik satu nama, dan itu adalah dirimu.",
    "Aku menunggumu, bukan sehari atau dua, tapi seumur hidupku.",
    "Cintamu adalah alasan aku percaya pada takdir.",
    "Andai waktu berhenti, aku ingin terjebak bersamamu selamanya.",
    "Aku bukan hanya ingin melewati hari ini denganmu, tapi juga setiap hari esok yang akan datang.",
    "Di setiap doa, aku titipkan namamu, berharap Tuhan menjagamu sebelum aku bisa melakukannya.",
    "Jika cinta adalah perjalanan, maka aku ingin berjalan tanpa akhir bersamamu.",
    "Setiap malam aku memandang bintang, dan aku sadar, sinarnya tak seindah senyummu.",
    "Aku percaya, Tuhan menciptakan kita berdua untuk saling melengkapi.",
    "Tidak peduli seberapa panjang jalan ini, aku akan selalu mencari arah yang menuju kepadamu.",
    "Hatiku adalah rumah, dan kau adalah penghuni yang tak pernah ingin kutinggalkan.",
  ];

  let currentSentence = 0;
  let typingSpeed = 80;
  let erasingSpeed = 40;
  let delayBetween = 1500;
  let started = false;

  function typeWriter(element, text, i, callback) {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      setTimeout(() => typeWriter(element, text, i + 1, callback), typingSpeed);
    } else {
      setTimeout(callback, delayBetween);
    }
  }

  function eraseText(element, callback) {
    let text = element.textContent;
    if (text.length > 0) {
      element.textContent = text.substring(0, text.length - 1);
      setTimeout(() => eraseText(element, callback), erasingSpeed);
    } else {
      callback();
    }
  }

  function playTyping() {
    const el = document.getElementById("typing-top");
    typeWriter(el, sentences[currentSentence], 0, () => {
      eraseText(el, () => {
        currentSentence = (currentSentence + 1) % sentences.length;
        playTyping();
      });
    });
  }

  function startTyping() {
    if (!started) {
      started = true;
      playTyping();
    }
  }

  // Mulai hanya setelah interaksi user
  document.addEventListener("click", startTyping);
  document.addEventListener("keydown", startTyping);
  document.addEventListener("touchstart", startTyping);
};

// ====== 3D CAROUSEL ======
var radius = 220;
var autoRotate = true;
var rotateSpeed = -60; // detik/360°
var imgWidth = 120;
var imgHeight = 170;

var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var ground = document.getElementById("ground");

if (!odrag || !ospin || !ground) {
  console.error(
    "Pastikan elemen #drag-container, #spin-container, dan #ground ada di HTML."
  );
} else {
  var aImg = ospin.getElementsByTagName("img");
  var aVid = ospin.getElementsByTagName("video");
  var aEle = [...aImg, ...aVid];

  ospin.style.width = imgWidth + "px";
  ospin.style.height = imgHeight + "px";

  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";

  function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
      aEle[i].style.transform =
        "rotateY(" +
        i * (360 / aEle.length) +
        "deg) translateZ(" +
        radius +
        "px)";
      aEle[i].style.transition = "transform 1s";
      aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
  }

  function applyTransform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
  }

  function playSpin(yes) {
    ospin.style.animationPlayState = yes ? "running" : "paused";
  }

  var desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

  setTimeout(init, 1000);

  if (autoRotate) {
    var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
    ospin.style.animation = `${animationName} ${Math.abs(
      rotateSpeed
    )}s infinite linear`;
  }

  document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    let sX = e.clientX,
      sY = e.clientY;

    this.onpointermove = function (e) {
      let nX = e.clientX,
        nY = e.clientY;
      desX = nX - sX;
      desY = nY - sY;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      sX = nX;
      sY = nY;
    };

    this.onpointerup = function () {
      odrag.timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        playSpin(false);
        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(odrag.timer);
          playSpin(true);
        }
      }, 17);
      this.onpointermove = this.onpointerup = null;
    };

    return false;
  };

  document.onmousewheel = function (e) {
    var d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
  };
}

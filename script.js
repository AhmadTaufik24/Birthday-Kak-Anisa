document.addEventListener("DOMContentLoaded", () => {
    
    // === 1. LOGIKA SPOTIFY PLAYER ===
    const songs = [
        {
            title: "Rehat ",
            artist: "Kunto Aji",
            src: "Kunto Aji - Rehat.mp3",
            cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300"
        },
        {
            title: "Runtuh",
            artist: "Aesthetic Indie",
            src: "Runtuh - Feby Putri feat. Fiersa Besari.mp3",
            cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92e?w=300"
        },
        {
            title: "Membasuh",
            artist: "Good MoodHindia ft. Rara Sekar",
            src: "Hindia ft. Rara Sekar - Membasuh.mp3",
            cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
        }
    ];

    let songIndex = 0;
    let isPlaying = false;

    const audio = document.getElementById("audioElement");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const title = document.getElementById("songTitle");
    const artist = document.getElementById("songArtist");
    const cover = document.getElementById("coverImg");
    const progress = document.getElementById("progress");
    const progressBar = document.getElementById("progressBar");
    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");
    const playlistItems = document.querySelectorAll("#playlistList li");
    const hbdAudio = document.getElementById("hbdAudio"); 

    function loadSong(song) {
        title.innerText = song.title;
        artist.innerText = song.artist;
        audio.src = song.src;
        cover.src = song.cover;
        updatePlaylistUI();
    }

    function updatePlaylistUI() {
        playlistItems.forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    function playPauseSong() {
        if(hbdAudio && !hbdAudio.paused) {
            hbdAudio.pause();
        }

        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songs[songIndex]);
        
        if(hbdAudio && !hbdAudio.paused) hbdAudio.pause();
        
        audio.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songs[songIndex]);
        
        if(hbdAudio && !hbdAudio.paused) hbdAudio.pause();

        audio.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return; 

        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time || 0)).padStart(1, '0');
        const currentMin = formatTime(currentTime / 60);
        const currentSec = formatTime(currentTime % 60).padStart(2, '0');
        const durationMin = formatTime(duration / 60);
        const durationSec = formatTime(duration % 60).padStart(2, '0');

        currentTimeEl.innerText = `${currentMin}:${currentSec}`;
        durationEl.innerText = `${durationMin}:${durationSec}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    if(playBtn) playBtn.addEventListener("click", playPauseSong);
    if(nextBtn) nextBtn.addEventListener("click", nextSong);
    if(prevBtn) prevBtn.addEventListener("click", prevSong);
    if(audio) {
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", nextSong);
    }
    if(progressBar) progressBar.addEventListener("click", setProgress);

    playlistItems.forEach(item => {
        item.addEventListener("click", function() {
            songIndex = parseInt(this.getAttribute("data-index"));
            loadSong(songs[songIndex]);
            
            if(hbdAudio && !hbdAudio.paused) hbdAudio.pause();

            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
    });

    loadSong(songs[songIndex]);

    // === BARU: LOGIKA AUTOPLAY MUSIK SAAT SCROLL KE SECTION MUSIK ===
    const musicSection = document.getElementById("music");
    let isMusicAutoplayed = false; // Flag agar play otomatis cuma jalan 1x

    const musicObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Jika 50% area musik sudah terlihat di layar
            if (entry.isIntersecting && !isMusicAutoplayed) {
                isMusicAutoplayed = true; 
                
                // Kalau lagu playlist belum diputar
                if (!isPlaying) {
                    if (hbdAudio && !hbdAudio.paused) hbdAudio.pause(); // Matikan lagu HBD awal
                    
                    audio.play().then(() => {
                        isPlaying = true;
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    }).catch(err => console.log("Browser mencegah autoplay."));
                }
            }
        });
    }, { threshold: 0.5 }); // 0.5 berarti 50% masuk ke layar baru jalan

    if(musicSection) {
        musicObserver.observe(musicSection);
    }

    // === 2. LOGIKA KEMBANG API & OPENING ===
    const fireworksBtn = document.getElementById("fireworksBtn");
    const heroTitle = document.getElementById("heroTitle");

    fireworksBtn.addEventListener("click", () => {
        var duration = 5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }, 
                colors: ['#d4af37', '#ffffff', '#c9a9a6'] 
            }));
        }, 250);
        
        heroTitle.innerText = "Horeeee HBD, Kak Anisaaaa";
        fireworksBtn.innerText = "Enjoy Your Night, Kak! ✨";
        fireworksBtn.style.background = "#c9a9a6";
        fireworksBtn.style.color = "#111";

        if (hbdAudio) {
            hbdAudio.play().catch(e => console.log("Lagu HBD belum disiapkan atau diblock browser."));
        }
    });

    // === 3. LOGIKA TYPEWRITER MESSAGE ===
    const message = Sengaja ngucapinnya malam-malam... Biar orang-orang berlomba jadi yang pertama menyambut hari bahagiamu, .tapi izinkan aku jadi yang terakhir menutupnya, karena aku cuma pengen memastikan hari Kak Anisa yang spesial ini benar-benar ditutup dengan senyum. Terima kasih sudah jadi partner yang luar biasa hebat, sabar, dan selalu ngasih energi terbaik walau situasinya kadang nggak ramah. Aku saksi betapa besar dedikasimu. Semoga panjang umur, selalu dikasih kesehatan buat ngejar semua mimpi-mimpinya, dan makin dilancarkan segala urusannya. Semoga di usia ini, Kak Anisa menemukan ketenangan hati, dikelilingi hal-hal yang menghargai value-mu, dan bahagia seutuhnya. You deserve it, Kak. Selamat istirahat ya.";
    const typedTextElement = document.getElementById("typed-text");
    let index = 0;
    let isTypewriterStarted = false;

    function typeWriter() {
        if (index < message.length) {
            typedTextElement.innerHTML += message.charAt(index);
            index++;
            setTimeout(typeWriter, 45); 
        }
    }

    window.addEventListener('scroll', () => {
        const messageSection = document.getElementById('message');
        if (!messageSection) return;
        const sectionTop = messageSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight / 1.5 && !isTypewriterStarted) {
            isTypewriterStarted = true;
            typeWriter();
        }
    });

    // === 4. LOGIKA LIGHTBOX GALERI ===
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeLightboxBtn = document.getElementById("closeLightbox");
    const galleryImages = document.querySelectorAll(".gallery-item");

    galleryImages.forEach(img => {
        img.addEventListener("click", function() {
            lightbox.classList.add("show");
            lightboxImg.src = this.src;
            const polaroidParent = this.closest('.polaroid');
            const captionText = polaroidParent.querySelector('.caption').innerText;
            lightboxCaption.innerText = captionText;
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("show");
        document.body.style.overflow = "auto";
    }

    closeLightboxBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
    });

    // === BARU: LOGIKA KUPON TERSIMPAN DI BROWSER ===
    // Cek kupon yang sudah diklaim saat web dibuka
    let savedVouchers = JSON.parse(localStorage.getItem('anisa_vouchers')) || [];
    const claimBtns = document.querySelectorAll('.btn-claim');
    
    claimBtns.forEach(btn => {
        let match = btn.getAttribute('onclick').match(/'([^']+)'/);
        if (match && savedVouchers.includes(match[1])) {
            btn.innerText = "Telah Diklaim ✅";
            btn.classList.add("claimed");
        }
    });

});

// === 5. LOGIKA KUPON SPESIAL ===
window.claimVoucher = function(btn, type) {
    if(btn.classList.contains('claimed')) return; 
    
    // Simpan ke memori HP Kak Anisa
    let savedVouchers = JSON.parse(localStorage.getItem('anisa_vouchers')) || [];
    if(!savedVouchers.includes(type)) {
        savedVouchers.push(type);
        localStorage.setItem('anisa_vouchers', JSON.stringify(savedVouchers));
    }
    
    alert(`Yeay! Kupon ${type} berhasil diklaim! Jangan lupa screenshot dan tagih ke Taufik besok ya! 🏃💨`);
    btn.innerText = "Telah Diklaim ✅";
    btn.classList.add("claimed");
}

// === 6. LOGIKA MAKE A WISH ===
const wishBtn = document.getElementById("wishBtn");
const wishInput = document.getElementById("wishInput");
const wishMessage = document.getElementById("wishMessage");
const shootingStarContainer = document.getElementById("shootingStarContainer");

if(wishBtn) {
    wishBtn.addEventListener("click", () => {
        const text = wishInput.value.trim();
        if(text === "") {
            alert("Harapannya diisi dulu dong kak, masa kosong... 🥺");
            return;
        }
        
        const starText = document.createElement("div");
        starText.classList.add("shooting-star-text");
        starText.innerText = text.length > 30 ? text.substring(0, 30) + "..." : text; 
        
        shootingStarContainer.appendChild(starText);
        
        wishInput.style.display = "none";
        wishBtn.style.display = "none";
        
        setTimeout(() => {
            wishMessage.innerHTML = "✨ Harapanmu sudah diterbangkan ke semesta ✨<br>Semoga lekas menjadi nyata ya!";
            wishMessage.style.display = "block";
            starText.remove(); 
        }, 2500);
    });
}

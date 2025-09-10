import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

export default function BirthdaySite() {
  const targetDate = new Date("2025-09-08T00:00:00").getTime(); // 🎂 Set birthday date here
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [forceUnlock, setForceUnlock] = useState(false);
  const [unlocked, setUnlocked] = useState(false); // prevent repeated unlock actions
  const [page, setPage] = useState("home");
  const audioRef = useRef(null);
  const countdownRef = useRef(null);

  // ✅ Unlock override (read once)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlUnlock = params.get("unlock") === "1";
      const storedUnlock = localStorage.getItem("unlock") === "1";
      if (urlUnlock || storedUnlock) setForceUnlock(true);
    } catch (e) {}
  }, []);

  // ⏱️ Countdown ticker (stops when unlocked)
  useEffect(() => {
    if (unlocked) return;
    countdownRef.current = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [unlocked]);

  // 🎊 Unlock actions — run only once when unlocked becomes true
  useEffect(() => {
    if ((timeLeft <= 0 || forceUnlock) && !unlocked) {
      setUnlocked(true);
      setShowConfetti(true);
      try { localStorage.setItem("unlock", "1"); } catch (e) {}

      // stop countdown to avoid further state churn
      if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }

      // fade in audio (attempt autoplay; browsers may block)
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise && playPromise.then) playPromise.catch(() => {});
        let vol = 0;
        const inc = setInterval(() => {
          vol += 0.02;
          audio.volume = Math.min(vol, 0.5);
          if (audio.volume >= 0.5) clearInterval(inc);
        }, 150);
      }

      const t = setTimeout(() => setShowConfetti(false), 14000);
      return () => clearTimeout(t);
    }
  }, [timeLeft, forceUnlock, unlocked]);

  const handwriting = "'Patrick Hand', cursive";
  const serif = "'Playfair Display', serif";

  const pageVariants = {
    initial: { opacity: 0, y: 12, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(8px)" },
  };

  // Lock screen
  if (!unlocked && timeLeft > 0 && !forceUnlock) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_#fff6f2,_#ffe6f7,_#fff)]">
        <div className="glass-premium p-10 max-w-2xl text-center animate-fade">
          <h2 style={{ fontFamily: serif }} className="text-4xl text-rose-700 mb-6 tracking-wide">Almost there...</h2>
          <div className="text-6xl font-bold text-rose-600 drop-shadow-md">{days}d {hours}h {minutes}m {seconds}s</div>
          <p className="mt-6 text-gray-700 italic">The surprise will bloom at midnight ✨</p>
        </div>
      </div>
    );
  }

  const PageWrapper = ({ children }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.65, ease: "easeInOut" }}
        className="max-w-5xl mx-auto"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );

  const polaroids = ["/pic1.jpg", "/pic2.jpg", "/pic3.jpg", "/pic4.jpg"];

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#fffaf7] via-[#fffdfb] to-[#f8fbff] relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Patrick+Hand&display=swap" rel="stylesheet" />

      {showConfetti && <Confetti recycle={false} numberOfPieces={250} gravity={0.03} colors={["#FFD700","#FFB347","#FFDEE9","#FFFFFF"]} />}

      <audio ref={audioRef} loop src="/birthday-song.mp3" preload="auto" />

      {/* Header */}
      <div className="glass-premium fixed top-6 left-1/2 transform -translate-x-1/2 px-8 py-4 flex items-center justify-between gap-6 z-20 shadow-lg">
        <h1 style={{ fontFamily: handwriting }} className="text-4xl text-rose-700 drop-shadow-sm">
          ✨ Happy Birthday <span className="text-rose-800 font-semibold">Sharvsssssssss</span>
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setPage('home')} className="btn-premium">Home</button>
          <button onClick={() => setPage('gallery')} className="btn-premium">Album</button>
        </div>
      </div>

      <div className="pt-28 relative z-10">
        <PageWrapper>
          {page === 'home' && (
            <motion.div className="p-6 text-center">
              <h2 style={{ fontFamily: serif }} className="text-5xl text-rose-700 mb-4 font-bold">A Premium Surprise Wall</h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-8 italic">Golden notes, glassy glow, and a photo album crafted with love.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <motion.div whileHover={{ scale: 1.05, rotate: -1 }} onClick={() => setPage('message')} className="sticky-note-premium note-gold">
                  <div className="note-text" style={{ fontFamily: handwriting }}>💌 Special Message</div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, rotate: 1 }} onClick={() => setPage('gift')} className="sticky-note-premium note-rose">
                  <div className="note-text" style={{ fontFamily: handwriting }}>🎁 Gift</div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, rotate: -1 }} onClick={() => setPage('gallery')} className="sticky-note-premium note-emerald">
                  <div className="note-text" style={{ fontFamily: handwriting }}>📖 Photo Album</div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, rotate: 1 }} onClick={() => setPage('music')} className="sticky-note-premium note-sky">
                  <div className="note-text" style={{ fontFamily: handwriting }}>🎶 Music</div>
                </motion.div>
              </div>

              <button className="cta-premium mt-10" onClick={() => alert('Here’s a slice of premium cake 🎂✨')}>Grab a Slice</button>
            </motion.div>
          )}

          {page === 'message' && (
            <motion.div className="p-8 glass-premium text-center">
              <h2 style={{ fontFamily: handwriting }} className="text-5xl text-rose-700 mb-4">💌 Special Message</h2>
              <p style={{ fontFamily: handwriting }} className="text-2xl text-gray-800 leading-relaxed whitespace-pre-line">
                HAPPY BADDAYYYY SHARVSSSSSSSSSS 🌸🌷🌹✨🌟{"\n"}
                So crazyyy thatt we just met lasttt yearrr and in this short timee we became so closeee frndsss.{"\n"}
                From random conversations and laughter to the memories created together feelsss crazyyy  all mean a lot to me and they all made it special by you just being around.{"\n"}
                I hope this year brings you lot of happiness 🎂✨️ goodd vibes 🌼 and memories which cherishh you.{"\n"}
                You really really deserve all the positivity and success which you see.{"\n"}
                Thank youuu for being such an amazing friend 🫶🫶🫶{"\n"}
                Wish you a very very happyyy birthdayyy once again — enjoy your dayyy att theee fulllesstt 🎁🎁🎁{"\n\n"}
                From,{"\n"}
                Bhaluuuu 🐻🐻
              </p>
              <button className="btn-premium mt-6" onClick={() => setPage('home')}>⬅ Back</button>
            </motion.div>
          )}

          {page === 'gift' && (
            <motion.div className="p-8 glass-premium text-center">
              <h2 style={{ fontFamily: handwriting }} className="text-5xl text-rose-700 mb-4">🎁 Gift</h2>
              <p style={{ fontFamily: handwriting }} className="text-2xl text-gray-800 leading-relaxed">A gift wrapped in stardust awaits you — check your inbox ✉️</p>
              <button className="btn-premium mt-6" onClick={() => setPage('home')}>⬅ Back</button>
            </motion.div>
          )}

          {page === 'gallery' && (
            <motion.div className="p-6 text-center">
              <h2 style={{ fontFamily: serif }} className="text-4xl text-rose-700 mb-6">📸 Polaroid Album</h2>
              <div className="album grid grid-cols-2 md:grid-cols-4 gap-6">
                {polaroids.map((src, i) => (
                  <motion.figure key={src} whileHover={{ rotate: i % 2 === 0 ? -2 : 2, scale: 1.08 }} className="polaroid-premium">
                    <img src={src} alt={`photo-${i}`} />
                    <figcaption style={{ fontFamily: handwriting }} className="caption">Memory #{i + 1}</figcaption>
                  </motion.figure>
                ))}
              </div>
              <button className="btn-premium mt-6" onClick={() => setPage('home')}>⬅ Back</button>
            </motion.div>
          )}

          {page === 'music' && (
            <motion.div className="p-8 glass-premium text-center">
              <h2 style={{ fontFamily: handwriting }} className="text-5xl text-rose-700 mb-4">🎶 Music</h2>
              <p style={{ fontFamily: handwriting }} className="text-xl text-gray-800">Every celebration deserves a soundtrack — yours begins here ❤️</p>
              <div className="mt-4">
                <a href="https://open.spotify.com/playlist/your-playlist-link" target="_blank" rel="noreferrer" className="underline text-rose-700 hover:text-rose-900">Open Playlist</a>
              </div>
              <button className="btn-premium mt-6" onClick={() => setPage('home')}>⬅ Back</button>
            </motion.div>
          )}
        </PageWrapper>
      </div>

      <style>{`
        .glass-premium{
          background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35));
          backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .sticky-note-premium{
          border-radius: 14px; padding: 28px; position: relative; cursor:pointer; text-align:center;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08), inset 0 -4px 12px rgba(255,255,255,0.6);
          font-size:1.5rem; transition: all 0.3s ease;
        }
        .note-text{ color:#4a2b36; font-weight:500; }
        .note-gold{ background:linear-gradient(180deg,#fff9e6,#ffe8b3); border:1px solid #f5d77b; }
        .note-rose{ background:linear-gradient(180deg,#fff0f5,#ffd6e7); border:1px solid #f5a3c7; }
        .note-emerald{ background:linear-gradient(180deg,#f0fff5,#c8f5da); border:1px solid #8fd4a4; }
        .note-sky{ background:linear-gradient(180deg,#f0f8ff,#cce4ff); border:1px solid #94c8ff; }
        .polaroid-premium{ background:#fff; padding:14px; border-radius:10px; box-shadow:0 12px 25px rgba(0,0,0,0.1); }
        .polaroid-premium img{ width:100%; height:160px; object-fit:cover; border-radius:8px; }
        .polaroid-premium .caption{ margin-top:8px; font-size:1rem; color:#555; }
        .btn-premium{ background:linear-gradient(90deg,#fff,#fffaf5); border:1px solid rgba(0,0,0,0.06); padding:8px 14px; border-radius:12px; box-shadow:0 6px 16px rgba(0,0,0,0.08); transition: all 0.3s ease; }
        .btn-premium:hover{ transform:translateY(-2px); box-shadow:0 10px 20px rgba(0,0,0,0.1); }
        .cta-premium{ background:linear-gradient(90deg,#ffd700,#ffae42); padding:12px 20px; border-radius:14px; box-shadow:0 12px 30px rgba(255,200,0,0.25); font-weight:700; color:#4a2b36; transition: all 0.3s ease; }
        .cta-premium:hover{ transform:scale(1.05); }
      `}</style>
    </div>
  );
}

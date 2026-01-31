const { useState, useEffect, useRef, useMemo } = React;

// --- ICONS ---
const IconWrapper = ({
  children,
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);
const Video = (props) => (
  <IconWrapper {...props}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </IconWrapper>
);
const Activity = (props) => (
  <IconWrapper {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </IconWrapper>
);
const CheckCircle2 = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
    <path d="m22 4 1 1" />
  </IconWrapper>
);
const AlertCircle = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </IconWrapper>
);
const FlagIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </IconWrapper>
);
const Play = (props) => (
  <IconWrapper {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </IconWrapper>
);
const Square = (props) => (
  <IconWrapper {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
  </IconWrapper>
);
const Maximize2 = (props) => (
  <IconWrapper {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </IconWrapper>
);
const Minimize2 = (props) => (
  <IconWrapper {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" x2="21" y1="10" y2="3" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </IconWrapper>
);
const Info = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="16" y2="12" />
    <line x1="12" x2="12.01" y1="8" y2="8" />
  </IconWrapper>
);
const X = (props) => (
  <IconWrapper {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconWrapper>
);
const Check = (props) => (
  <IconWrapper {...props}>
    <polyline points="20 6 9 17 4 12" />
  </IconWrapper>
);
const GridIcon = (props) => (
  <IconWrapper {...props}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </IconWrapper>
);
const ScanIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="3" x2="21" y1="12" y2="12" />
  </IconWrapper>
);

// --- LOGIC SEMAPHORE ---
const TABLE_MAPPING = {
  "1-2": "A",
  "1-3": "B",
  "1-4": "C",
  "1-5": "D",
  "1-6": "E",
  "1-7": "F",
  "1-8": "G",
  "2-3": "H",
  "2-4": "I",
  "2-5": "K",
  "2-6": "L",
  "2-7": "M",
  "2-8": "N",
  "3-4": "O",
  "3-5": "P",
  "3-6": "Q",
  "3-7": "R",
  "3-8": "S",
  "4-5": "T",
  "4-6": "U",
  "4-7": "Y",
  "5-7": "J",
  "5-8": "V",
  "6-7": "W",
  "6-8": "X",
  "7-8": "Z",
};

const LETTER_MAPPING = {};
const LETTERS = [];
Object.entries(TABLE_MAPPING).forEach(([key, val]) => {
  if (val) {
    LETTER_MAPPING[val] = key.split("-").map(Number);
    LETTERS.push(val);
  }
});

// --- ANIMATED SEMAPHORE COMPONENT ---
const SemaphoreVisualizer = ({ letter }) => {
  const targets = LETTER_MAPPING[letter] || [1, 1];
  const CENTER_X = 100,
    CENTER_Y = 100;
  const MAIN_CIRCLE_RADIUS = 85,
    NUMBER_RADIUS = 115,
    AIM_RADIUS = 72,
    CHAR_SCALE = 0.75;
  const SHOULDER_L = { x: 85, y: 100 },
    SHOULDER_R = { x: 115, y: 100 };

  const getPointCoords = (index, radius) => {
    const angleMap = {
      1: 90,
      2: 135,
      3: 180,
      4: 225,
      5: 270,
      6: 315,
      7: 0,
      8: 45,
    };
    const angleRad = angleMap[index] * (Math.PI / 180);
    return {
      x: CENTER_X + radius * Math.cos(angleRad),
      y: CENTER_Y + radius * Math.sin(angleRad),
      index,
    };
  };

  const p1 = getPointCoords(targets[0], AIM_RADIUS),
    p2 = getPointCoords(targets[1], AIM_RADIUS);
  let targetL, targetR;
  if (p1.x < p2.x) {
    targetL = p1;
    targetR = p2;
  } else {
    targetL = p2;
    targetR = p1;
  }

  const calculateArmAngle = (shoulder, target) => {
    if (target.index === 5) return 0;
    const dx = target.x - shoulder.x,
      dy = target.y - shoulder.y;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  };

  const angleL = calculateArmAngle(SHOULDER_L, targetL);
  const angleR = calculateArmAngle(SHOULDER_R, targetR);

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full h-full">
      <div className="relative w-full h-full flex items-center justify-center drop-shadow-xl max-w-[320px] max-h-[320px] aspect-square">
        <svg
          viewBox="-35 -35 270 270"
          className="w-full h-full overflow-visible"
        >
          <circle
            cx="100"
            cy="100"
            r={MAIN_CIRCLE_RADIUS}
            fill="#F5E9D3"
            stroke="#8B4513"
            strokeWidth="3"
          />
          <g
            transform={`translate(100, 100) scale(${CHAR_SCALE}) translate(-100, -100)`}
          >
            <g transform="translate(100, 130)">
              <path
                d="M-15 60 L-15 30 L15 30 L15 60"
                fill="none"
                stroke="#5C3A21"
                strokeWidth="3"
              />
              <rect
                x="-15"
                y="-30"
                width="30"
                height="60"
                rx="5"
                fill="white"
                stroke="#5C3A21"
                strokeWidth="3"
              />
              <circle
                cx="0"
                cy="-45"
                r="12"
                fill="white"
                stroke="#5C3A21"
                strokeWidth="3"
              />
              <path
                d="M-14 -50 L14 -50 L16 -60 L-12 -58 Z"
                fill="#8B4513"
              />
            </g>
            <g
              transform={`translate(85, 100) rotate(${angleL})`}
              className="transition-transform duration-500 ease-out"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-55"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <g transform="translate(0, -55) rotate(-90)">
                <line
                  x1="0"
                  y1="0"
                  x2="22"
                  y2="0"
                  stroke="#8B4513"
                  strokeWidth="3"
                />
                <g transform="translate(5, -12)">
                  <rect
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    fill="#FFFF00"
                    stroke="#5C3A21"
                    strokeWidth="1"
                  />
                  <path d="M0 0 L24 24 L0 24 Z" fill="#FF0000" />
                </g>
              </g>
              <circle cx="0" cy="0" r="4" fill="#5C3A21" />
            </g>
            <g
              transform={`translate(115, 100) rotate(${angleR})`}
              className="transition-transform duration-500 ease-out"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-55"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <g transform="translate(0, -55) rotate(90)">
                <line
                  x1="0"
                  y1="0"
                  x2="-22"
                  y2="0"
                  stroke="#8B4513"
                  strokeWidth="3"
                />
                <g transform="translate(-29, -12)">
                  <rect
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    fill="#FFFF00"
                    stroke="#5C3A21"
                    strokeWidth="1"
                  />
                  <path d="M0 0 L24 24 L0 24 Z" fill="#FF0000" />
                </g>
              </g>
              <circle cx="0" cy="0" r="4" fill="#5C3A21" />
            </g>
          </g>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const pos = getPointCoords(num, NUMBER_RADIUS);
            const isActive = targets.includes(num);
            return (
              <g key={num}>
                <line
                  x1={
                    100 +
                    MAIN_CIRCLE_RADIUS *
                      Math.cos(Math.atan2(pos.y - 100, pos.x - 100))
                  }
                  y1={
                    100 +
                    MAIN_CIRCLE_RADIUS *
                      Math.sin(Math.atan2(pos.y - 100, pos.x - 100))
                  }
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#8B4513"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="12"
                  fill={isActive ? "#8B4513" : "#fff"}
                  stroke="#8B4513"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  dy="4"
                  textAnchor="middle"
                  fill={isActive ? "#FFF" : "#8B4513"}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const Header = ({ currentView, onViewChange }) => (
  <header className="bg-pramuka-brown text-white shadow-lg relative overflow-hidden z-50">
    <div className="absolute bottom-0 left-0 w-full h-1.5 semaphore-stripe z-20"></div>
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
      <div className="flex items-center space-x-3">
        <div className="bg-pramuka-cream p-2 rounded-full text-pramuka-brown border-2 border-pramuka-gold">
          <FlagIcon size={24} fill="#8B4513" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide font-serif">
            Semafor AI
          </h1>
          <p className="text-xs text-pramuka-cream opacity-90 font-mono">
            YOLOv12 • Pose Estimation
          </p>
        </div>
      </div>
      <button
        onClick={() =>
          onViewChange(currentView === "app" ? "guide" : "app")
        }
        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
        title={
          currentView === "app" ? "Lihat Panduan" : "Kembali ke Kamera"
        }
      >
        {currentView === "app" ? (
          <GridIcon size={24} />
        ) : (
          <ScanIcon size={24} />
        )}
      </button>
    </div>
  </header>
);

const StatusBadge = ({ label, active, color = "green" }) => (
  <div
    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-all ${
      active
        ? `bg-${color}-100 text-${color}-800 border-${color}-300`
        : "bg-gray-100 text-gray-500 border-gray-200"
    }`}
  >
    {active ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
    <span>{label}</span>
  </div>
);

// --- AUDIO HANDLER ---
// Fungsi ini akan memutar file audio dari folder lokal 'assets/audio/'
const playAudio = (filename) => {
  try {
    // Pastikan path ini sesuai dengan struktur folder Anda
    const audio = new Audio(`./assets/audio/${filename}.mp3`);
    audio
      .play()
      .catch((e) =>
        console.log("Audio play error (interaction needed?):", e)
      );
  } catch (err) {
    console.error("Error loading audio:", err);
  }
};

const HoldProgress = ({ progress }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const secondsLeft = Math.ceil((100 - progress) / 33);

  return (
    <div className="relative flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-full p-4 animate-scale-in">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="white"
          strokeWidth="8"
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#4A6B3C"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-100 ease-linear opacity-90"
        />
      </svg>
      <div className="absolute text-white font-bold text-center">
        <div className="text-sm uppercase tracking-widest mb-1 opacity-90">
          TAHAN
        </div>
        <div className="text-5xl font-black">{secondsLeft}</div>
      </div>
    </div>
  );
};

const CameraFrame = ({
  isDetecting,
  overlayLetter,
  isFullScreen,
  onToggleFullScreen,
  onToggleDetection,
  mode,
  quizTarget,
  quizFeedback,
  holdProgress,
  isPaused,
  isPreparing,
  showNormalOverlay = true,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (e) {
          console.error("Fallback failed", e);
        }
      }
    };
    startCamera();

    const handleFullScreenChange = () => {
      onToggleFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
    };
  }, [onToggleFullScreen]);

  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      try {
        if (
          containerRef.current &&
          containerRef.current.requestFullscreen
        ) {
          await containerRef.current.requestFullscreen();
        } else {
          onToggleFullScreen(true);
        }
      } catch (err) {
        onToggleFullScreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
      onToggleFullScreen(false);
    }
  };

  const isFallbackMode = isFullScreen && !document.fullscreenElement;

  const containerClass = isFullScreen
    ? isFallbackMode
      ? "fixed inset-0 z-[100] bg-black flex items-center justify-center w-screen h-screen"
      : "bg-black flex items-center justify-center w-full h-full"
    : "relative w-full aspect-video rounded-xl shadow-2xl p-1.5 semaphore-stripe group";

  const videoClass = isFullScreen
    ? "w-full h-full object-cover transform scale-x-[-1]"
    : "w-full h-full object-cover transform scale-x-[-1] bg-black rounded-lg";

  const feedbackBg =
    quizFeedback === "correct" ? "bg-green-500" : "bg-red-500";
  const feedbackIcon =
    quizFeedback === "correct" ? <Check size={64} /> : <X size={64} />;

  return (
    <div ref={containerRef} className={containerClass}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={videoClass}
      />

      <button
        onClick={toggleFullScreen}
        className={`absolute top-6 right-6 z-[120] bg-black/60 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all shadow-lg border border-white/30 ${
          isFullScreen ? "p-3" : "p-2"
        }`}
        title={isFullScreen ? "Keluar Fullscreen" : "Fullscreen"}
      >
        {isFullScreen ? <Minimize2 size={28} /> : <Maximize2 size={24} />}
      </button>

      {isFullScreen && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[110]">
          <button
            onClick={onToggleDetection}
            className={`px-8 py-3 rounded-full font-bold text-lg shadow-xl backdrop-blur-md border-2 transition-all flex items-center space-x-3 ${
              isDetecting
                ? "bg-red-600/80 hover:bg-red-700/90 border-red-400 text-white"
                : "bg-pramuka-green/90 hover:bg-green-800/90 border-green-400 text-white"
            }`}
          >
            {isDetecting ? (
              <Square size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
            <span>{isDetecting ? "BERHENTI" : "MULAI"}</span>
          </button>
        </div>
      )}

      {mode === "detect" && (
        <>
          {(isFullScreen || (!isFullScreen && showNormalOverlay)) &&
            overlayLetter && (
              <div
                className={`absolute right-20 z-40 bg-pramuka-brown text-white flex items-center justify-center rounded-lg font-bold shadow-lg animate-bounce border-2 border-[#D4AF37] ${
                  isFullScreen
                    ? "top-6 w-16 h-16 text-4xl right-24 mr-4"
                    : "top-6 w-16 h-16 text-3xl"
                }`}
              >
                {overlayLetter}
              </div>
            )}
          {isFullScreen && overlayLetter && (
            <div className="absolute bottom-6 left-6 z-[110] animate-slide-up flex items-end">
              <div className="relative w-48 h-48 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-pramuka-brown overflow-visible p-1">
                <SemaphoreVisualizer letter={overlayLetter} />
              </div>
            </div>
          )}
        </>
      )}

      {mode === "quiz" && isDetecting && (
        <>
          <div className="absolute bottom-6 left-6 z-[110] flex flex-col items-center animate-slide-up">
            <div className="bg-pramuka-dark text-white px-6 py-2 rounded-t-xl font-bold uppercase tracking-widest text-xs border-x-2 border-t-2 border-[#D4AF37]">
              Target
            </div>
            <div className="bg-white/90 backdrop-blur-md text-pramuka-brown w-32 h-32 flex items-center justify-center rounded-b-xl rounded-tr-xl border-4 border-pramuka-brown shadow-2xl">
              <span className="text-7xl font-black">{quizTarget}</span>
            </div>
          </div>

          {!isPreparing && !isPaused && quizFeedback === "holding" && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[120]">
              <HoldProgress progress={holdProgress} />
            </div>
          )}

          {(quizFeedback === "correct" || quizFeedback === "wrong") && (
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[130] ${feedbackBg} text-white w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl border-8 border-white/30 animate-pop-center`}
            >
              {feedbackIcon}
              <span className="font-bold mt-1 text-lg tracking-wider">
                {quizFeedback === "correct" ? "BENAR" : "SALAH"}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SemaphoreGuide = () => {
  const [hoveredLetter, setHoveredLetter] = useState("A");
  const getLetterFromCoords = (row, col) => {
    if (col >= row) return null;
    const key = `${col}-${row}`;
    return TABLE_MAPPING[key] || null;
  };
  return (
    <div className="p-6 max-w-7xl mx-auto animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-pramuka-brown">
        <div className="text-center mb-8 bg-red-600 text-yellow-300 py-2 rounded-lg shadow-md border-b-4 border-yellow-500">
          <h2 className="text-3xl font-black tracking-widest uppercase">
            LINGKARAN SEMAPHORE
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-10 items-stretch justify-center relative">
          <div className="w-full md:w-1/3 border-4 border-white rounded-xl relative">
            <div className="flex flex-col items-center justify-center p-4 h-full">
              <div className="w-80 h-80 relative">
                <SemaphoreVisualizer letter={hoveredLetter} />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 overflow-x-auto rounded-xl border-4 border-pramuka-brown shadow-lg bg-white p-1">
            <table className="guide-table">
              <thead>
                <tr>
                  <th className="border-pramuka-cream bg-pramuka-brown"></th>
                  {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[2, 3, 4, 5, 6, 7, 8].map((row) => (
                  <tr key={row}>
                    <th>{row}</th>
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => {
                      const letter = getLetterFromCoords(row, col);
                      return (
                        <td
                          key={col}
                          className={
                            letter ? "cell-filled" : "cell-empty"
                          }
                          onMouseEnter={() =>
                            letter && setHoveredLetter(letter)
                          }
                        >
                          {letter || ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-center text-xs text-gray-500 italic bg-[#F5E9D3] mt-1 border-t-2 border-pramuka-brown/20">
              *Arahkan kursor pada huruf untuk melihat posisi lengan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("app");
  const [activeTab, setActiveTab] = useState("detect");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const [quizMode, setQuizMode] = useState("sequential");
  const [quizTarget, setQuizTarget] = useState("A");

  const [quizFeedback, setQuizFeedback] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isDetecting && view === "app") {
      interval = setInterval(() => {
        if (isPaused || isPreparing) return;

        if (activeTab === "detect") {
          if (Math.random() > 0.95) {
            const randomLetter =
              LETTERS[Math.floor(Math.random() * LETTERS.length)];
            handleDetection(randomLetter);
          }
        } else if (activeTab === "quiz") {
          const isCorrectPose = Math.random() > 0.7 || holdProgress > 0;
          if (
            isCorrectPose &&
            quizFeedback !== "wrong" &&
            quizFeedback !== "correct"
          ) {
            setQuizFeedback("holding");
            setHoldProgress((prev) => {
              const newProgress = prev + 4;

              const secondsLeft = Math.ceil((100 - newProgress) / 33);
              if (
                secondsLeft > 0 &&
                secondsLeft <= 3 &&
                secondsLeft !== lastSpokenRef.current
              ) {
                // Play countdown audio 3, 2, 1
                playAudio(String(secondsLeft));
                lastSpokenRef.current = secondsLeft;
              }

              if (newProgress >= 100) {
                handleQuizSuccess();
                return 0;
              }
              return newProgress;
            });
          } else {
            if (
              Math.random() > 0.98 &&
              holdProgress === 0 &&
              quizFeedback !== "correct"
            ) {
              handleQuizWrong();
            } else if (holdProgress > 0 && Math.random() > 0.9) {
              setHoldProgress(0);
              setQuizFeedback(null);
              lastSpokenRef.current = null;
            }
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [
    isDetecting,
    activeTab,
    quizTarget,
    holdProgress,
    quizFeedback,
    isPaused,
    isPreparing,
    view,
  ]);

  const handleDetection = (letter) => {
    setDetectedLetter(letter);
    // Play letter audio for detection mode
    playAudio(letter.toLowerCase());
  };

  const handleQuizSuccess = () => {
    setQuizFeedback("correct");
    playAudio("benar"); // Play "Benar"
    setHoldProgress(0);
    lastSpokenRef.current = null;
    setIsPaused(true);
    setTimeout(() => {
      setQuizFeedback(null);
      let newTarget = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      setQuizTarget(newTarget);
      setIsPreparing(true);
      playAudio(newTarget.toLowerCase()); // Play next target letter
      setTimeout(() => setIsPreparing(false), 2000);
      setIsPaused(false);
    }, 3000);
  };

  const handleQuizWrong = () => {
    setQuizFeedback("wrong");
    playAudio("salah"); // Play "Salah"
    setHoldProgress(0);
    lastSpokenRef.current = null;
    setTimeout(() => {
      setQuizFeedback(null);
    }, 2000);
  };

  const toggleDetection = () => {
    if (!isDetecting) {
      setIsDetecting(true);
      if (activeTab === "quiz") {
        setIsPreparing(true);
        playAudio("mulai");
        setTimeout(() => {
          playAudio(quizTarget.toLowerCase());
        }, 1000);
        setTimeout(() => {
          setIsPreparing(false);
        }, 2000);
      } else {
        playAudio("mulai");
      }
    } else {
      setIsDetecting(false);
      setHoldProgress(0);
      setQuizFeedback(null);
      setIsPaused(false);
      setIsPreparing(false);
      lastSpokenRef.current = null;
      playAudio("berhenti");
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-4 relative bg-[#F5E9D3]">
      {!isFullScreen && (
        <React.Fragment>
          <div
            className="fixed inset-0 pointer-events-none z-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(#8B4513 0.8px, transparent 0.8px), radial-gradient(#8B4513 0.8px, #F5E9D3 0.8px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          ></div>
          <Header currentView={view} onViewChange={setView} />

          {view === "app" && (
            <div className="bg-white shadow-md sticky top-0 z-40 border-b border-pramuka-brown/20">
              <div className="max-w-3xl mx-auto flex">
                <button
                  onClick={() => {
                    setActiveTab("detect");
                    setIsDetecting(false);
                  }}
                  className={`flex-1 py-4 text-center font-bold tracking-wide transition-colors flex justify-center items-center space-x-2 ${
                    activeTab === "detect"
                      ? "border-b-4 border-red-600 text-pramuka-brown bg-orange-50/50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Video size={20} />
                  <span>DETEKSI</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("quiz");
                    setIsDetecting(false);
                  }}
                  className={`flex-1 py-4 text-center font-bold tracking-wide transition-colors flex justify-center items-center space-x-2 ${
                    activeTab === "quiz"
                      ? "border-b-4 border-yellow-500 text-pramuka-brown bg-green-50/50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Activity size={20} />
                  <span>KUIS</span>
                </button>
              </div>
            </div>
          )}
        </React.Fragment>
      )}

      <main
        className={`flex-grow w-full ${
          isFullScreen ? "" : "max-w-7xl mx-auto px-4 py-8 z-10"
        }`}
      >
        {view === "guide" ? (
          <SemaphoreGuide />
        ) : (
          <>
            {!isFullScreen && (
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <StatusBadge label="YOLOv12 Loaded" active={true} />
                <StatusBadge label="Camera Ready" active={isDetecting} />
                <StatusBadge
                  label="Active"
                  active={isDetecting}
                  color={isDetecting ? "green" : "gray"}
                />
              </div>
            )}

            {activeTab === "detect" && (
              <div
                className={
                  isFullScreen ? "" : "grid md:grid-cols-12 gap-8"
                }
              >
                <div
                  className={
                    isFullScreen
                      ? "w-full h-full"
                      : "md:col-span-7 space-y-4"
                  }
                >
                  <div
                    className={
                      isFullScreen
                        ? ""
                        : "bg-pramuka-brown p-3 rounded-2xl shadow-xl border border-[#5C3A21] transform rotate-1"
                    }
                  >
                    <div
                      className={
                        isFullScreen ? "" : "transform -rotate-1"
                      }
                    >
                      <CameraFrame
                        mode="detect"
                        isDetecting={isDetecting}
                        overlayLetter={detectedLetter}
                        isFullScreen={isFullScreen}
                        onToggleFullScreen={setIsFullScreen}
                        onToggleDetection={toggleDetection}
                        showNormalOverlay={false}
                      />
                    </div>
                  </div>

                  {!isFullScreen && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={toggleDetection}
                        className={`px-8 py-4 rounded-lg font-black tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center space-x-2 text-white ${
                          isDetecting
                            ? "bg-red-700 border-2 border-red-900"
                            : "bg-pramuka-green border-2 border-green-800"
                        }`}
                      >
                        {isDetecting ? (
                          <Square size={20} fill="currentColor" />
                        ) : (
                          <Play size={20} fill="currentColor" />
                        )}
                        <span>
                          {isDetecting
                            ? "BERHENTI DETEKSI"
                            : "MULAI DETEKSI"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {!isFullScreen && (
                  <div className="md:col-span-5 space-y-6">
                    <div className="glass-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden bg-white">
                      <h3 className="text-pramuka-brown font-black text-xl flex items-center justify-center mb-6 border-b-2 border-dashed border-pramuka-brown/20 pb-4">
                        VISUALISASI SINYAL
                      </h3>
                      {detectedLetter ? (
                        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                          <div className="text-8xl font-black text-pramuka-brown drop-shadow-[2px_2px_0px_#D4AF37] mb-4">
                            {detectedLetter}
                          </div>
                          <div className="w-80 h-80">
                            <SemaphoreVisualizer
                              letter={detectedLetter}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                          <div className="w-40 h-40 rounded-full border-4 border-dotted border-pramuka-brown/30 flex items-center justify-center mb-4 animate-spin-slow bg-pramuka-cream/30">
                            <span className="text-6xl font-serif text-pramuka-brown/40">
                              ?
                            </span>
                          </div>
                          <p className="font-bold text-pramuka-brown/50">
                            MENUNGGU SINYAL...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "quiz" && (
              <div
                className={
                  isFullScreen ? "" : "grid md:grid-cols-12 gap-8"
                }
              >
                <div
                  className={
                    isFullScreen
                      ? "w-full h-full"
                      : "md:col-span-12 space-y-4"
                  }
                >
                  {!isFullScreen && (
                    <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-pramuka-brown mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="font-black text-pramuka-brown uppercase tracking-widest">
                          Mode:
                        </span>
                        <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                          <button
                            onClick={() => setQuizMode("sequential")}
                            className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                              quizMode === "sequential"
                                ? "bg-white shadow text-pramuka-green"
                                : "text-gray-400"
                            }`}
                          >
                            A-Z
                          </button>
                          <button
                            onClick={() => setQuizMode("random")}
                            className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                              quizMode === "random"
                                ? "bg-white shadow text-pramuka-green"
                                : "text-gray-400"
                            }`}
                          >
                            Acak
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 text-right text-sm text-gray-600 leading-tight">
                        <span className="font-bold text-pramuka-brown block mb-1 flex items-center justify-end gap-1">
                          <Info size={16} /> CARA BERMAIN:
                        </span>
                        Tiru pose huruf target. Tahan selama 3 detik untuk
                        menjawab.
                      </div>
                    </div>
                  )}

                  <div
                    className={
                      isFullScreen
                        ? ""
                        : "bg-pramuka-brown p-3 rounded-2xl shadow-xl border border-[#5C3A21] transform rotate-1"
                    }
                  >
                    <div
                      className={
                        isFullScreen ? "" : "transform -rotate-1"
                      }
                    >
                      <CameraFrame
                        mode="quiz"
                        isDetecting={isDetecting}
                        isFullScreen={isFullScreen}
                        onToggleFullScreen={setIsFullScreen}
                        onToggleDetection={toggleDetection}
                        quizTarget={quizTarget}
                        quizFeedback={quizFeedback}
                        holdProgress={holdProgress}
                        isPaused={isPaused}
                        isPreparing={isPreparing}
                        showNormalOverlay={true}
                      />
                    </div>
                  </div>

                  {!isFullScreen && (
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={toggleDetection}
                        className={`px-8 py-4 rounded-lg font-black tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center space-x-2 text-white ${
                          isDetecting
                            ? "bg-red-700 border-2 border-red-900"
                            : "bg-pramuka-green border-2 border-green-800"
                        }`}
                      >
                        {isDetecting ? (
                          <Square size={20} fill="currentColor" />
                        ) : (
                          <Play size={20} fill="currentColor" />
                        )}
                        <span>
                          {isDetecting
                            ? "BERHENTI LATIHAN"
                            : "MULAI LATIHAN"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-pramuka-brown text-pramuka-cream py-4 text-center text-sm font-semibold mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 semaphore-stripe z-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 z-0"></div>
        <span className="relative z-10 font-serif tracking-wider">
          made by El
        </span>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

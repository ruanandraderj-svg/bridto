/* BRIØ dpto. — script.js */

// =============================================
// HERO REAL BLACK SHIRT + DYNAMIC PRINT ANIMATION
// =============================================
(function() {
  const container = document.getElementById('heroShirtContainer');
  const canvas = document.getElementById('shirtPrintCanvas');
  const heroSection = document.getElementById('hero');
  const shirtImg = document.getElementById('heroShirtImg');
  if (!container || !canvas) return;

  // --- Auto-remove white background from black shirt photo ---
  if (shirtImg) {
    const removeWhiteBg = () => {
      try {
        const c = document.createElement('canvas');
        c.width = shirtImg.naturalWidth || 800;
        c.height = shirtImg.naturalHeight || 1000;
        const cCtx = c.getContext('2d');
        cCtx.drawImage(shirtImg, 0, 0);
        const imgData = cCtx.getImageData(0, 0, c.width, c.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 205 && data[i + 1] > 205 && data[i + 2] > 205) {
            data[i + 3] = 0;
          }
        }
        cCtx.putImageData(imgData, 0, 0);
        shirtImg.src = c.toDataURL('image/png');
        shirtImg.style.mixBlendMode = 'normal';
      } catch (e) {
        console.log('Bg remove:', e);
      }
    };
    if (shirtImg.complete && shirtImg.naturalWidth > 0) removeWhiteBg();
    else shirtImg.addEventListener('load', removeWhiteBg, { once: true });
  }

  // --- Auto-remove background from official logo image ---
  const cleanLogoImgs = document.querySelectorAll('.brand-logo-img');
  cleanLogoImgs.forEach(img => {
    const processLogo = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth || 600;
        c.height = img.naturalHeight || 400;
        const cCtx = c.getContext('2d');
        cCtx.drawImage(img, 0, 0);
        const imgData = cCtx.getImageData(0, 0, c.width, c.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 190 && data[i + 1] > 185 && data[i + 2] > 170) {
            data[i + 3] = 0;
          }
        }
        cCtx.putImageData(imgData, 0, 0);
        img.src = c.toDataURL('image/png');
        img.style.mixBlendMode = 'normal';
      } catch (e) {}
    };
    if (img.complete && img.naturalWidth > 0) processLogo();
    else img.addEventListener('load', processLogo, { once: true });
  });

  const ctx = canvas.getContext('2d');
  let W, H;

  const brioLogoImg = new Image();
  brioLogoImg.src = 'assets/brio_logo.png';

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    W = canvas.width = rect.width * window.devicePixelRatio;
    H = canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  // --- Dynamic Prints Data ---
  const PRINTS = [
    {
      title: "BRIØ",
      sub: "dpto. — PE",
      tag: "DEPARTAMENTO CRIATIVO",
      code: "8°03'S 34°52'W",
      type: "brand"
    },
    {
      title: "MODELO 01",
      sub: "DTF ULTRA HD",
      tag: "100% PERSONALIZADO",
      code: "RECIFE / PE",
      type: "editorial"
    },
    {
      title: "ESTAMPA",
      sub: "SUA IDEIA AQUI",
      tag: "COLEÇÃO 2025",
      code: "BRIØ STUDIO",
      type: "custom"
    },
    {
      title: "STREETWEAR",
      sub: "QUIET LUXURY",
      tag: "LIMITED DROP",
      code: "Nº 001/100",
      type: "badge"
    }
  ];

  let currentPrintIdx = 0;
  let printProgress = 0; // 0 to 1 fade/reveal
  let isTransitioning = false;
  let t = 0;

  // Change print every 3.5 seconds
  setInterval(() => {
    isTransitioning = true;
  }, 3500);

  // --- Render Print on Black Shirt ---
  function drawPrint() {
    const rW = W / window.devicePixelRatio;
    const rH = H / window.devicePixelRatio;
    if (!rW || !rH) return;

    ctx.clearRect(0, 0, rW, rH);
    t += 0.02;

    // Handle print transition
    if (isTransitioning) {
      printProgress += 0.03;
      if (printProgress >= 1) {
        printProgress = 0;
        isTransitioning = false;
        currentPrintIdx = (currentPrintIdx + 1) % PRINTS.length;
      }
    }

    const print = PRINTS[currentPrintIdx];
    const nextPrint = PRINTS[(currentPrintIdx + 1) % PRINTS.length];

    // Print Area bounds on shirt chest (center of image)
    const chestX = rW * 0.5;
    const chestY = rH * 0.44;
    const printW = rW * 0.42;

    ctx.save();
    ctx.translate(chestX, chestY);

    // Opacity based on transition
    const alpha = isTransitioning ? Math.cos(printProgress * Math.PI * 0.5) : 1;
    const nextAlpha = isTransitioning ? Math.sin(printProgress * Math.PI * 0.5) : 0;

    // Helper to render one print design
    function renderDesign(p, opacity) {
      if (opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = opacity * 0.92;

      // Off-white / Cream print color
      const printColor = '#F2EFE8';
      const oliveColor = '#8A9A7B';

      if (p.type === 'brand') {
        // Design 1: Official BRIØ dpto. Logo
        if (brioLogoImg.complete && brioLogoImg.naturalWidth > 0) {
          const lW = printW * 0.85;
          const lH = lW * (brioLogoImg.naturalHeight / brioLogoImg.naturalWidth);
          ctx.drawImage(brioLogoImg, -lW / 2, -lH / 2 - 10, lW, lH);
        } else {
          ctx.font = `900 ${printW * 0.38}px 'Playfair Display', serif`;
          ctx.fillStyle = printColor;
          ctx.textAlign = 'center';
          ctx.fillText(p.title, 0, -10);
        }
      } 
      else if (p.type === 'editorial') {
        // Design 2: Editorial Poster Style
        ctx.fillStyle = printColor;
        ctx.font = `900 ${printW * 0.32}px 'Bebas Neue', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.title, 0, -15);

        ctx.font = `600 ${printW * 0.09}px 'Inter', sans-serif`;
        ctx.fillStyle = oliveColor;
        ctx.letterSpacing = '0.2em';
        ctx.fillText(p.sub, 0, printW * 0.05);

        ctx.beginPath();
        ctx.moveTo(-printW * 0.35, printW * 0.12);
        ctx.lineTo(printW * 0.35, printW * 0.12);
        ctx.strokeStyle = printColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = `400 ${printW * 0.065}px 'Inter', sans-serif`;
        ctx.fillStyle = printColor;
        ctx.fillText(p.tag, 0, printW * 0.2);
      }
      else if (p.type === 'custom') {
        // Design 3: Custom Stamp
        ctx.strokeStyle = oliveColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -10, printW * 0.28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = `900 ${printW * 0.18}px 'Bebas Neue', sans-serif`;
        ctx.fillStyle = printColor;
        ctx.textAlign = 'center';
        ctx.fillText(p.title, 0, -12);

        ctx.font = `500 ${printW * 0.075}px 'Inter', sans-serif`;
        ctx.fillStyle = printColor;
        ctx.fillText(p.sub, 0, printW * 0.06);

        ctx.font = `400 ${printW * 0.055}px 'Inter', sans-serif`;
        ctx.fillStyle = oliveColor;
        ctx.fillText(p.code, 0, printW * 0.17);
      }
      else {
        // Design 4: Streetwear Badge
        ctx.fillStyle = printColor;
        ctx.fillRect(-printW * 0.4, -printW * 0.25, printW * 0.8, printW * 0.48);

        ctx.fillStyle = '#1A1A18'; // Dark inner
        ctx.font = `900 ${printW * 0.2}px 'Bebas Neue', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.title, 0, -5);

        ctx.font = `600 ${printW * 0.07}px 'Inter', sans-serif`;
        ctx.fillText(p.sub, 0, printW * 0.12);
      }

      ctx.restore();
    }

    renderDesign(print, alpha);
    if (isTransitioning) {
      renderDesign(nextPrint, nextAlpha);

      // Print scan line effect
      const scanY = (printProgress - 0.5) * printW * 0.8;
      ctx.beginPath();
      ctx.moveTo(-printW * 0.45, scanY);
      ctx.lineTo(printW * 0.45, scanY);
      ctx.strokeStyle = '#4A5240';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();

    // Floating technical crosshairs
    const crossX = rW * 0.5 + Math.sin(t) * 10;
    const crossY = rH * 0.44 + Math.cos(t * 0.7) * 8;
    ctx.strokeStyle = 'rgba(74,82,64,0.25)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(crossX - 12, crossY); ctx.lineTo(crossX + 12, crossY);
    ctx.moveTo(crossX, crossY - 12); ctx.lineTo(crossX, crossY + 12);
    ctx.stroke();

    requestAnimationFrame(drawPrint);
  }

  // --- Interactive Parallax Float ---
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      const transX = relX * 28;
      const transY = relY * 20;
      const rot = relX * 4;

      container.style.transform = `translate(${transX}px, ${transY}px) rotate(${rot}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      container.style.transform = `translate(0px, 0px) rotate(0deg)`;
    });
  }

  window.addEventListener('resize', resizeCanvas);
  document.fonts.ready.then(() => {
    resizeCanvas();
    drawPrint();
  });
})();

// =============================================
// Custom Cursor
// =============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverEls = document.querySelectorAll('a, button, .peca-btn, .cor-btn, .pos-btn');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
});

// =============================================
// Navigation: hide on scroll down, show on up
// =============================================
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  if (current > lastScroll && current > 200) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
  lastScroll = current;
});

// =============================================
// Mobile Menu
// =============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  hamburger.querySelector('span:first-child').style.transform = menuOpen ? 'rotate(45deg) translateY(6px)' : '';
  hamburger.querySelector('span:last-child').style.transform = menuOpen ? 'rotate(-45deg) translateY(-6px)' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.querySelector('span:first-child').style.transform = '';
    hamburger.querySelector('span:last-child').style.transform = '';
  });
});

// =============================================
// Scroll Reveal
// =============================================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => observer.observe(el));

// =============================================
// Studio: Canvas Shirt Preview (Frente & Verso + Interactive Drag)
// =============================================
const canvas = document.getElementById('studioCanvas');
const ctx = canvas.getContext('2d');
const canvasHint = document.getElementById('canvasHint');
const dragBadge = document.getElementById('dragBadge');

// State for Front & Back artworks + Studio settings
let studioState = {
  peca: 'camiseta',
  cor: '#F2EFE8',
  currentView: 'front',       // 'front' | 'back'
  currentUploadSide: 'front', // 'front' | 'back'
  arts: {
    front: { img: null, x: 0.5, y: 0.40, scale: 0.38, rotation: 0, fileName: '' },
    back:  { img: null, x: 0.5, y: 0.40, scale: 0.38, rotation: 0, fileName: '' }
  }
};

// Real Product Mockup Images (Front & Back)
const studioMockups = {
  camiseta: {
    '#F2EFE8': { front: new Image(), back: new Image() },
    '#1A1A18': { front: new Image(), back: new Image() },
    '#4A5240': { front: new Image(), back: new Image() },
    'default': { front: new Image(), back: new Image() }
  },
  moletom: {
    '#1A1A18': { front: new Image(), back: new Image() },
    '#4A5240': { front: new Image(), back: new Image() },
    'default': { front: new Image(), back: new Image() }
  },
  casaco: {
    'default': { front: new Image(), back: new Image() }
  }
};

// Assign mockup image sources
studioMockups.camiseta['#F2EFE8'].front.src = 'assets/mockup_shirt_offwhite.png';
studioMockups.camiseta['#F2EFE8'].back.src  = 'assets/mockup_shirt_offwhite_back.png';

studioMockups.camiseta['#1A1A18'].front.src = 'assets/mockup_shirt_black_front.png';
studioMockups.camiseta['#1A1A18'].back.src  = 'assets/mockup_shirt_black_back.png';

studioMockups.camiseta['#4A5240'].front.src = 'assets/mockup_shirt_olive.png';
studioMockups.camiseta['#4A5240'].back.src  = 'assets/mockup_shirt_olive_back.png';

studioMockups.camiseta['default'].front.src = 'assets/mockup_shirt_offwhite.png';
studioMockups.camiseta['default'].back.src  = 'assets/mockup_shirt_offwhite_back.png';

studioMockups.moletom['#1A1A18'].front.src = 'assets/mockup_hoodie_black.png';
studioMockups.moletom['#1A1A18'].back.src  = 'assets/mockup_hoodie_black.png';
studioMockups.moletom['#4A5240'].front.src = 'assets/hoodie1.png';
studioMockups.moletom['#4A5240'].back.src  = 'assets/hoodie1.png';
studioMockups.moletom['default'].front.src = 'assets/mockup_hoodie_black.png';
studioMockups.moletom['default'].back.src  = 'assets/mockup_hoodie_black.png';

studioMockups.casaco['default'].front.src = 'assets/shirt3.png';
studioMockups.casaco['default'].back.src  = 'assets/shirt3.png';

// Re-draw when mockups load
Object.values(studioMockups).forEach(pecaGroup => {
  Object.values(pecaGroup).forEach(sideObj => {
    if (sideObj.front) sideObj.front.addEventListener('load', () => drawStudio());
    if (sideObj.back) sideObj.back.addEventListener('load', () => drawStudio());
  });
});

// Helper to get active art object
function getActiveArt() {
  return studioState.arts[studioState.currentView];
}

// Draw Studio Preview Canvas
function drawStudio() {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // 1. Get active real product mockup (front or back)
  const pecaMap = studioMockups[studioState.peca] || studioMockups.camiseta;
  const colorObj = pecaMap[studioState.cor] || pecaMap['default'] || studioMockups.camiseta['default'];
  const mockupImg = colorObj[studioState.currentView] || colorObj.front || studioMockups.camiseta['default'].front;

  // Draw real product mockup
  if (mockupImg && mockupImg.complete && mockupImg.naturalWidth > 0) {
    const pad = w * 0.04;
    const mWidth = w - pad * 2;
    const mHeight = mWidth * (mockupImg.naturalHeight / mockupImg.naturalWidth);
    const mX = (w - mWidth) / 2;
    const mY = (h - mHeight) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(26, 26, 24, 0.12)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.drawImage(mockupImg, mX, mY, mWidth, mHeight);
    ctx.restore();

    // Custom color tint if custom color selected
    if (studioState.cor !== '#F2EFE8' && studioState.cor !== '#1A1A18' && studioState.cor !== '#4A5240') {
      ctx.save();
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = studioState.cor;
      ctx.fillRect(mX, mY, mWidth, mHeight);
      ctx.restore();
    }
  } else {
    ctx.save();
    ctx.fillStyle = studioState.cor || '#F2EFE8';
    ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
    ctx.restore();
  }

  // 2. Render Active Art for current view (Front or Back)
  const currentArt = getActiveArt();

  if (currentArt && currentArt.img) {
    if (canvasHint) canvasHint.style.display = 'none';
    if (dragBadge) dragBadge.style.display = 'block';

    const stampW = w * currentArt.scale;
    const aspect = currentArt.img.naturalHeight / currentArt.img.naturalWidth || 1;
    const stampH = stampW * aspect;

    const stampX = w * currentArt.x;
    const stampY = h * currentArt.y;

    ctx.save();
    ctx.translate(stampX, stampY);
    ctx.rotate((currentArt.rotation * Math.PI) / 180);
    ctx.globalAlpha = 0.94;
    ctx.drawImage(currentArt.img, -stampW / 2, -stampH / 2, stampW, stampH);

    // Bounding Box Guide Line when dragging or editing
    if (isDraggingArt) {
      ctx.strokeStyle = '#4A5240';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(-stampW / 2 - 4, -stampH / 2 - 4, stampW + 8, stampH + 8);

      // Center crosshair guide
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(74, 82, 64, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
      ctx.moveTo(0, -10); ctx.lineTo(0, 10);
      ctx.stroke();
    }

    ctx.restore();
  } else {
    if (canvasHint) canvasHint.style.display = 'flex';
    if (dragBadge) dragBadge.style.display = 'none';
  }
}

drawStudio();

// =============================================
// Interactive Drag & Drop Stamp on Canvas
// =============================================
let isDraggingArt = false;
let dragStartX = 0, dragStartY = 0;
let artStartRelX = 0, artStartRelY = 0;

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
    relX: (clientX - rect.left) / rect.width,
    relY: (clientY - rect.top) / rect.height
  };
}

function startDrag(e) {
  const art = getActiveArt();
  if (!art || !art.img) return;

  const pos = getCanvasPos(e);
  const w = canvas.width, h = canvas.height;
  const stampW = w * art.scale;
  const stampH = stampW * (art.img.naturalHeight / art.img.naturalWidth || 1);
  const stampX = w * art.x;
  const stampY = h * art.y;

  // Check if click is inside stamp bounding box
  if (
    pos.x >= stampX - stampW / 2 - 20 &&
    pos.x <= stampX + stampW / 2 + 20 &&
    pos.y >= stampY - stampH / 2 - 20 &&
    pos.y <= stampY + stampH / 2 + 20
  ) {
    isDraggingArt = true;
    dragStartX = pos.relX;
    dragStartY = pos.relY;
    artStartRelX = art.x;
    artStartRelY = art.y;
    e.preventDefault();
    drawStudio();
  }
}

function moveDrag(e) {
  if (!isDraggingArt) return;
  const art = getActiveArt();
  if (!art || !art.img) return;

  const pos = getCanvasPos(e);
  const dx = pos.relX - dragStartX;
  const dy = pos.relY - dragStartY;

  // Clamp within canvas boundaries (10% to 90%)
  art.x = Math.max(0.1, Math.min(0.9, artStartRelX + dx));
  art.y = Math.max(0.1, Math.min(0.9, artStartRelY + dy));

  e.preventDefault();
  drawStudio();
}

function stopDrag() {
  if (isDraggingArt) {
    isDraggingArt = false;
    drawStudio();
  }
}

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', moveDrag);
window.addEventListener('mouseup', stopDrag);

canvas.addEventListener('touchstart', startDrag, { passive: false });
canvas.addEventListener('touchmove', moveDrag, { passive: false });
window.addEventListener('touchend', stopDrag);

// =============================================
// Studio: View Switcher (Frente / Verso)
// =============================================
const viewBtnFront = document.getElementById('viewBtnFront');
const viewBtnBack  = document.getElementById('viewBtnBack');
const viewIndicator = document.getElementById('viewIndicator');

function switchView(view) {
  studioState.currentView = view;
  if (viewBtnFront) viewBtnFront.classList.toggle('active', view === 'front');
  if (viewBtnBack)  viewBtnBack.classList.toggle('active', view === 'back');

  if (viewIndicator) {
    viewIndicator.textContent = view === 'front' ? 'Visão: FRENTE' : 'Visão: VERSO';
  }

  // Update controls for active side
  syncControlsWithArt();
  drawStudio();
}

if (viewBtnFront) viewBtnFront.addEventListener('click', () => switchView('front'));
if (viewBtnBack)  viewBtnBack.addEventListener('click', () => switchView('back'));

// =============================================
// Studio: Upload Tabs (Frente / Verso Art Tabs)
// =============================================
const artTabFront = document.getElementById('artTabFront');
const artTabBack  = document.getElementById('artTabBack');
const uploadTitle = document.getElementById('uploadTitle');
const uploadSideTag = document.getElementById('uploadSideTag');

function switchUploadSide(side) {
  studioState.currentUploadSide = side;
  if (artTabFront) artTabFront.classList.toggle('active', side === 'front');
  if (artTabBack)  artTabBack.classList.toggle('active', side === 'back');

  if (uploadTitle) {
    uploadTitle.textContent = side === 'front' ? 'Enviar estampa para a FRENTE' : 'Enviar estampa para o VERSO';
  }

  // Automatically switch canvas view to match upload tab
  switchView(side);
  updateUploadUI();
}

if (artTabFront) artTabFront.addEventListener('click', () => switchUploadSide('front'));
if (artTabBack)  artTabBack.addEventListener('click', () => switchUploadSide('back'));

// Sync UI Sliders with active art settings
function syncControlsWithArt() {
  const art = getActiveArt();
  const stampSize = document.getElementById('stampSize');
  const stampRotate = document.getElementById('stampRotate');
  const sizeValDisplay = document.getElementById('sizeValDisplay');
  const rotValDisplay = document.getElementById('rotValDisplay');

  if (art) {
    if (stampSize) {
      const pct = Math.round(art.scale * 100);
      stampSize.value = pct;
      if (sizeValDisplay) sizeValDisplay.textContent = pct + '%';
    }
    if (stampRotate) {
      stampRotate.value = art.rotation;
      if (rotValDisplay) rotValDisplay.textContent = art.rotation + '°';
    }
  }
}

// =============================================
// Studio: Position & Rotation Controls
// =============================================
const btnCenterStamp = document.getElementById('btnCenterStamp');
const btnChestStamp  = document.getElementById('btnChestStamp');
const btnResetStamp  = document.getElementById('btnResetStamp');
const stampSizeInput = document.getElementById('stampSize');
const stampRotateInput = document.getElementById('stampRotate');

if (btnCenterStamp) {
  btnCenterStamp.addEventListener('click', () => {
    const art = getActiveArt();
    if (art) { art.x = 0.5; art.y = 0.42; drawStudio(); }
  });
}

if (btnChestStamp) {
  btnChestStamp.addEventListener('click', () => {
    const art = getActiveArt();
    if (art) {
      if (studioState.currentView === 'front') {
        art.x = 0.36; art.y = 0.28; art.scale = 0.22;
      } else {
        art.x = 0.5; art.y = 0.24; art.scale = 0.25; // Upper back
      }
      syncControlsWithArt();
      drawStudio();
    }
  });
}

if (btnResetStamp) {
  btnResetStamp.addEventListener('click', () => {
    const art = getActiveArt();
    if (art) {
      art.x = 0.5; art.y = 0.40; art.scale = 0.38; art.rotation = 0;
      syncControlsWithArt();
      drawStudio();
    }
  });
}

if (stampSizeInput) {
  stampSizeInput.addEventListener('input', (e) => {
    const art = getActiveArt();
    if (art) {
      art.scale = parseInt(e.target.value) / 100;
      const display = document.getElementById('sizeValDisplay');
      if (display) display.textContent = e.target.value + '%';
      drawStudio();
    }
  });
}

if (stampRotateInput) {
  stampRotateInput.addEventListener('input', (e) => {
    const art = getActiveArt();
    if (art) {
      art.rotation = parseInt(e.target.value);
      const display = document.getElementById('rotValDisplay');
      if (display) display.textContent = e.target.value + '°';
      drawStudio();
    }
  });
}

// =============================================
// Studio: Piece Selection
// =============================================
document.querySelectorAll('.peca-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.peca-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    studioState.peca = btn.dataset.peca;
    drawStudio();
  });
});

// =============================================
// Studio: Color Selection
// =============================================
document.querySelectorAll('.cor-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cor-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    studioState.cor = btn.dataset.cor;
    const nameEl = document.getElementById('corName');
    if (nameEl) nameEl.textContent = btn.dataset.name;
    drawStudio();
  });
});

// =============================================
// Studio: File Upload Handler (Front / Back)
// =============================================
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadPreview = document.getElementById('uploadPreview');
const uploadThumb = document.getElementById('uploadThumb');
const uploadFileName = document.getElementById('uploadFileName');
const uploadBtn = document.getElementById('uploadBtn');

if (uploadBtn && fileInput) uploadBtn.addEventListener('click', () => fileInput.click());
if (uploadArea && fileInput) {
  uploadArea.addEventListener('click', (e) => {
    if (e.target !== uploadBtn) fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
}

// Drag & Drop File Upload
if (uploadArea) {
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) return alert('Envie um arquivo de imagem (PNG, JPG, SVG).');
  if (file.size > 10 * 1024 * 1024) return alert('O arquivo é muito grande. Máximo 10MB.');

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const side = studioState.currentUploadSide;
      studioState.arts[side].img = img;
      studioState.arts[side].fileName = file.name;

      // Update upload UI
      updateUploadUI();

      // Switch canvas view to display newly uploaded art
      switchView(side);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updateUploadUI() {
  const side = studioState.currentUploadSide;
  const art = studioState.arts[side];

  if (art.img) {
    if (uploadThumb) uploadThumb.src = art.img.src;
    if (uploadFileName) uploadFileName.textContent = art.fileName || 'arte.png';
    if (uploadSideTag) uploadSideTag.textContent = side === 'front' ? 'FRENTE' : 'VERSO';
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadPreview) uploadPreview.style.display = 'flex';
  } else {
    if (uploadArea) uploadArea.style.display = '';
    if (uploadPreview) uploadPreview.style.display = 'none';
  }
}

const uploadRemove = document.getElementById('uploadRemove');
if (uploadRemove) {
  uploadRemove.addEventListener('click', () => {
    const side = studioState.currentUploadSide;
    studioState.arts[side].img = null;
    studioState.arts[side].fileName = '';
    if (fileInput) fileInput.value = '';
    updateUploadUI();
    drawStudio();
  });
}

// =============================================
// Studio: Quantity Control
// =============================================
let qty = 1;
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');
const qtyValue = document.getElementById('qtyValue');

if (qtyPlus) {
  qtyPlus.addEventListener('click', () => {
    qty = Math.min(qty + 1, 100);
    if (qtyValue) qtyValue.textContent = qty;
  });
}
if (qtyMinus) {
  qtyMinus.addEventListener('click', () => {
    qty = Math.max(qty - 1, 1);
    if (qtyValue) qtyValue.textContent = qty;
  });
}

// =============================================
// Studio: Submit via WhatsApp
// =============================================
const studioSubmit = document.getElementById('studioSubmit');
if (studioSubmit) {
  studioSubmit.addEventListener('click', () => {
    const pecaBtn = document.querySelector('.peca-btn.active span');
    const peca = pecaBtn ? pecaBtn.textContent : 'Camiseta';
    const cor = document.getElementById('corName') ? document.getElementById('corName').textContent : 'Off-White';
    const tamSelect = document.getElementById('tamSelect');
    const tam = tamSelect ? tamSelect.value : 'M';
    const qtd = qtyValue ? qtyValue.textContent : '1';
    const obsInput = document.getElementById('obsInput');
    const obs = obsInput ? obsInput.value.trim() : '';

    const frontArt = studioState.arts.front;
    const backArt  = studioState.arts.back;

    const temFrente = frontArt.img ? `Sim (${frontArt.fileName || 'Arte enviada'}) — Posição: ${Math.round(frontArt.x * 100)}% X, ${Math.round(frontArt.y * 100)}% Y` : 'Sem estampa';
    const temVerso  = backArt.img  ? `Sim (${backArt.fileName || 'Arte enviada'}) — Posição: ${Math.round(backArt.x * 100)}% X, ${Math.round(backArt.y * 100)}% Y`   : 'Sem estampa';

    const msg = `Olá! Tenho interesse em encomendar uma peça pela BRIØ dpto.:

*Peça:* ${peca}
*Cor:* ${cor}
*Tamanho:* ${tam}
*Quantidade:* ${qtd}

*Estampa FRENTE:* ${temFrente}
*Estampa VERSO:* ${temVerso}
${obs ? `\n*Observações:* ${obs}` : ''}

Criei o modelo no Studio do site e quero finalizar o pedido!`;

    const whatsappNumber = '5500000000000'; // Substitua pelo número real da Brio Dpto.
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  });
}

// =============================================
// Smooth Scroll for Anchors
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    }
  });
});

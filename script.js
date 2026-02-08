const canvas = document.getElementById('patternCanvas');
const ctx = canvas.getContext('2d');
const infoBar = document.getElementById('infoBar');

function getRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Seeded random generator
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function generatePattern(seedOverride=null) {
  const seedValue = seedOverride || document.getElementById('seedInput').value || Math.floor(Math.random()*1e8).toString();
  document.getElementById('seedInput').value = seedValue;

  const rng = mulberry32(parseInt(seedValue));

  const numDots = parseInt(document.getElementById('numDotsInput').value) || 20;
  const dotColorValue = document.getElementById('dotColor').value;
  const lineColorValue = document.getElementById('lineColor').value;
  const colorfulDots = document.getElementById('colorfulDots').checked;
  const colorfulLines = document.getElementById('colorfulLines').checked;

  // Update info bar
  infoBar.innerText = `Seed: ${seedValue} | Dots: ${numDots} | Dot Color: ${colorfulDots ? 'Colorful' : dotColorValue} | Line Color: ${colorfulLines ? 'Colorful' : lineColorValue}`;

  // Clear canvas
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generate points with seeded RNG
  const points = [];
  for(let i=0; i<numDots; i++) {
    const padding = 20;
    points.push({
      x: padding + rng() * (canvas.width - 2 * padding),
      y: padding + rng() * (canvas.height - 2 * padding)
    });
  }

  // Draw lines
  for(let i=0; i<points.length; i++) {
    for(let j=i+1; j<points.length; j++) {
      ctx.strokeStyle = colorfulLines ? getRandomColor() : lineColorValue;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
      ctx.stroke();
    }
  }

  // Draw dots
  points.forEach((p,i) => {
    ctx.fillStyle = colorfulDots ? getRandomColor() : dotColorValue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
    ctx.fill();
  });
}

// Random Seed button
const randomSeedBtn = document.getElementById('randomSeedBtn');
randomSeedBtn.addEventListener('click', () => {
  const seed = Math.floor(Math.random()*1e8).toString();
  generatePattern(seed);
});

// Generate button
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', () => {
  const seedInput = document.getElementById('seedInput').value;

  if (!seedInput) {
    alert("Please enter a seed or use Random Seed");
    return;
  }

  // ✅ Check if seed is only numbers
  if (!/^\d+$/.test(seedInput)) {
    alert("Seed only can be Numbers");
    return;
  }

  generatePattern(seedInput);
});

// Download button
const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', () => {
  const includeInfo = document.getElementById('includeInfo').checked;
  const infoText = infoBar.innerText;

  const exportCanvas = document.createElement('canvas');
  const extraHeight = includeInfo ? 40 : 0;
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height + extraHeight;

  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.fillStyle = "#fff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0);

  if(includeInfo) {
    exportCtx.fillStyle = "#000";
    exportCtx.font = "14px Arial";
    exportCtx.textAlign = "center";
    exportCtx.fillText(infoText, exportCanvas.width/2, canvas.height + 25);
  }

  const link = document.createElement('a');
  link.download = `pattern_seed${document.getElementById('seedInput').value || 'random'}.png`;
  link.href = exportCanvas.toDataURL();
  link.click();
});

// Info button toggle
document.querySelector('.info-btn').addEventListener('click', () => {
  const popup = document.querySelector('.info-popup');
  popup.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  const btn = document.querySelector('.info-btn');
  const popup = document.querySelector('.info-popup');
  if (!btn.contains(event.target) && !popup.contains(event.target) && popup.classList.contains('active')) {
    popup.classList.remove('active');
  }
});
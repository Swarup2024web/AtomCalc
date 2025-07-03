let periodicData = null;
let animationId = null;
let orbitAngle = 0;
let electronSpinAngle = 0;

// Default scale and speed
let scale = 1.2;
let speed = 0.01;

// Sliders
const zoomSlider = document.getElementById("zoomSlider");
const speedSlider = document.getElementById("speedSlider");

zoomSlider.addEventListener("input", () => {
  scale = parseFloat(zoomSlider.value);
});

speedSlider.addEventListener("input", () => {
  speed = parseFloat(speedSlider.value);
});

// Load JSON data
fetch('elementsData.json')
  .then(res => res.json())
  .then(data => {
    periodicData = data;
  })
  .catch(() => alert("❌ Failed to load element data. Check path or hosting method."));

// Main draw function
function drawAtom() {
  const Z = parseInt(document.getElementById("atomicNumber").value);
  const info = document.getElementById("elementInfo");
  const canvas = document.getElementById("atomCanvas");
  const ctx = canvas.getContext("2d");

  if (!periodicData) {
    info.textContent = "Loading element data...";
    return;
  }

  const element = periodicData.elements.find(e => e.number === Z);
  if (!element) {
    info.textContent = "Element not found.";
    return;
  }

  if (animationId) cancelAnimationFrame(animationId);

  const shells = element.shells || [];
  info.innerHTML = `
    <strong>${element.name} (${element.symbol})</strong><br>
    Atomic No: ${element.number}, Mass: ${element.atomic_mass}<br>
    Group: ${element.group || '—'}, Period: ${element.period || '—'}<br>
    Category: ${element.category}<br>
    Configuration: ${element.electron_configuration_semantic}<br>
    <small>${element.summary || ''}</small>
  `;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw nucleus
    ctx.beginPath();
    ctx.arc(cx, cy, 25 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "#a0d8ef";
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.font = `${14 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(element.symbol, cx, cy + 5);

    // Draw shells & electrons
    const spacing = 45 * scale;
    shells.forEach((count, idx) => {
      const r = spacing * (idx + 1);

      // Orbit
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "#b0bec5";
      ctx.stroke();

      for (let i = 0; i < count; i++) {
        const angle = orbitAngle + (2 * Math.PI * i / count);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        // Spinning electron
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(electronSpinAngle);
        ctx.beginPath();
        ctx.arc(0, 0, 6 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = "#4fc3f7";
        ctx.fill();
        ctx.restore();
      }
    });

    orbitAngle += speed;
    electronSpinAngle += speed * 5;
    animationId = requestAnimationFrame(animate);
  }

  animate();
                   }

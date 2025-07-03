let periodicData = null;
let animationId = null;
let angleOffset = 0;

// Load full periodic table JSON
fetch('elementsData.json')
  .then(res => res.json())
  .then(data => periodicData = data)
  .catch(err => alert("Failed to load element data."));

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
    ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff9ebc";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(element.symbol, cx, cy + 5);

    // Draw shells and electrons
    const spacing = 45;
    shells.forEach((count, idx) => {
      const r = spacing * (idx + 1);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();

      for (let i = 0; i < count; i++) {
        const angle = angleOffset + (2 * Math.PI * i / count);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#90f2ff";
        ctx.fill();
      }
    });

    angleOffset += 0.01;
    animationId = requestAnimationFrame(animate);
  }

  animate();
}

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

// Default neutron guesser
function defaultNeutrons(Z) {
  return Z; // Simple estimate: neutrons ≈ atomic number
}

// Main draw function
function drawAtom() {
  const Z = parseInt(document.getElementById("atomicNumber").value);
  const N_input = document.getElementById("neutronNumber").value;
  const neutrons = parseInt(N_input) || defaultNeutrons(Z);
  const mass = Z + neutrons;

  const canvas = document.getElementById("atomCanvas");
  const ctx = canvas.getContext("2d");

  const elName = document.getElementById("elName");
  const elSymbol = document.getElementById("elSymbol");
  const elNumber = document.getElementById("elNumber");
  const elNeutrons = document.getElementById("elNeutrons");
  const elMass = document.getElementById("elMass");
  const elConfig = document.getElementById("elConfig");

  const orbitList = document.getElementById("orbitList");

  if (!periodicData) {
    document.getElementById("elementInfo").textContent = "Loading element data...";
    return;
  }

  const element = periodicData.elements.find(e => e.number === Z);
  if (!element) {
    document.getElementById("elementInfo").textContent = "Element not found.";
    return;
  }

  // Cancel previous animation
  if (animationId) cancelAnimationFrame(animationId);

  // Update info box
  elName.textContent = element.name;
  elSymbol.textContent = element.symbol;
  elNumber.textContent = Z;
  elNeutrons.textContent = neutrons;
  elMass.textContent = mass;
  elConfig.textContent = element.electron_configuration_semantic;

  // Orbit labels
  orbitList.innerHTML = "";
  const shellNames = ["K", "L", "M", "N", "O", "P", "Q"];
  const shells = element.shells || [];

  shells.forEach((count, i) => {
    const li = document.createElement("li");
    li.textContent = `${shellNames[i] || `Shell-${i + 1}`}: ${count} electron${count > 1 ? "s" : ""}`;
    orbitList.appendChild(li);
  });

  // Begin animation
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw nucleus
    ctx.beginPath();
    ctx.arc(cx, cy, 25 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffcccb";
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = `${14 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(element.symbol, cx, cy + 5);

    // Draw orbits and electrons
    const spacing = 45 * scale;

    shells.forEach((count, idx) => {
      const r = spacing * (idx + 1);

      // Orbit
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = "#cfd8dc";
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
        ctx.fillStyle = "#00e5ff";
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

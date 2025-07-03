let angleOffset = 0;
let animationId = null;

function getElectronConfig(shells) {
  return shells;
}

function drawAtom() {
  const atomicNumber = parseInt(document.getElementById("atomicNumber").value);
  const element = periodicData.elements.find(e => e.number === atomicNumber);
  const infoBox = document.getElementById("elementInfo");

  if (!element) {
    infoBox.textContent = "Invalid atomic number or data not available.";
    return;
  }

  const config = getElectronConfig(element.shells);
  const canvas = document.getElementById("atomCanvas");
  const ctx = canvas.getContext("2d");

  if (animationId) cancelAnimationFrame(animationId);

  // Display Info
  infoBox.innerHTML = `
    <strong>${element.name} (${element.symbol})</strong><br>
    Atomic Number: ${element.number}<br>
    Atomic Mass: ${element.atomic_mass}<br>
    Category: ${element.category}<br>
    Group: ${element.group || "N/A"}, Period: ${element.period || "N/A"}<br>
    Electron Configuration: ${element.electron_configuration_semantic}<br>
    <small>${element.summary || ""}</small>
  `;

  // Animate
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Nucleus
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff4081";
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(element.symbol, centerX, centerY + 5);

    // Shells
    const shellSpacing = 45;
    config.forEach((count, shellIndex) => {
      const radius = shellSpacing * (shellIndex + 1);

      // Orbit
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#555";
      ctx.stroke();

      // Electrons
      for (let i = 0; i < count; i++) {
        const angle = angleOffset + (2 * Math.PI * i) / count;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#00f7ff";
        ctx.fill();
      }
    });

    angleOffset += 0.01;
    animationId = requestAnimationFrame(animate);
  }

  animate();
      }

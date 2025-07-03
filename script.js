const elements = [
  null,
  { symbol: "H", name: "Hydrogen", electrons: 1 },
  { symbol: "He", name: "Helium", electrons: 2 },
  { symbol: "Li", name: "Lithium", electrons: 3 },
  { symbol: "Be", name: "Beryllium", electrons: 4 },
  { symbol: "B", name: "Boron", electrons: 5 },
  { symbol: "C", name: "Carbon", electrons: 6 },
  { symbol: "N", name: "Nitrogen", electrons: 7 },
  { symbol: "O", name: "Oxygen", electrons: 8 },
  { symbol: "F", name: "Fluorine", electrons: 9 },
  { symbol: "Ne", name: "Neon", electrons: 10 },
  // Add more elements as needed...
];

function getElectronConfig(electrons) {
  const shells = [2, 8, 18, 32, 32, 18, 8]; // Max per shell
  const config = [];
  for (let i = 0; i < shells.length; i++) {
    if (electrons > 0) {
      const used = Math.min(electrons, shells[i]);
      config.push(used);
      electrons -= used;
    }
  }
  return config;
}

function drawAtom() {
  const input = document.getElementById("atomicNumber");
  const canvas = document.getElementById("atomCanvas");
  const ctx = canvas.getContext("2d");
  const info = document.getElementById("elementInfo");

  const atomicNumber = parseInt(input.value);
  if (isNaN(atomicNumber) || atomicNumber < 1 || atomicNumber >= elements.length) {
    info.textContent = "Please enter a valid atomic number (1-10 for now).";
    return;
  }

  const element = elements[atomicNumber];
  const config = getElectronConfig(element.electrons);

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Draw nucleus
  ctx.beginPath();
  ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff4081";
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(element.symbol, centerX, centerY + 4);

  // Draw shells and electrons
  const shellSpacing = 40;

  for (let shellIndex = 0; shellIndex < config.length; shellIndex++) {
    const radius = shellSpacing * (shellIndex + 1);
    const electronCount = config[shellIndex];

    // Draw shell
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#888";
    ctx.stroke();

    // Place electrons
    for (let i = 0; i < electronCount; i++) {
      const angle = (2 * Math.PI * i) / electronCount;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#03a9f4";
      ctx.fill();
    }
  }

  info.textContent = `Element: ${element.name} (${element.symbol}), Atomic Number: ${atomicNumber}`;
}

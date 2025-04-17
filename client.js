let socket = io();
let side = '';
let units = [];

function selectSide(chosenSide) {
  side = chosenSide;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('password-entry').style.display = 'block';
  document.getElementById('side-label').innerText = `Enter password for ${side.toUpperCase()}`;
}

function joinGame() {
  const password = document.getElementById('password').value;
  socket.emit('join', { side, password });

  socket.on('authorized', (data) => {
    units = data.state;
    startGame();
  });

  socket.on('unauthorized', () => {
    alert('Wrong password!');
  });

  socket.on('updateTroops', (newUnits) => {
    units = newUnits;
    drawBattlefield();
  });
}

function startGame() {
  document.getElementById('password-entry').style.display = 'none';
  document.getElementById('battlefield').style.display = 'block';
  drawBattlefield();
  loadLog();
  setInterval(loadLog, 300000); // every 5 minutes
}

function drawBattlefield() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Background
  const img = new Image();
  img.src = 'https://png.pngtree.com/background/20250204/original/pngtree-aerial-view-of-desert-sand-texture-with-linear-pattern-picture-image_13496799.jpg';
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Mid line
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Units
    units.forEach(unit => {
      ctx.fillStyle = (side === 'us') ? 'blue' : 'red';
      ctx.fillRect(unit.x, unit.y, 20, 20);
    });
  };
}

function goToMenu() {
  location.reload();
}

function loadLog() {
  fetch('events.json')
    .then(res => res.json())
    .then(data => {
      const log = document.getElementById('log');
      log.innerHTML = '<h3>Historical Log</h3>';
      const now = Date.now();
      data.forEach(event => {
        if (now >= new Date(event.time).getTime()) {
          log.innerHTML += `<p>${event.time} - ${event.desc}</p>`;
        }
      });
    });
}

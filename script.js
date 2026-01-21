// Hàm tạo pháo hoa đơn giản
function fireworks(canvasId, heart = false) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  let rockets = [];

  // ==== ROCKET (bay lên) ====
  function createRocket() {
    rockets.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      vy: -(Math.random() * 5 + 7),
      exploded: false,
      color: randomColor()
    });
  }

  function randomColor() {
    const colors = ["red", "yellow", "blue", "green", "purple", "orange", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // ==== HẠT PHÁO ====
  function addParticle(x, y, vx, vy, color) {
    particles.push({
      x, y, vx, vy,
      color,
      life: 100
    });
  }

  function explodeNormal(x, y, color) {
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 5 + 2;
      addParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, color);
    }
  }

  // ❤️ Trái tim (giữ nguyên)
  function explodeHeart(x, y, color) {
    for (let t = 0; t < Math.PI * 2; t += 0.15) {
      const vx = 16 * Math.pow(Math.sin(t), 3);
      const vy =
        -(13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t));
      addParticle(x, y, vx * 0.4, vy * 0.4, color);
    }
  }

  // ==== LOOP ====
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ rocket
    rockets.forEach((r, i) => {
      r.y += r.vy;

      // 🔥 vệt sáng rocket
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = r.color;
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x, r.y, 3, 12);
      ctx.restore();

      if (r.y < canvas.height * 0.4 && !r.exploded) {
        r.exploded = true;
        if (heart) explodeHeart(r.x, r.y, r.color);
        else explodeNormal(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    });

    // Vẽ hạt pháo (✨ glow)
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // trọng lực
      p.life--;

      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
      ctx.restore();

      if (p.life <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(loop);
  }

  // Bắn nhiều rocket
  setInterval(() => {
    for (let i = 0; i < 2; i++) createRocket();
  }, 600);

  loop();
}


//Hoa
function fallingPetals(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const petals = [];
  const colors = ["#ffb7c5", "#ff69b4", "#ffd700"]; // đào + mai

  function createPetal() {
    petals.push({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 6 + 6,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: Math.random() * 1 - 0.5,
      rotate: Math.random() * Math.PI,
      rotateSpeed: Math.random() * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotate);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p, i) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotate += p.rotateSpeed;

      drawPetal(p);

      if (p.y > canvas.height + 20) petals.splice(i, 1);
    });
    requestAnimationFrame(loop);
  }

  setInterval(createPetal, 200);
  loop();
}


// Quản lý cảnh
function showScene(id) {
  document.querySelectorAll(".scene").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="flex";

   const horse = document.getElementById("horse");
  if (horse) {
    horse.style.display = id === "scene3" ? "block" : "none";
  }
}

window.onload = ()=>{
  // Bắt đầu với cảnh 1
  showScene("scene1");
  fireworks("fireworks1");

  // Sau 2s chuyển sang cảnh 2
  setTimeout(()=>{
    showScene("scene2");
  },4000);

  // Khi click hộp bánh -> cảnh 3
  document.querySelectorAll(".box").forEach(box=>{
    box.addEventListener("click",()=>{
      const msg = box.getAttribute("data-msg");
      document.getElementById("message").innerText = msg;
      showScene("scene3");
      fireworks("fireworks2",true);
      fallingPetals("petals"); 
      // tự động quay lại cảnh 1 sau 2s nếu muốn
      setTimeout(()=>{
        showScene("scene1");
      },60000);
    });
  });
};

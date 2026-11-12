const $ = (id) => document.getElementById(id);

// Birthday date is stored only in this browser.
const dateInput = $("birthdayDate");
const storedDate = localStorage.getItem("hajiraBirthdayDate");
if (storedDate) dateInput.value = storedDate;
$("saveDate").addEventListener("click", () => {
  if (!dateInput.value) return;
  localStorage.setItem("hajiraBirthdayDate", dateInput.value);
  updateCountdown();
  $("countdownNote").textContent = "Your special date is saved. Let the magic count down!";
});

function updateCountdown() {
  if (!dateInput.value) {
    ["days","hours","minutes","seconds"].forEach(id => $(id).textContent = "—");
    return;
  }
  const now = new Date();
  const [y,m,d] = dateInput.value.split("-").map(Number);
  let target = new Date(y, m-1, d, 0, 0, 0);
  if (target < now && target.toDateString() !== now.toDateString()) target = new Date(y+1, m-1, d, 0, 0, 0);
  let diff = Math.max(0, target - now);
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60
  };
  Object.entries(values).forEach(([id,value]) => $(id).textContent = String(value).padStart(2,"0"));
  $("countdownNote").textContent = diff === 0 ? "It's your special day! Happy Birthday, Hajira! 💗" : "A new year of magic is waiting for you.";
}
updateCountdown(); setInterval(updateCountdown,1000);

$("giftBtn").addEventListener("click", () => {
  $("giftMessage").hidden = false;
  $("giftBtn").querySelector("span").textContent = "💝";
  $("giftBtn").querySelector("small").textContent = "Surprise opened!";
  burst(window.innerWidth/2, window.innerHeight*.65);
});

// Gentle original tones generated locally by the browser; no music file required.
let audioCtx = null, musicTimer = null, noteIndex = 0;
const notes = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46];
function playNote() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.type = "sine"; osc.frequency.value = notes[noteIndex++ % notes.length];
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.08);
  gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.8);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+.85);
}
$("musicBtn").addEventListener("click", async () => {
  if (musicTimer) {
    clearInterval(musicTimer); musicTimer = null;
    if (audioCtx) await audioCtx.suspend();
    $("musicBtn").textContent = "♫ Play soft music";
  } else {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume(); playNote(); musicTimer = setInterval(playNote,850);
    $("musicBtn").textContent = "Ⅱ Pause music";
  }
});

// Lightweight celebratory fireworks canvas.
const canvas = $("fireworks"), ctx = canvas.getContext("2d");
let particles = [];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
addEventListener("resize",resize); resize();
function burst(x,y){
  const colors=["#e88bb0","#d7ad63","#f4c6d8","#ffffff","#b76c91"];
  for(let i=0;i<65;i++){
    const a=Math.random()*Math.PI*2, speed=1+Math.random()*4;
    particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:55+Math.random()*25,color:colors[Math.floor(Math.random()*colors.length)],r:1+Math.random()*2});
  }
}
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.vx*=.99;p.life--;ctx.globalAlpha=Math.min(1,p.life/35);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1;requestAnimationFrame(animate);
}
animate();
$("celebrateBtn").addEventListener("click",()=>{for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*(.15+Math.random()*.7),innerHeight*(.15+Math.random()*.45)),i*220);});

// Guestbook posts are saved by the Flask server.
$("wishForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name=$("wishName").value.trim(), message=$("wishText").value.trim();
  const status=$("formStatus"); status.textContent="Sending your wish…";
  try{
    const response=await fetch("/api/wishes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message})});
    const result=await response.json();
    if(!response.ok) throw new Error(result.error || "Could not save the wish.");
    const list=$("wishList"); list.querySelector(".empty-wishes")?.remove();
    const card=document.createElement("article");card.className="guest-wish";
    const strong=document.createElement("strong");strong.textContent=name;
    const p=document.createElement("p");p.textContent=message;
    const small=document.createElement("small");small.textContent="Just now";
    card.append(strong,p,small);list.prepend(card);
    $("wishForm").reset();status.textContent="Your birthday wish has been added. Thank you! 💗";
  }catch(error){status.textContent=error.message;}
});

// A small welcome sparkle on first load.
setTimeout(()=>burst(innerWidth/2,innerHeight*.28),500);

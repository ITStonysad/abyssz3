
// script.js - versión final con rotación y corazones (compatible con audio)
const $ = (s)=> document.querySelector(s);
const $$ = (s)=> document.querySelectorAll(s);

const mensajes = {
  razones: [
    "Te quiero porque, sin decir una palabra, haces que mi corazón se sienta en casa.",
    "Eres mi calma en los días nublados y mi sonrisa en los días felices.",
    "Te amo porque tu sonrisa tiene el poder de iluminar hasta mis días más oscuros",
    "Te amo porque cuando estoy contigo, todo se siente en paz, como si el mundo tuviera sentido.",
    "Te amo porque tu voz es mi melodía favorita, y cada palabra tuya me abraza el alma.",
    "Te amo porque me haces sentir visto, escuchado y amado sin condiciones."
  ],
  comoNosConocimos: [
    "Nos conocimos en Valorant, en una partida que nunca imaginé que cambiaría mi vida.",
    "Entre risas, tu voz se volvió mi parte favorita.",
    "Todo pasó por algo, y ese 'algo' fue que coincidimos.",
    "No sé si fue un clutch o el destino",
    "Dicen que los mejores dúos se hacen en partida pero lo nuestro fue más que eso",
    "Creí que solo estaba entrando a otra partida, pero en realidad estaba entrando a una historia contigo"
  ],
  crecemosJuntos: [
    "Cada día junto a ti es una lección de cariño y paciencia.",
    "Contigo aprendo a amar mejor, sin prisas.",
    "Todo pasó por algo, y ese algo fuiste tú:una casualidad que terminó siendo mi lugar seguro",
    "Lo más bonito de nuestra historia no es solo que nos amamos… sino que crecimos uno al lado del otro",
    "No somos perfectos, pero juntos somos mejores. Crecer contigo ha sido mi mayor fortuna",
    "Contigo descubrí que las raíces fuertes se hacen con tiempo, cariño y respeto mutuo"
  ],
  celos: [
    "Amo cuando te pones celosa.",
    "Tus celos me recuerdan cuánto te importo y lo amo.",
    "Tranquila, Abby… mi corazón ya tiene dueña, y eres tú",
    "Celosa tú… y yo tan tuyo.",
    "No hay nadie más, ni habrá. Quédate tranquila, Abby.",
    "Tus celos solo confirman lo que ya sé: que te importo. Y eso me encanta."
  ],
  promesas: [
    "Prometo construir un amor sincero, paciente y alegre a tu lado.",
    "Contigo me comprometo a ser mejor cada día.",
    "Prometo ser tu refugio cuando el mundo parezca pesado y tu alegría cuando todo brille",
    "Prometo ser sincero, leal y honesto, construyendo nuestra confianza día a día",
    "Prometo caminar a tu lado, en todas las etapas de la vida, siendo tu compañero incondicional.",
    "Prometo escucharte con paciencia y comprenderte incluso cuando no tengas palabras."
  ]
};

let indices = {}, intervalos = {}, enPausa = false;

Object.keys(mensajes).forEach(k=>{
  indices[k]=0;
  const sec = document.querySelector(`[data-key='${k}']`);
  if(sec) sec.querySelector('[data-text]').textContent = mensajes[k][0];
  iniciarRotacion(k);
});

function cambiarMensaje(clave, direccion=1){
  const sec = document.querySelector(`[data-key='${clave}']`);
  const txt = sec.querySelector('[data-text]');
  txt.classList.add('fade-out');
  setTimeout(()=>{
    indices[clave] = (indices[clave] + direccion + mensajes[clave].length) % mensajes[clave].length;
    txt.textContent = mensajes[clave][indices[clave]];
    txt.classList.remove('fade-out');
    txt.classList.add('fade-in');
    setTimeout(()=> txt.classList.remove('fade-in'), 700);
  }, 400);
}

function iniciarRotacion(clave){
  intervalos[clave] = setInterval(()=>{ if(!enPausa) cambiarMensaje(clave,1); }, 5000);
}

$('#btnPausa').addEventListener('click', ()=>{
  enPausa = !enPausa;
  $('#btnPausa').textContent = enPausa ? '▶️ Reanudar' : '⏸️ Pausar';
});

$$('.btn-prev').forEach(b=> b.addEventListener('click', ()=> cambiarMensaje(b.closest('.carta-seccion').dataset.key, -1)));
$$('.btn-next').forEach(b=> b.addEventListener('click', ()=> cambiarMensaje(b.closest('.carta-seccion').dataset.key, 1)));

// Corazones en canvas
const canvas = $('#hearts-bg'); const ctx = canvas.getContext('2d');
function ajustar(){ canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', ajustar); ajustar();
let corazones = [];
for(let i=0;i<25;i++){ corazones.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*8+4, speed: Math.random()*1+0.3, alpha: Math.random()*0.5+0.4 }); }
function dibujar(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  corazones.forEach(c=>{
    ctx.beginPath();
    ctx.moveTo(c.x,c.y);
    ctx.bezierCurveTo(c.x - c.size/2, c.y - c.size/2, c.x - c.size, c.y + c.size/2, c.x, c.y + c.size);
    ctx.bezierCurveTo(c.x + c.size, c.y + c.size/2, c.x + c.size/2, c.y - c.size/2, c.x, c.y);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,100,150,${c.alpha})`;
    ctx.fill();
    c.y -= c.speed;
    if(c.y < -10){ c.y = canvas.height + 10; c.x = Math.random()*canvas.width; }
  });
  requestAnimationFrame(dibujar);
}
dibujar();

// Mensaje final
const mf = document.createElement('div');
mf.className='mensaje-final'; mf.innerHTML = '<span class="texto-final">Abby, te amo mucho :3 💗</span>';
document.body.appendChild(mf);
const style = document.createElement('style');
style.innerHTML = `.mensaje-final{position:fixed;bottom:30px;left:30px;background:rgba(255,182,193,0.2);border-radius:20px;padding:12px 18px;color:#fff;font-family:'Dancing Script',cursive;box-shadow:0 0 18px rgba(255,105,180,0.3);animation:aparecer 2s forwards 3s;}@keyframes aparecer{from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);}}`;
document.head.appendChild(style);

// Connect audio play/pause to global pause button for nicer UX
const audio = document.getElementById('bg-audio');
if(audio){
  $('#btnPausa').addEventListener('click', ()=>{
    if(enPausa){ try{ audio.pause(); }catch(e){} } else { try{ audio.play(); }catch(e){} }
  });
}

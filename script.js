/* ============================================================
   MUSHTHAQ — ULTRA GAMIFIED 3D PORTFOLIO — script.js
   Features: Three.js 3D, Matrix Rain, Particles, RPG System,
             Achievement System, Level Up, Holographic Effects
   ============================================================ */

/* ═══════════════════════════════════
   LOADER
═══════════════════════════════════ */
function initLoader() {
  var ld = document.getElementById('loader');
  var fill = document.querySelector('.ld-progress-fill');
  var pct  = document.querySelector('.ld-pct');
  var msg  = document.querySelector('.ld-msg');
  if (!ld) return;
  document.body.style.overflow = 'hidden';
  var msgs = ['BOOTING SYSTEM...','LOADING 3D ENGINE...','INITIALIZING HUD...','CALIBRATING EFFECTS...','PORTFOLIO READY!'];
  var p = 0, done = false;
  setTimeout(finish, 3200);
  var iv = setInterval(function() {
    p += Math.random() * 20 + 8;
    if (p >= 100) { p = 100; clearInterval(iv); finish(); return; }
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.floor(p) + '%';
    var mi = Math.floor((p / 100) * msgs.length);
    if (msg && msgs[mi]) msg.textContent = msgs[mi];
  }, 60);
  function finish() {
    if (done) return; done = true;
    if (fill) fill.style.width = '100%';
    if (pct)  pct.textContent = '100%';
    if (msg)  msg.textContent = 'PORTFOLIO READY!';
    setTimeout(function() {
      ld.classList.add('gone');
      document.body.style.overflow = '';
      heroReveal();
      setTimeout(function() { showAch('SYSTEM ONLINE', 'Welcome to my realm!', '🎮', 50); }, 1000);
    }, 400);
  }
}

/* ═══════════════════════════════════
   THREE.JS 3D BACKGROUND
═══════════════════════════════════ */
function init3D() {
  var canvas = document.getElementById('three-canvas');
  if (!canvas || !window.THREE) return;
  var THREE = window.THREE;
  var W = window.innerWidth, H = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
  camera.position.z = 5;

  // Wireframe icosahedron
  var geo1 = new THREE.IcosahedronGeometry(2, 1);
  var mat1 = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: .08 });
  var ico = new THREE.Mesh(geo1, mat1);
  scene.add(ico);

  // Inner octahedron
  var geo2 = new THREE.OctahedronGeometry(1.2, 0);
  var mat2 = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: .1 });
  var oct = new THREE.Mesh(geo2, mat2);
  scene.add(oct);

  // Floating particles
  var pgeo = new THREE.BufferGeometry();
  var cnt = 800;
  var pos = new Float32Array(cnt * 3);
  for (var i = 0; i < cnt * 3; i++) pos[i] = (Math.random() - .5) * 20;
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var pmat = new THREE.PointsMaterial({ color: 0x00ffcc, size: .04, transparent: true, opacity: .6 });
  var particles = new THREE.Points(pgeo, pmat);
  scene.add(particles);

  // Torus
  var tgeo = new THREE.TorusGeometry(3, .015, 8, 80);
  var tmat = new THREE.MeshBasicMaterial({ color: 0xff0066, transparent: true, opacity: .15 });
  var torus = new THREE.Mesh(tgeo, tmat);
  scene.add(torus);

  var mx = 0, my = 0;
  document.addEventListener('mousemove', function(e) { mx = (e.clientX/W - .5) * 2; my = -(e.clientY/H - .5) * 2; });
  window.addEventListener('resize', function() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H); camera.aspect = W/H; camera.updateProjectionMatrix();
  });

  var t = 0;
  function animate() {
    requestAnimationFrame(animate); t += 0.005;
    ico.rotation.x = t * .3 + my * .1;
    ico.rotation.y = t * .4 + mx * .1;
    oct.rotation.x = -t * .5;
    oct.rotation.y = t * .6;
    torus.rotation.x = t * .2; torus.rotation.z = t * .1;
    particles.rotation.y = t * .05;
    camera.position.x += (mx * .3 - camera.position.x) * .05;
    camera.position.y += (my * .3 - camera.position.y) * .05;
    renderer.render(scene, camera);
  }
  animate();
}

/* ═══════════════════════════════════
   MATRIX RAIN
═══════════════════════════════════ */
function initMatrix() {
  var cv = document.getElementById('matrix-canvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  var cols = Math.floor(cv.width / 18);
  var drops = Array(cols).fill(1);
  var chars = 'MUSHTHAQDIGITALMARKETING0123456789ABCDEF!@#$%^&*'.split('');
  window.addEventListener('resize', function() { cv.width=window.innerWidth; cv.height=window.innerHeight; });
  setInterval(function() {
    ctx.fillStyle = 'rgba(3,7,18,0.04)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#00ffcc';
    ctx.font = '13px Share Tech Mono, monospace';
    for (var i = 0; i < drops.length; i++) {
      var c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > .9 ? '#ffffff' : '#00ffcc';
      ctx.fillText(c, i * 18, drops[i] * 18);
      if (drops[i] * 18 > cv.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }, 55);
}

/* ═══════════════════════════════════
   PARTICLE CANVAS (extra layer)
═══════════════════════════════════ */
function initParticleCanvas() {
  var cv = document.getElementById('bg-canvas2');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width = window.innerWidth, H = cv.height = window.innerHeight;
  var mx = W/2, my = H/2;
  window.addEventListener('resize', function() { W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; });
  document.addEventListener('mousemove', function(e) { mx=e.clientX; my=e.clientY; });
  var pts = [];
  for (var i = 0; i < 80; i++) pts.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, col:['#00ffcc','#ff0066','#ffee00','#7c3aed'][Math.floor(Math.random()*4)], a:Math.random()*.4+.1, ph:Math.random()*Math.PI*2 });
  var ca = function(h,a){var m={'#00ffcc':'rgba(0,255,204,','#ff0066':'rgba(255,0,102,','#ffee00':'rgba(255,238,0,','#7c3aed':'rgba(124,58,237,'};return (m[h]||'rgba(0,255,204,')+a+')';};
  function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p) {
      p.x+=p.vx; p.y+=p.vy; p.ph+=.02;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      var pa=p.a*(.6+.4*Math.sin(p.ph));
      ctx.beginPath(); ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
      ctx.fillStyle=ca(p.col,pa); ctx.shadowBlur=6; ctx.shadowColor=p.col; ctx.fill(); ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ═══════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════ */
function initCursor() {
  var dot = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var aim = document.getElementById('cur-aim');
  if (!dot) return;
  var mx=0, my=0;
  document.addEventListener('mousemove', function(e) {
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    setTimeout(function(){ if(ring){ring.style.left=mx+'px';ring.style.top=my+'px';} if(aim){aim.style.left=mx+'px';aim.style.top=my+'px';} }, 80);
  });
  document.addEventListener('mouseover', function(e) {
    var over = e.target.closest('a,button,.card,.holo-card,.dc,.sk-hex-card,.pcard');
    dot.classList.toggle('big', !!over);
  });
  document.addEventListener('click', function(e) { ripple(e.clientX,e.clientY); });
}

/* ═══════════════════════════════════
   RIPPLE + PARTICLES
═══════════════════════════════════ */
function ripple(x,y) {
  var r = document.createElement('div');
  r.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:8px;height:8px;background:rgba(0,255,204,.8);border-radius:50%;pointer-events:none;z-index:99990;transform:translate(-50%,-50%);animation:ripOut .6s ease forwards;';
  document.body.appendChild(r);
  if (!document.getElementById('rip-sty')) {
    var s=document.createElement('style');s.id='rip-sty';
    s.textContent='@keyframes ripOut{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(18);opacity:0}}';
    document.head.appendChild(s);
  }
  setTimeout(function(){r.remove();},600);
}
function explode(x,y,col) {
  col=col||'#00ffcc';
  for(var i=0;i<14;i++){
    var p=document.createElement('div');
    var ang=(i/14)*Math.PI*2;
    var d=50+Math.random()*70;
    p.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:4px;height:4px;background:'+col+';border-radius:50%;pointer-events:none;z-index:99989;transform:translate(-50%,-50%);--dx:'+(Math.cos(ang)*d)+'px;--dy:'+(Math.sin(ang)*d)+'px;animation:partExplode .7s ease forwards;';
    document.body.appendChild(p); setTimeout(function(e){e.remove();},700,p);
  }
}

/* ═══════════════════════════════════
   HEX RAIN
═══════════════════════════════════ */
function initHexRain() {
  var syms=['◆','▲','●','■','★','⬡','◈','⟁'];
  var cols=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)'];
  setInterval(function(){
    var h=document.createElement('div');
    h.style.cssText='position:fixed;left:'+(Math.random()*100)+'vw;top:-20px;font-size:'+(8+Math.random()*10)+'px;color:'+cols[Math.floor(Math.random()*cols.length)]+';pointer-events:none;z-index:1;opacity:.4;animation:hexFall '+(3+Math.random()*5)+'s linear forwards;';
    h.textContent=syms[Math.floor(Math.random()*syms.length)];
    document.body.appendChild(h); setTimeout(function(){h.remove();},8000);
  },250);
}

/* ═══════════════════════════════════
   ACHIEVEMENT SYSTEM
═══════════════════════════════════ */
var achQueue=[], achBusy=false, totalXP=0;
function showAch(name,sub,ico,xp) {
  achQueue.push({name:name,sub:sub,ico:ico||'🏆',xp:xp||25});
  if(!achBusy) nextAch();
}
function nextAch() {
  if(!achQueue.length){achBusy=false;return;}
  achBusy=true;
  var a=achQueue.shift();
  var t=document.getElementById('ach-toast');
  if(!t){achBusy=false;return;}
  document.getElementById('ach-ico').textContent=a.ico;
  document.getElementById('ach-name').textContent=a.name;
  document.getElementById('ach-sub-text').textContent=a.sub;
  totalXP+=a.xp;
  document.getElementById('ach-xp-text').textContent='+'+a.xp+' XP (Total: '+totalXP+')';
  t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');setTimeout(nextAch,400);},3200);
}

/* ═══════════════════════════════════
   LEVEL UP EFFECT
═══════════════════════════════════ */
function levelUp() {
  var el=document.getElementById('lvlup');
  if(!el)return;
  el.classList.add('show');
  explode(window.innerWidth/2,window.innerHeight/2,'#ffee00');
  setTimeout(function(){el.classList.remove('show');},2000);
}

/* ═══════════════════════════════════
   SECTION ACHIEVEMENTS
═══════════════════════════════════ */
function initSectionAch() {
  var map={
    about:    ['CHARACTER PROFILE','Stats loaded!','👤',30],
    skills:   ['SKILL TREE OPENED','Powers revealed!','⚡',40],
    experience:['MISSION LOG','Career unlocked!','🗂️',35],
    projects: ['QUEST BOARD','Portfolio found!','📋',40],
    designs:  ['DESIGN VAULT','Gallery unlocked!','🎨',45],
    contact:  ['COMM CHANNEL','Ready to connect!','📡',50],
  };
  var done={};
  if(!window.IntersectionObserver)return;
  document.querySelectorAll('section[id]').forEach(function(sec){
    var id=sec.id; if(!map[id])return;
    new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting&&!done[id]){
        done[id]=true;
        setTimeout(function(){showAch(map[id][0],map[id][1],map[id][2],map[id][3]);},600);
        if(id==='contact') setTimeout(levelUp,1200);
      }
    },{threshold:.3}).observe(sec);
  });
}

/* ═══════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════ */
function initReveal() {
  var els=document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s');
  if(!window.IntersectionObserver){els.forEach(function(e){e.classList.add('on');});return;}
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on');});},{threshold:.08});
  els.forEach(function(el){obs.observe(el);});
}

/* ═══════════════════════════════════
   NAVIGATION
═══════════════════════════════════ */
function initNav() {
  var nav=document.querySelector('nav'); if(!nav)return;
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>50);});
  var hb=document.querySelector('.hamburger'),nl=document.querySelector('.nav-links');
  if(hb&&nl)hb.addEventListener('click',function(){hb.classList.toggle('open');nl.classList.toggle('open');});
  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click',function(e){
      var h=a.getAttribute('href');
      if(h&&h[0]==='#'){e.preventDefault();var t=document.querySelector(h);if(t)t.scrollIntoView({behavior:'smooth'});if(nl)nl.classList.remove('open');if(hb)hb.classList.remove('open');explode(e.clientX,e.clientY,'#00ffcc');}
    });
  });
  var secs=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',function(){
    var cur=''; secs.forEach(function(s){if(window.scrollY>=s.offsetTop-200)cur=s.id;});
    document.querySelectorAll('.nav-links a').forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});
    var ci=0,md=Infinity; secs.forEach(function(s,i){var d=Math.abs(s.getBoundingClientRect().top);if(d<md){md=d;ci=i;}});
    document.querySelectorAll('.pdot').forEach(function(d,i){d.classList.toggle('on',i===ci);});
  });
}
function initDots() {
  var secs=document.querySelectorAll('section[id]');
  document.querySelectorAll('.pdot').forEach(function(d,i){d.addEventListener('click',function(){if(secs[i])secs[i].scrollIntoView({behavior:'smooth'});});});
}

/* ═══════════════════════════════════
   TYPEWRITER
═══════════════════════════════════ */
function typewriter(el,words,spd) {
  if(!el)return; spd=spd||75;
  var wi=0,ci=0,del=false;
  function tick(){
    var w=words[wi];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;return setTimeout(tick,2000);}}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length;}}
    setTimeout(tick,del?spd/2:spd);
  }
  tick();
}

/* ═══════════════════════════════════
   3D TILT
═══════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var rx=((e.clientY-r.top-r.height/2)/(r.height/2))*-12;
      var ry=((e.clientX-r.left-r.width/2)/(r.width/2))*12;
      el.style.transform='perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-6px)';
    });
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });
}

/* ═══════════════════════════════════
   COUNT UP
═══════════════════════════════════ */
function initCountUp() {
  if(!window.IntersectionObserver)return;
  document.querySelectorAll('[data-count]').forEach(function(el){
    new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting)return;
      var tg=+el.dataset.count,sf=el.dataset.suffix||'',st=tg/100,c=0;
      var t=setInterval(function(){c+=st;if(c>=tg){c=tg;clearInterval(t);}el.textContent=Math.floor(c)+sf;},16);
    },{threshold:.5}).observe(el);
  });
}

/* ═══════════════════════════════════
   SKILL BARS
═══════════════════════════════════ */
function initBars() {
  var fills=document.querySelectorAll('.sk-fill,.stat-fill');
  if(!window.IntersectionObserver){fills.forEach(function(f){if(f.dataset.w)f.style.width=f.dataset.w+'%';});return;}
  fills.forEach(function(fill){
    new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting)return;
      if(fill.dataset.w) setTimeout(function(){fill.style.width=fill.dataset.w+'%';},200);
    },{threshold:.3}).observe(fill);
  });
}

/* ═══════════════════════════════════
   HERO REVEAL
═══════════════════════════════════ */
function heroReveal() {
  var els=document.querySelectorAll('.hanim');
  for(var i=0;i<els.length;i++)(function(el,idx){setTimeout(function(){el.classList.add('on');},idx*120);})(els[i],i);
}

/* ═══════════════════════════════════
   DESIGN FILTERS
═══════════════════════════════════ */
function initFilters() {
  var btns=document.querySelectorAll('.dfbtn'),cards=document.querySelectorAll('.dc');
  if(!btns.length)return;
  btns.forEach(function(btn){
    btn.addEventListener('click',function(e){
      btns.forEach(function(b){b.classList.remove('on');}); btn.classList.add('on');
      explode(e.clientX,e.clientY,'#00ffcc');
      var f=btn.dataset.filter;
      cards.forEach(function(card){card.style.display=(f==='all'||card.dataset.cat===f)?'':'none';});
    });
  });
}

/* ═══════════════════════════════════
   LIGHTBOX
═══════════════════════════════════ */
function initLightbox() {
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),
      lbT=document.getElementById('lb-title-txt'),lbC=document.getElementById('lb-client-txt'),
      lbX=document.getElementById('lb-x'),lbP=document.getElementById('lb-prev'),
      lbN=document.getElementById('lb-next'),lbCtr=document.getElementById('lb-ctr');
  if(!lb)return;
  var items=[],cur=0;
  var getAll=function(){return Array.prototype.slice.call(document.querySelectorAll('.dc-view')).map(function(b){return{img:b.dataset.img,title:b.dataset.title,client:b.dataset.client};});};
  var show=function(){var it=items[cur];if(!it)return;lbImg.src=it.img;lbImg.alt=it.title;if(lbT)lbT.textContent=it.title;if(lbC)lbC.textContent=it.client;if(lbCtr)lbCtr.textContent=(cur+1)+' / '+items.length;};
  var open=function(i){items=getAll();cur=Math.max(0,Math.min(i,items.length-1));show();lb.classList.add('open');document.body.style.overflow='hidden';};
  var close=function(){lb.classList.remove('open');document.body.style.overflow='';setTimeout(function(){lbImg.src='';},300);};
  var prev=function(){cur=(cur-1+items.length)%items.length;show();};
  var next=function(){cur=(cur+1)%items.length;show();};
  document.addEventListener('click',function(e){var b=e.target.closest('.dc-view');if(!b)return;var all=getAll();var i=all.findIndex?all.findIndex(function(it){return it.img===b.dataset.img&&it.title===b.dataset.title;}):0;open(i>=0?i:0);});
  if(lbX)lbX.addEventListener('click',close);
  if(lbP)lbP.addEventListener('click',prev);
  if(lbN)lbN.addEventListener('click',next);
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')prev();if(e.key==='ArrowRight')next();});
  var sx=0;
  lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50){dx<0?next():prev();}});
}

/* ═══════════════════════════════════
   FORM
═══════════════════════════════════ */
function initForm() {
  var form=document.getElementById('cform'),ok=document.getElementById('ok-box');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    form.style.display='none';
    if(ok)ok.classList.add('show');
    showAch('TRANSMISSION SENT','Message delivered!','📡',60);
    explode(window.innerWidth/2,window.innerHeight/2,'#00ffcc');
  });
}

/* ═══════════════════════════════════
   SCANLINE + CARD HOVER EFFECTS
═══════════════════════════════════ */
function initExtras() {
  var sl=document.createElement('div');sl.className='scanline';document.body.appendChild(sl);
  document.querySelectorAll('.sk-hex-card,.pcard,.holo-card').forEach(function(card){
    card.addEventListener('mouseenter',function(e){var r=card.getBoundingClientRect();explode(r.left+r.width/2,r.top,card.classList.contains('pcard')?'#ff0066':'#00ffcc');});
  });
}

/* ═══════════════════════════════════
   BOOT
═══════════════════════════════════ */
document.addEventListener('DOMContentLoaded',function(){
  initLoader();
  initMatrix();
  initParticleCanvas();
  init3D();
  initCursor();
  initReveal();
  initNav();
  initDots();
  initTilt();
  initCountUp();
  initBars();
  initHexRain();
  initFilters();
  initLightbox();
  initForm();
  initSectionAch();
  initExtras();
  typewriter(document.getElementById('typed'),[
    'DIGITAL MARKETING EXEC','SEO CONTENT WRITER',
    'WORDPRESS MANAGER','CANVA DESIGNER',
    'AI PROMPT ENGINEER','SOCIAL MEDIA CREATOR'
  ]);
  // Google Analytics
  if(typeof gtag!=='undefined') gtag('event','portfolio_loaded',{event_category:'engagement'});
});
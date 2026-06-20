const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'output');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
  });
  const page = await ctx.newPage();
  const wait = ms => page.waitForTimeout(ms);

  await page.goto('https://prayer.mscarabia.com', { waitUntil: 'networkidle', timeout: 30000 });
  await wait(2500);

  // Dismiss overlays
  await page.evaluate(() => {
    document.querySelector('#loc-overlay')?.classList.remove('show');
    const r = document.querySelector('#loc-ring'); if (r) r.style.display = 'none';
    document.querySelector('#location-popup')?.classList.remove('show');
    document.querySelector('.privacy-banner')?.classList.add('hidden');
  });
  await wait(300);

  // ── Inject animation engine ──
  await page.evaluate(() => {
    const css = `
      #dcursor{position:fixed;width:20px;height:20px;border-radius:50%;border:2px solid #2dd4bf;
        background:rgba(45,212,191,0.12);pointer-events:none;z-index:999999;
        box-shadow:0 0 16px rgba(45,212,191,0.35);transition:left 0.08s ease,top 0.08s ease}
      #dspot{position:fixed;inset:0;z-index:99998;pointer-events:none;opacity:0;transition:opacity 0.5s ease}
      #dtext{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);
        padding:10px 22px;border-radius:10px;background:rgba(9,17,23,0.94);
        border:1px solid rgba(45,212,191,0.2);color:#f0f6fa;font-size:15px;font-weight:600;
        font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;z-index:99999;pointer-events:none;
        box-shadow:0 8px 32px rgba(0,0,0,0.5);opacity:0;transition:all 0.4s cubic-bezier(0.22,0.61,0.36,1);
        white-space:nowrap;letter-spacing:0.01em}
      #dtext.vis{opacity:1;transform:translateX(-50%) translateY(0)}
      #dline{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);height:2px;width:0;
        border-radius:1px;background:linear-gradient(90deg,#2dd4bf,#06b6d4);z-index:99999;
        pointer-events:none;transition:width 0.4s ease 0.15s}
      #dfade{position:fixed;inset:0;background:#091117;z-index:99997;pointer-events:none;
        opacity:0;transition:opacity 0.4s ease}
    `;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

    ['dcursor','dspot','dtext','dline','dfade'].forEach(id => {
      const el = document.createElement('div'); el.id = id; document.body.appendChild(el);
    });

    const cursor = document.getElementById('dcursor');
    const spot = document.getElementById('dspot');
    const text = document.getElementById('dtext');
    const line = document.getElementById('dline');
    const fade = document.getElementById('dfade');

    window._d = {
      move(x, y) { cursor.style.left=(x-10)+'px'; cursor.style.top=(y-10)+'px'; },
      click() { cursor.style.transform='scale(1.6)'; cursor.style.background='rgba(45,212,191,0.3)'; setTimeout(()=>{cursor.style.transform='scale(1)';cursor.style.background='rgba(45,212,191,0.12)'},180); },
      spot(x,y,r=200){spot.style.opacity='1';spot.style.background=`radial-gradient(circle ${r}px at ${x}px ${y}px,transparent 0%,rgba(0,0,0,0.65) 100%)`;},
      spoff(){spot.style.opacity='0'},
      txt(t){text.textContent=t;text.classList.add('vis');line.style.width=text.offsetWidth+'px'},
      hide(){text.classList.remove('vis');line.style.width='0'},
      fadeIn(){fade.style.opacity='1'}, fadeOut(){fade.style.opacity='0'},
      zoomBadge(s){const b=document.querySelector('#status-badge');if(!b)return;b.style.transition='transform 0.45s cubic-bezier(0.22,0.61,0.36,1)';b.style.transform=`scale(${s})`;b.style.transformOrigin='left center';b.style.zIndex=s>1?'100':'';},
    };
  });

  async function moveTo(x, y, dur=500) {
    const steps = Math.max(8, Math.floor(dur/16));
    const from = await page.evaluate(() => ({x:parseFloat(document.getElementById('dcursor').style.left)+10,y:parseFloat(document.getElementById('dcursor').style.top)+10}));
    for (let i=1;i<=steps;i++){
      const t=i/steps, e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      await page.evaluate(({x,y})=>window._d.move(x,y),{x:from.x+(x-from.x)*e,y:from.y+(y-from.y)*e});
      await wait(16);
    }
  }

  // ════════ SCENE 1: Landing (3s) ════════
  console.log('1: Landing...');
  await wait(400);
  await page.evaluate(()=>window._d.txt('Prayer Times — Coordinate Salah across cities'));
  await wait(2800);
  await page.evaluate(()=>window._d.hide());
  await wait(500);

  // ════════ SCENE 2: Safe window drag (6s) ════════
  console.log('2: Safe window...');
  const sb = await page.locator('#sel').boundingBox();
  if (sb) {
    const sx=sb.x+sb.width/2, sy=sb.y+sb.height/2, tx=140+(1140*0.55);
    await moveTo(sx,sy,400); await wait(150);
    await page.evaluate(()=>window._d.click());
    await page.mouse.down();
    for(let i=1;i<=35;i++){const x=sx+(tx-sx)*(i/35);await page.evaluate(({x,y})=>window._d.move(x,y),{x,y:sy});await page.mouse.move(x,sy);await wait(18);}
    await page.mouse.up(); await wait(500);
  }
  await page.evaluate(()=>window._d.txt('Drag the bar to find a safe meeting window'));
  await wait(1200);

  // Zoom badge
  const bb = await page.locator('#status-badge').boundingBox();
  if (bb) {
    await page.evaluate(({x,y})=>window._d.spot(x,y,130),{x:bb.x+bb.width/2,y:bb.y+bb.height/2});
    await page.evaluate(()=>window._d.zoomBadge(2.2));
    await wait(600);
    await page.evaluate(()=>window._d.txt('Green — no conflicts, safe to schedule'));
    await wait(2200);
    await page.evaluate(()=>{window._d.zoomBadge(1);window._d.spoff();window._d.hide()});
    await wait(500);
  }

  // ════════ SCENE 3: Conflict (5s) ════════
  console.log('3: Conflict...');
  if (sb) {
    const sx=140+(1140*0.55), sy=sb.y+sb.height/2, tx=140+(1140*0.15);
    await moveTo(sx,sy,400); await page.evaluate(()=>window._d.click());
    await page.mouse.down();
    for(let i=1;i<=45;i++){const x=sx+(tx-sx)*(i/45);await page.evaluate(({x,y})=>window._d.move(x,y),{x,y:sy});await page.mouse.move(x,sy);await wait(18);}
    await page.mouse.up(); await wait(500);
  }
  const bb2 = await page.locator('#status-badge').boundingBox();
  if (bb2) {
    await page.evaluate(({x,y})=>window._d.spot(x,y,130),{x:bb2.x+bb2.width/2,y:bb2.y+bb2.height/2});
    await page.evaluate(()=>window._d.zoomBadge(2.2));
    await wait(600);
    await page.evaluate(()=>window._d.txt('Red — which prayer, which cities clash'));
    await wait(2200);
    await page.evaluate(()=>{window._d.zoomBadge(1);window._d.spoff();window._d.hide()});
    await wait(500);
  }

  // ════════ SCENE 4: CTA (3s) ════════
  console.log('4: CTA...');
  await page.evaluate(()=>{document.getElementById('dtext').style.color='#2dd4bf';document.getElementById('dtext').style.fontSize='17px'});
  await page.evaluate(()=>window._d.txt('prayer.mscarabia.com — try it now'));
  await wait(3000);

  await ctx.close();

  const files = fs.readdirSync(OUT).filter(f=>f.endsWith('.webm'));
  if(files.length){
    const src=path.join(OUT,files[0]), dst=path.join(__dirname,'prayer-times-demo.webm');
    if(fs.existsSync(dst))fs.unlinkSync(dst);
    fs.renameSync(src,dst);
    console.log(`Video: ${dst} (${(fs.statSync(dst).size/1024/1024).toFixed(1)} MB)`);
  }
  await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});

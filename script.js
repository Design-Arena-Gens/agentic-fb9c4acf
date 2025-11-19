const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const el = {
  platform: $('#platform'),
  duration: $('#duration'),
  tone: $('#tone'),
  niche: $('#niche'),
  trends: $('#trends'),
  autoTrend: $('#autoTrend'),
  generateList: $('#generateList'),
  generateScript: $('#generateScript'),
  results: $('#results'),
  copyAll: $('#copyAll'),
  exportTxt: $('#exportTxt'),
  shareApp: $('#shareApp')
};

function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  return function() {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const now = new Date();
const daySeed = Number(`${now.getFullYear()}${now.getMonth()+1}${now.getDate()}`);
let rnd = seededRandom(daySeed);

const data = {
  hooks: [
    'Rahsia {benefit} dalam {duration}s',
    'Anda masih {pain}? Cuba trik AI ni',
    '3 helah AI untuk {goal} ? no. {num} paling padu',
    'Tonton ni sebelum anda {audience_action}!',
    'Saya cuba {tool} selama 7 hari. Hasilnya? {benefit}',
    '{trend} tengah viral. Guna macam ni untuk {goal}',
  ],
  benefits: ['jimat 3? masa', 'naik engagement 2?', 'idea tak pernah kering', 'edit 5 minit siap', 'hasil nampak profesional'],
  pains: ['scroll tanpa post', 'habis masa edit', 'tiada idea', 'caption hambar', 'hook tak padu'],
  goals: ['hasilkan content harian', 'jualan naik', 'bina personal brand', 'edit lebih laju', 'videonya viral'],
  actions: ['follow untuk part 2', 'komen "AI" untuk template', 'DM "skrip" untuk dapat skrip', 'save video ni', 'share pada kawan content creator'],
  broll: ['tunjuk skrin', 'close-up muka', 'B-roll menaip', 'swipe contoh', 'before/after'],
  overlays: ['teks besar 3 perkataan', 'emoji + perkataan utama', 'progress bar', 'subtitel automatik', 'pop-out keyword'],
  audio: ['lagu trending (tempo 110?130)', 'beat trap lembut', 'instrumental chill', 'sound effect pop', 'transition woosh'],
  hashtags: ['#AI', '#UntukAnda', '#FYP', '#BelajarAI', '#ContentCreator', '#Bisnes', '#Produktiviti'],
  trends: ['Sora', 'GPT-4.1', 'Gemini Flash', 'Luma', 'CapCut Template', 'Midjourney Niji', 'Runway Gen-3', 'Claude Projects', 'HeyGen', 'ElevenLabs']
};

function pick(arr) { return arr[Math.floor(rnd() * arr.length)] }
function shuffle(arr){ return [...arr].sort(()=>rnd()-0.5) }

function parseTrends(input){
  const base = input.split(',').map(s=>s.trim()).filter(Boolean);
  return Array.from(new Set(base));
}

function makeIdea(idx, prefs){
  const { platform, duration, tone, niche, trends } = prefs;
  const trend = trends.length ? pick(trends) : pick(data.trends);
  const benefit = pick(data.benefits);
  const pain = pick(data.pains);
  const goal = pick(data.goals);
  const num = 1 + Math.floor(rnd()*5);

  const hookTpl = pick(data.hooks);
  const hook = hookTpl
    .replace('{benefit}', benefit)
    .replace('{duration}', duration)
    .replace('{pain}', pain)
    .replace('{goal}', goal)
    .replace('{num}', String(num))
    .replace('{tool}', trend)
    .replace('{trend}', trend)
    .replace('{audience_action}', 'post lagi video hambar');

  const title = `${trend} untuk ${niche}: ${benefit}`;
  const overlay = pick(data.overlays);
  const br = shuffle(data.broll).slice(0,2).join(', ');
  const audio = pick(data.audio);
  const cta = pick(data.actions);
  const tags = shuffle(data.hashtags).slice(0,4).concat(`#${platform}`, `#${trend.replace(/\s+/g,'')}`).join(' ');

  const outline = [
    `0-${Math.min(3, Math.floor(duration/5))}s: Hook ? ${hook}`,
    `${Math.min(3, Math.floor(duration/5))}-${Math.min(8, Math.floor(duration/2))}s: Demo ringkas ? ${trend} untuk ${goal}`,
    `${Math.min(8, Math.floor(duration/2))}-${duration-3}s: Tips pantas + overlay "${overlay}"`,
    `${duration-3}-${duration}s: CTA ? ${cta}`
  ];

  const caption = `${hook}. ${platform} ${niche}. ${benefit}. ${cta}.`;

  return { idx, title, hook, overlay, br, audio, cta, tags, outline, caption, trend, platform, duration, tone, niche };
}

function getPrefs(){
  const trends = parseTrends(el.trends.value || '');
  return {
    platform: el.platform.value,
    duration: Number(el.duration.value),
    tone: el.tone.value,
    niche: el.niche.value,
    trends
  };
}

function renderIdeas(items){
  el.results.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <div class="meta">
          <span class="badge">${item.platform}</span>
          <span class="badge">${item.duration}s</span>
          <span class="badge">${item.tone}</span>
          <span class="badge">${item.niche}</span>
        </div>
        <div class="meta">
          <button class="btn ghost btn-copy">Salin</button>
        </div>
      </div>
      <div class="kv"><span class="k">Judul</span><div class="v"><strong>${item.title}</strong></div></div>
      <div class="kv"><span class="k">Hook</span><div class="v">${item.hook}</div></div>
      <div class="grid-2">
        <div class="kv"><span class="k">Visual</span><div class="v">${item.br}</div></div>
        <div class="kv"><span class="k">Overlay</span><div class="v">${item.overlay}</div></div>
      </div>
      <div class="kv"><span class="k">Audio</span><div class="v">${item.audio}</div></div>
      <div class="kv"><span class="k">Struktur</span><div class="v">${item.outline.map(s=>`? ${s}`).join('<br>')}</div></div>
      <div class="kv"><span class="k">CTA</span><div class="v">${item.cta}</div></div>
      <div class="kv"><span class="k">Hashtag</span><div class="v">${item.tags}</div></div>
      <details class="kv"><summary class="k">Caption</summary><div class="v">${item.caption}</div></details>
    `;
    card.querySelector('.btn-copy').addEventListener('click', () => copyText(card.innerText));
    frag.appendChild(card);
  });
  el.results.appendChild(frag);
}

function generateMany(n=10){
  rnd = seededRandom(daySeed + Math.floor(Math.random()*100000));
  const prefs = getPrefs();
  const items = Array.from({length:n}, (_,i)=> makeIdea(i+1, prefs));
  renderIdeas(items);
}

function generateScript(){
  rnd = seededRandom(daySeed + Math.floor(Math.random()*100000));
  const prefs = getPrefs();
  const idea = makeIdea(1, prefs);
  const lines = [];
  lines.push(`# Skrip ${prefs.platform} (${prefs.duration}s) ? ${idea.trend}`);
  lines.push(`Hook: ${idea.hook}`);
  lines.push('Skrip Penuh:');
  lines.push(`- Buka dengan close-up, overlay: ${idea.overlay}`);
  lines.push(`- Papar demo ringkas ${idea.trend} untuk ${idea.niche} (${idea.goal || 'hasil cepat'})`);
  lines.push(`- Tunjuk before/after, b-roll: ${idea.br}`);
  lines.push(`- Akhir: ${idea.cta}`);
  lines.push(`Hashtag: ${idea.tags}`);
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-head">
      <div class="meta">
        <span class="badge">Skrip</span>
      </div>
      <div class="meta">
        <button class="btn ghost btn-copy">Salin</button>
      </div>
    </div>
    <div class="kv"><span class="k">Judul</span><div class="v"><strong>${idea.title}</strong></div></div>
    <pre class="kv" style="white-space:pre-wrap">${lines.join('\n')}</pre>
  `;
  el.results.innerHTML = '';
  el.results.appendChild(card);
  card.querySelector('.btn-copy').addEventListener('click', () => copyText(card.innerText));
}

function copyText(text){
  navigator.clipboard?.writeText(text).then(()=>notify('Disalin')).catch(()=>{
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    notify('Disalin');
  });
}

function copyAll(){
  const text = $$('#results .card').map(c=>c.innerText).join('\n\n');
  if(!text.trim()) return notify('Tiada hasil');
  copyText(text);
}

function exportTxt(){
  const text = $$('#results .card').map(c=>c.innerText).join('\n\n');
  if(!text.trim()) return notify('Tiada hasil');
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'idea-ai.txt'; a.click();
  URL.revokeObjectURL(url);
}

function notify(msg){
  const n = document.createElement('div');
  n.textContent = msg; n.style.position='fixed'; n.style.bottom='20px'; n.style.right='20px'; n.style.background='#0ea5e9'; n.style.color='#061018'; n.style.padding='10px 12px'; n.style.borderRadius='10px'; n.style.fontWeight='700';
  document.body.appendChild(n);
  setTimeout(()=>n.remove(), 1200);
}

function autoTrend(){
  const picks = shuffle(data.trends).slice(0,4).join(', ');
  el.trends.value = picks;
  notify('Diisi auto-trend');
}

async function shareApp(){
  const url = 'https://agentic-fb9c4acf.vercel.app';
  if(navigator.share){
    try { await navigator.share({title:'AI Short Video Idea', text:'Jana idea BM untuk TikTok/Reels/Shorts', url}); }
    catch{}
  } else { copyText(url); }
}

el.generateList.addEventListener('click', ()=> generateMany(10));
el.generateScript.addEventListener('click', generateScript);
el.copyAll.addEventListener('click', copyAll);
el.exportTxt.addEventListener('click', exportTxt);
el.autoTrend.addEventListener('click', autoTrend);
el.shareApp.addEventListener('click', shareApp);

// Auto generate on load
generateMany(10);

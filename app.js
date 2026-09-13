/* ---------------------------------------------------------
   Folio — client-side PDF tools
   All processing happens locally via pdf-lib and pdf.js.
   Shared across index.html / organize.html / convert.html / edit.html
--------------------------------------------------------- */

/* ---------- icons ---------- */
const ICONS = {
  merge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="12" height="15"/><rect x="9" y="1" width="12" height="15" fill="var(--paper)"/></svg>`,
  split: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><line x1="5" y1="12" x2="19" y2="12" stroke-dasharray="2.4 2.4"/><path d="M9 6l-3-3M15 6l3-3M9 18l-3 3M15 18l3 3"/></svg>`,
  remove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><rect x="8" y="9" width="8" height="6" fill="var(--paper)"/><line x1="9" y1="10" x2="15" y2="14"/><line x1="15" y1="10" x2="9" y2="14"/></svg>`,
  extract: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="12" height="16"/><rect x="12" y="11" width="10" height="11" fill="var(--paper)"/><line x1="17" y1="14" x2="17" y2="19"/><path d="M14.5 16.5L17 14l2.5 2.5"/></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="14" height="16"/><path d="M4 8a6 6 0 0 1 9-5.2"/><path d="M13 1l0 3.2-3.2 0"/></svg>`,
  rearrange: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="4.2"/><rect x="4" y="10" width="16" height="4.2"/><rect x="4" y="16" width="16" height="4.2"/><path d="M22 8V2M22 2l-2 2M22 2l2 2"/><path d="M2 16v6M2 22l-2-2M2 22l2-2"/></svg>`,
  img2pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="12" height="10" rx="1"/><circle cx="5" cy="8" r="1.1" fill="currentColor" stroke="none"/><path d="M2 13l3.5-4L8 12l2-2.5L13 13"/><path d="M17 4l0 16M17 20l6-6M17 20l-6-6" transform="translate(0,0)"/><rect x="13" y="6" width="10" height="14"/></svg>`,
  pdf2img: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="14"/><rect x="12" y="8" width="11" height="9" rx="1"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none"/><path d="M13 16l3-3 2.5 2.5L21 13l2 3"/></svg>`,
  pdf2word: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="16"/><text x="6" y="15" font-size="5.5" font-family="IBM Plex Mono, monospace" text-anchor="middle" stroke="none" fill="currentColor">PDF</text><path d="M13 12h9M18 8l4 4-4 4"/></svg>`,
  word2pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="4" width="10" height="16"/><text x="18" y="15" font-size="7" font-family="IBM Plex Mono, monospace" text-anchor="middle" stroke="none" fill="currentColor">W</text><path d="M2 12h9M7 8l-4 4 4 4"/></svg>`,
  numbers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><text x="12" y="17.5" font-size="7" font-family="IBM Plex Mono, monospace" text-anchor="middle" stroke="none" fill="currentColor">12</text></svg>`,
  watermark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><line x1="8" y1="16" x2="16" y2="6" stroke-width="2.2"/></svg>`,
  compress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><path d="M9 8l3 3 3-3M9 16l3-3 3 3"/></svg>`,
  resize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20"/><path d="M9 9L5 5M5 5v3.4M5 5h3.4"/><path d="M15 15l4 4M19 19v-3.4M19 19h-3.4"/></svg>`,
};

/* ---------- tool + category registry ---------- */
const TOOLS = [
  { id:'merge',     cat:'organize', title:'Merge PDF',        desc:'Combine several PDFs into one, in the order you choose.' },
  { id:'split',     cat:'organize', title:'Split PDF',        desc:'Pull page ranges out into their own files.' },
  { id:'remove',    cat:'organize', title:'Remove pages',     desc:'Delete the pages you don\u2019t need.', mode:'remove' },
  { id:'extract',   cat:'organize', title:'Extract pages',    desc:'Save selected pages as a new PDF.', mode:'extract' },
  { id:'rotate',    cat:'organize', title:'Rotate pages',     desc:'Turn pages the right way up.', mode:'rotate' },
  { id:'rearrange', cat:'organize', title:'Rearrange pages',  desc:'Drag pages into a new order.', mode:'rearrange' },
  { id:'img2pdf',   cat:'convert',  title:'Images to PDF',    desc:'Turn JPG or PNG files into a single PDF.' },
  { id:'pdf2img',   cat:'convert',  title:'PDF to Images',    desc:'Save each page as its own PNG file.' },
  { id:'pdf2word',  cat:'convert',  title:'PDF to Word',      desc:'Pull the text out of a PDF into an editable Word document.' },
  { id:'word2pdf',  cat:'convert',  title:'Word to PDF',      desc:'Turn a Word document\u2019s text into a PDF.' },
  { id:'numbers',   cat:'edit',     title:'Add page numbers', desc:'Stamp page numbers onto every page.' },
  { id:'watermark', cat:'edit',     title:'Add watermark',    desc:'Stamp text diagonally across every page.' },
  { id:'compress',  cat:'edit',     title:'Compress PDF',     desc:'Rebuild the file to shrink its size.' },
  { id:'resize',    cat:'edit',     title:'Reduce file size', desc:'Shrink a PDF to a size and quality you choose.' },
];

const CATS = [
  { id:'organize', label:'Combine & organize', color:'var(--tab-a)', desc:'Bring pages together, or pull them apart.', page:'organize.html' },
  { id:'convert',  label:'Convert',            color:'var(--tab-b)', desc:'Move content between PDF, image and Word files.', page:'convert.html' },
  { id:'edit',     label:'Edit & finish',      color:'var(--tab-c)', desc:'Small finishing touches before you send a file.', page:'edit.html' },
];

/* ---------- page init: tool grid on a category page ---------- */
function initToolGrid(catId){
  const grid = document.getElementById('tool-grid');
  if(!grid) return;
  TOOLS.filter(t=>t.cat===catId).forEach(t=>{
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('type','button');
    card.id = 'card-' + t.id;
    card.innerHTML = `<span class="icon">${ICONS[t.id]}</span><h3>${t.title}</h3><p>${t.desc}</p>`;
    card.addEventListener('click', ()=>openTool(t.id));
    grid.appendChild(card);
  });
}

/* ---------- page init: category tiles on the home page ---------- */
function initHomeCards(){
  const root = document.getElementById('home-cats');
  if(!root) return;
  CATS.forEach(cat=>{
    const names = TOOLS.filter(t=>t.cat===cat.id).map(t=>t.title);
    const tile = document.createElement('a');
    tile.className = 'cat-tile';
    tile.href = cat.page;
    tile.innerHTML = `
      <span class="cat-tab" style="background:${cat.color}">${cat.label}</span>
      <p>${cat.desc}</p>
      <ul>${names.map(n=>`<li>${n}</li>`).join('')}</ul>
      <div class="tool-tally"><span>${names.length} tool${names.length>1?'s':''}</span><span class="arrow">\u2192</span></div>
    `;
    root.appendChild(tile);
  });
}

/* ---------- generic helpers ---------- */
function formatBytes(b){
  if(b < 1024) return b + ' B';
  if(b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
  return (b/(1024*1024)).toFixed(2) + ' MB';
}
function readAsArrayBuffer(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = rej;
    r.readAsArrayBuffer(file);
  });
}
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 4000);
}
function baseName(name){ return name.replace(/\.pdf$/i,''); }
function el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

function wireDropzone(zone, input, onFiles){
  zone.addEventListener('click', ()=>input.click());
  input.addEventListener('change', e=>{ if(e.target.files.length) onFiles(e.target.files); });
  ['dragover','dragenter'].forEach(evt=>zone.addEventListener(evt, e=>{ e.preventDefault(); zone.classList.add('drag'); }));
  ['dragleave','drop'].forEach(evt=>zone.addEventListener(evt, e=>{ e.preventDefault(); zone.classList.remove('drag'); }));
  zone.addEventListener('drop', e=>{ if(e.dataTransfer.files.length) onFiles(e.dataTransfer.files); });
}

function setStatus(elmt, msg, isErr){
  elmt.textContent = msg || '';
  elmt.className = 'status' + (isErr ? ' err' : '');
}

function dropzoneTemplate(hint){
  return `<div class="dropzone">
    <input type="file" hidden>
    <p>Drop ${hint} here, or <span class="dz-browse">browse</span></p>
  </div>`;
}

function showResult(container, blob, filename){
  container.innerHTML = `<div class="result">
    <span class="rmeta">${filename} \u00b7 ${formatBytes(blob.size)}</span>
    <button class="btn">Download</button>
  </div>`;
  container.querySelector('button').onclick = ()=>downloadBlob(blob, filename);
}

/* ---------- workspace open/close ---------- */
function openTool(id){
  const tool = TOOLS.find(t=>t.id===id);
  const workspace = document.getElementById('workspace');
  const wsTitle = document.getElementById('ws-title');
  const wsDesc = document.getElementById('ws-desc');
  const wsBody = document.getElementById('ws-body');
  document.querySelectorAll('.card').forEach(c=>c.classList.toggle('active', c.id === 'card-' + id));
  wsTitle.textContent = tool.title;
  wsDesc.textContent = tool.desc;
  wsBody.innerHTML = '';
  workspace.classList.add('open');
  RENDERERS[id](wsBody, tool);
  workspace.scrollIntoView({behavior:'smooth', block:'start'});
}
function closeWorkspace(){
  const workspace = document.getElementById('workspace');
  document.querySelectorAll('.card.active').forEach(c=>c.classList.remove('active'));
  workspace.classList.remove('open');
  document.getElementById('ws-body').innerHTML = '';
}

/* ==================================================================
   MERGE PDF
================================================================== */
function renderMerge(body){
  body.innerHTML = `
    ${dropzoneTemplate('two or more PDF files')}
    <div class="filelist" id="m-list"></div>
    <div class="ws-actions">
      <button class="btn" id="m-go" disabled>Merge PDFs</button>
      <span class="status" id="m-status"></span>
    </div>
    <div id="m-result"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.multiple = true;
  input.accept = 'application/pdf';
  const list = body.querySelector('#m-list');
  const goBtn = body.querySelector('#m-go');
  const status = body.querySelector('#m-status');
  let files = [];

  wireDropzone(zone, input, fl=>{
    Array.from(fl).forEach(f=>{ if(f.type==='application/pdf' || /\.pdf$/i.test(f.name)) files.push(f); });
    renderList(); input.value='';
  });

  function renderList(){
    list.innerHTML='';
    files.forEach((f,i)=>{
      const row = el(`<div class="filerow" draggable="true" data-i="${i}">
        <span style="font-family:var(--mono);color:var(--ink-soft);font-size:12px;">${i+1}</span>
        <span class="fname">${f.name}</span>
        <span class="fsize">${formatBytes(f.size)}</span>
        <button data-act="up" title="Move up">\u2191</button>
        <button data-act="down" title="Move down">\u2193</button>
        <button data-act="del" title="Remove">\u2715</button>
      </div>`);
      row.querySelector('[data-act=up]').onclick = ()=>{ if(i>0){ [files[i-1],files[i]]=[files[i],files[i-1]]; renderList(); } };
      row.querySelector('[data-act=down]').onclick = ()=>{ if(i<files.length-1){ [files[i+1],files[i]]=[files[i],files[i+1]]; renderList(); } };
      row.querySelector('[data-act=del]').onclick = ()=>{ files.splice(i,1); renderList(); };
      list.appendChild(row);
    });
    goBtn.disabled = files.length < 2;
    setStatus(status, files.length ? `${files.length} file${files.length>1?'s':''} ready` : '');
  }

  goBtn.onclick = async ()=>{
    goBtn.disabled = true;
    setStatus(status, 'Merging\u2026');
    try{
      const out = await PDFDocument.create();
      for(const f of files){
        const bytes = await readAsArrayBuffer(f);
        const src = await PDFDocument.load(bytes, {ignoreEncryption:true});
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p=>out.addPage(p));
      }
      const bytes = await out.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(body.querySelector('#m-result'), blob, 'merged.pdf');
    }catch(e){ console.error(e); setStatus(status, 'Could not merge those files.', true); }
    goBtn.disabled = files.length < 2;
  };
}

/* ==================================================================
   ORGANIZE PAGES (remove / extract / rotate / rearrange)
================================================================== */
function renderOrganizer(body, tool){
  const mode = tool.mode;
  const defaultKeep = mode !== 'extract';
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="o-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#o-area');
  let pages = [];   // {origIndex, baseRot, extraRot, keep}
  let fileName = 'document';

  wireDropzone(zone, input, async fl=>{
    const f = fl[0];
    if(!f) return;
    fileName = baseName(f.name);
    area.innerHTML = `<p class="status">Loading pages\u2026</p>`;
    try{
      const buf = await readAsArrayBuffer(f);
      const pdfjsDoc = await pdfjsLib.getDocument({data: buf.slice(0)}).promise;
      const libDoc = await PDFDocument.load(buf.slice(0), {ignoreEncryption:true});
      const count = pdfjsDoc.numPages;
      pages = [];
      for(let i=0;i<count;i++){
        pages.push({ origIndex:i, baseRot: libDoc.getPage(i).getRotation().angle, extraRot:0, keep: defaultKeep });
      }
      renderArea();
      for(let i=0;i<count;i++){ renderThumb(pdfjsDoc, i, area); }
    }catch(e){ console.error(e); area.innerHTML = `<p class="status err">Could not read that PDF.</p>`; }
  });

  function renderArea(){
    area.innerHTML = `
      <div class="ws-actions" style="margin-bottom:16px;">
        ${mode==='rotate' ? `<button class="btn ghost" id="o-rot-all">Rotate all 90\u00b0</button>` : ''}
        ${mode==='remove'||mode==='extract' ? `<span class="fine-note" id="o-count"></span>` : ''}
      </div>
      <div class="thumb-grid" id="o-grid"></div>
      <div class="ws-actions" style="margin-top:20px;">
        <button class="btn" id="o-go">${mode==='extract' ? 'Save selected pages' : 'Save PDF'}</button>
        <span class="status" id="o-status"></span>
      </div>
      <div id="o-result"></div>
    `;
    if(mode==='rotate'){
      area.querySelector('#o-rot-all').onclick = ()=>{
        pages.forEach(p=>p.extraRot = (p.extraRot+90)%360);
        area.querySelectorAll('.thumb .canvas-wrap').forEach((w,i)=>{
          w.firstElementChild.style.transform = `rotate(${pages[i].extraRot}deg)`;
        });
      };
    }
    updateCount();
    area.querySelector('#o-go').onclick = saveOrganized;
  }

  function updateCount(){
    const c = area.querySelector('#o-count');
    if(c) c.textContent = `${pages.filter(p=>p.keep).length} of ${pages.length} pages selected`;
  }

  async function renderThumb(pdfjsDoc, idx){
    const grid = document.getElementById('o-grid');
    if(!grid) return;
    const item = el(`<div class="thumb" draggable="true" data-idx="${idx}">
      <div class="canvas-wrap"></div>
      <div class="thumb-row">
        <label class="keep"><input type="checkbox" ${pages[idx].keep?'checked':''}> p.${idx+1}</label>
        <span class="thumb-actions"><button data-act="rot">\u21bb</button></span>
      </div>
    </div>`);
    grid.appendChild(item);
    const cb = item.querySelector('input[type=checkbox]');
    cb.onchange = ()=>{ findPage(item).keep = cb.checked; item.classList.toggle('removed', !cb.checked); updateCount(); };
    item.querySelector('[data-act=rot]').onclick = ()=>{
      const p = findPage(item);
      p.extraRot = (p.extraRot+90)%360;
      item.querySelector('canvas,img').style.transform = `rotate(${p.extraRot}deg)`;
    };
    wireDrag(item, grid);

    const page = await pdfjsDoc.getPage(idx+1);
    const vp = page.getViewport({scale:0.32});
    const canvas = document.createElement('canvas');
    canvas.width = vp.width; canvas.height = vp.height;
    await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
    canvas.style.transform = `rotate(${pages[idx].extraRot}deg)`;
    item.querySelector('.canvas-wrap').appendChild(canvas);
    if(!pages[idx].keep) item.classList.add('removed');
  }

  function findPage(item){
    const grid = document.getElementById('o-grid');
    const idx = Array.from(grid.children).indexOf(item);
    return pages[idx];
  }

  function wireDrag(item, grid){
    item.addEventListener('dragstart', ()=>{ item.classList.add('dragging'); item._dragIdx = Array.from(grid.children).indexOf(item); });
    item.addEventListener('dragend', ()=>item.classList.remove('dragging'));
    item.addEventListener('dragover', e=>{
      e.preventDefault();
      const dragging = grid.querySelector('.dragging');
      if(!dragging || dragging===item) return;
      const items = Array.from(grid.children);
      const from = items.indexOf(dragging), to = items.indexOf(item);
      if(from<0||to<0) return;
      if(from<to) grid.insertBefore(dragging, item.nextSibling);
      else grid.insertBefore(dragging, item);
      const [moved] = pages.splice(from,1);
      pages.splice(items.indexOf(item)===to && from<to ? to : to, 0, moved);
      syncPagesToDom(grid);
    });
  }
  function syncPagesToDom(grid){
    const newOrder = [];
    Array.from(grid.children).forEach((child)=>{
      const dataIdx = parseInt(child.getAttribute('data-idx'),10);
      const found = pages.find(p=>p.origIndex===dataIdx);
      if(found) newOrder.push(found);
    });
    if(newOrder.length===pages.length) pages = newOrder;
  }

  async function saveOrganized(){
    const status = document.getElementById('o-status');
    const goBtn = document.getElementById('o-go');
    goBtn.disabled = true;
    setStatus(status, 'Saving\u2026');
    try{
      const keep = pages.filter(p=>p.keep);
      if(!keep.length){ setStatus(status,'Select at least one page.', true); goBtn.disabled=false; return; }
      const fileInput = document.querySelector('#workspace input[type=file]');
      const f = fileInput.files[0];
      const buf = await readAsArrayBuffer(f);
      const src = await PDFDocument.load(buf, {ignoreEncryption:true});
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keep.map(p=>p.origIndex));
      copied.forEach((p, i)=>{
        p.setRotation(degrees((keep[i].baseRot + keep[i].extraRot) % 360));
        out.addPage(p);
      });
      const bytes = await out.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(document.getElementById('o-result'), blob, `${fileName}-edited.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong saving the PDF.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   SPLIT PDF
================================================================== */
function renderSplit(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="s-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#s-area');
  let file=null, pageCount=0, fileName='document';

  wireDropzone(zone, input, async fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    try{
      const buf = await readAsArrayBuffer(file);
      const doc = await PDFDocument.load(buf, {ignoreEncryption:true});
      pageCount = doc.getPageCount();
      area.innerHTML = `
        <div class="file-chip"><span>${file.name}</span><span class="sz">${pageCount} pages \u00b7 ${formatBytes(file.size)}</span></div>
        <div class="field-row">
          <div class="field" style="flex:1; min-width:220px;">
            <label>Page ranges (e.g. 1-3, 4, 7-10)</label>
            <input type="text" id="s-ranges" placeholder="1-${pageCount}">
          </div>
        </div>
        <p class="fine-note">Each range you list becomes its own PDF. Leave blank to split into one file per page.</p>
        <div class="ws-actions">
          <button class="btn" id="s-go">Split PDF</button>
          <span class="status" id="s-status"></span>
        </div>
        <div id="s-result"></div>
      `;
      area.querySelector('#s-go').onclick = doSplit;
    }catch(e){ console.error(e); area.innerHTML = `<p class="status err">Could not read that PDF.</p>`; }
  });

  function parseRanges(text){
    if(!text.trim()) return Array.from({length:pageCount}, (_,i)=>[i,i]);
    return text.split(',').map(part=>part.trim()).filter(Boolean).map(part=>{
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if(m) return [parseInt(m[1],10)-1, parseInt(m[2],10)-1];
      const n = parseInt(part,10);
      return [n-1, n-1];
    }).filter(([a,b])=>a>=0 && b<pageCount && a<=b);
  }

  async function doSplit(){
    const status = document.getElementById('s-status');
    const goBtn = document.getElementById('s-go');
    goBtn.disabled = true;
    setStatus(status, 'Splitting\u2026');
    try{
      const ranges = parseRanges(document.getElementById('s-ranges').value);
      if(!ranges.length){ setStatus(status, 'Enter at least one valid range.', true); goBtn.disabled=false; return; }
      const buf = await readAsArrayBuffer(file);
      const outputs = [];
      for(const [a,b] of ranges){
        const src = await PDFDocument.load(buf, {ignoreEncryption:true});
        const out = await PDFDocument.create();
        const idxs = []; for(let i=a;i<=b;i++) idxs.push(i);
        const copied = await out.copyPages(src, idxs);
        copied.forEach(p=>out.addPage(p));
        const bytes = await out.save();
        outputs.push({ name: `${fileName}-p${a+1}${b>a?('-'+(b+1)):''}.pdf`, bytes });
      }
      if(outputs.length===1){
        const blob = new Blob([outputs[0].bytes], {type:'application/pdf'});
        setStatus(status,'Done');
        showResult(document.getElementById('s-result'), blob, outputs[0].name);
      }else{
        const zip = new JSZip();
        outputs.forEach(o=>zip.file(o.name, o.bytes));
        const blob = await zip.generateAsync({type:'blob'});
        setStatus(status,'Done');
        showResult(document.getElementById('s-result'), blob, `${fileName}-split.zip`);
      }
    }catch(e){ console.error(e); setStatus(status,'Something went wrong splitting the file.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   IMAGES TO PDF
================================================================== */
function renderImg2Pdf(body){
  body.innerHTML = `
    ${dropzoneTemplate('JPG or PNG images')}
    <div class="filelist" id="i-list"></div>
    <div class="ws-actions">
      <button class="btn" id="i-go" disabled>Create PDF</button>
      <span class="status" id="i-status"></span>
    </div>
    <div id="i-result"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.multiple = true; input.accept = 'image/png,image/jpeg';
  const list = body.querySelector('#i-list');
  const goBtn = body.querySelector('#i-go');
  const status = body.querySelector('#i-status');
  let files = [];

  wireDropzone(zone, input, fl=>{
    Array.from(fl).forEach(f=>{ if(/^image\/(png|jpeg)$/.test(f.type)) files.push(f); });
    renderList(); input.value='';
  });

  function renderList(){
    list.innerHTML='';
    files.forEach((f,i)=>{
      const url = URL.createObjectURL(f);
      const row = el(`<div class="filerow">
        <img class="thumb-sm" src="${url}">
        <span class="fname">${f.name}</span>
        <span class="fsize">${formatBytes(f.size)}</span>
        <button data-act="up">\u2191</button>
        <button data-act="down">\u2193</button>
        <button data-act="del">\u2715</button>
      </div>`);
      row.querySelector('[data-act=up]').onclick = ()=>{ if(i>0){ [files[i-1],files[i]]=[files[i],files[i-1]]; renderList(); } };
      row.querySelector('[data-act=down]').onclick = ()=>{ if(i<files.length-1){ [files[i+1],files[i]]=[files[i],files[i+1]]; renderList(); } };
      row.querySelector('[data-act=del]').onclick = ()=>{ files.splice(i,1); renderList(); };
      list.appendChild(row);
    });
    goBtn.disabled = files.length < 1;
    setStatus(status, files.length ? `${files.length} image${files.length>1?'s':''} ready` : '');
  }

  goBtn.onclick = async ()=>{
    goBtn.disabled = true;
    setStatus(status, 'Building PDF\u2026');
    try{
      const out = await PDFDocument.create();
      for(const f of files){
        const buf = await readAsArrayBuffer(f);
        const img = f.type === 'image/png' ? await out.embedPng(buf) : await out.embedJpg(buf);
        const maxW = 612; // Letter width in points
        const scale = Math.min(1, maxW / img.width);
        const w = img.width*scale, h = img.height*scale;
        const page = out.addPage([w,h]);
        page.drawImage(img, {x:0, y:0, width:w, height:h});
      }
      const bytes = await out.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(document.getElementById('i-result'), blob, 'images.pdf');
    }catch(e){ console.error(e); setStatus(status, 'Could not build a PDF from those images.', true); }
    goBtn.disabled = false;
  };
}

/* ==================================================================
   PDF TO IMAGES
================================================================== */
function renderPdf2Img(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="p-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#p-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, async fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `<p class="status">Reading file\u2026</p>`;
    try{
      const buf = await readAsArrayBuffer(file);
      const doc = await pdfjsLib.getDocument({data:buf}).promise;
      area.innerHTML = `
        <div class="file-chip"><span>${file.name}</span><span class="sz">${doc.numPages} pages \u00b7 ${formatBytes(file.size)}</span></div>
        <div class="field-row">
          <div class="field">
            <label>Resolution</label>
            <select id="p-scale">
              <option value="1">Standard</option>
              <option value="2" selected>High</option>
              <option value="3">Very high</option>
            </select>
          </div>
        </div>
        <div class="ws-actions">
          <button class="btn" id="p-go">Convert to PNG</button>
          <span class="status" id="p-status"></span>
        </div>
        <div id="p-result"></div>
      `;
      area.querySelector('#p-go').onclick = ()=>doConvert(doc);
    }catch(e){ console.error(e); area.innerHTML = `<p class="status err">Could not read that PDF.</p>`; }
  });

  async function doConvert(doc){
    const status = document.getElementById('p-status');
    const goBtn = document.getElementById('p-go');
    goBtn.disabled = true;
    const scale = parseFloat(document.getElementById('p-scale').value);
    try{
      const images = [];
      for(let i=1;i<=doc.numPages;i++){
        setStatus(status, `Rendering page ${i} of ${doc.numPages}\u2026`);
        const page = await doc.getPage(i);
        const vp = page.getViewport({scale});
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
        const blob = await new Promise(res=>canvas.toBlob(res, 'image/png'));
        images.push({ name: `${fileName}-p${String(i).padStart(2,'0')}.png`, blob });
      }
      if(images.length===1){
        setStatus(status, 'Done');
        showResult(document.getElementById('p-result'), images[0].blob, images[0].name);
      }else{
        setStatus(status, 'Zipping\u2026');
        const zip = new JSZip();
        images.forEach(im=>zip.file(im.name, im.blob));
        const blob = await zip.generateAsync({type:'blob'});
        setStatus(status, 'Done');
        showResult(document.getElementById('p-result'), blob, `${fileName}-images.zip`);
      }
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong converting the file.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   PDF TO WORD
   Pulls text out of the PDF (via pdf.js) and writes a minimal,
   valid .docx (a zip of OOXML parts, built with JSZip). Layout,
   images and complex formatting are not preserved — text only.
================================================================== */
function escapeXml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

async function extractPdfTextByPage(doc){
  const pages = [];
  for(let i=1;i<=doc.numPages;i++){
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const lines = [];
    let cur = '';
    content.items.forEach(item=>{
      cur += item.str;
      if(item.hasEOL){ lines.push(cur); cur=''; }
      else if(item.str){ cur += ' '; }
    });
    if(cur.trim()) lines.push(cur);
    pages.push(lines.filter(l=>l.trim().length));
  }
  return pages;
}

async function buildDocx(pages){
  const CT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
</w:styles>`;

  let body = '';
  pages.forEach((lines, pi)=>{
    if(!lines.length) body += `<w:p/>`;
    lines.forEach(line=>{
      body += `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line.trim())}</w:t></w:r></w:p>`;
    });
    if(pi < pages.length-1){
      body += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
  });
  const DOCUMENT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', CT);
  zip.folder('_rels').file('.rels', RELS);
  const wordFolder = zip.folder('word');
  wordFolder.file('document.xml', DOCUMENT);
  wordFolder.file('styles.xml', STYLES);
  wordFolder.folder('_rels').file('document.xml.rels', DOC_RELS);
  return await zip.generateAsync({type:'blob', mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}

function renderPdf2Word(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="pw-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#pw-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, async fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `<p class="status">Reading file\u2026</p>`;
    try{
      const buf = await readAsArrayBuffer(file);
      const doc = await pdfjsLib.getDocument({data:buf}).promise;
      area.innerHTML = `
        <div class="file-chip"><span>${file.name}</span><span class="sz">${doc.numPages} pages \u00b7 ${formatBytes(file.size)}</span></div>
        <p class="fine-note">This pulls the text out of the PDF into an editable Word document. Layout, images and complex formatting aren't preserved \u2014 only the text.</p>
        <div class="ws-actions">
          <button class="btn" id="pw-go">Convert to Word</button>
          <span class="status" id="pw-status"></span>
        </div>
        <div id="pw-result"></div>
      `;
      area.querySelector('#pw-go').onclick = ()=>doPdf2Word(doc);
    }catch(e){ console.error(e); area.innerHTML = `<p class="status err">Could not read that PDF.</p>`; }
  });

  async function doPdf2Word(doc){
    const status = document.getElementById('pw-status');
    const goBtn = document.getElementById('pw-go');
    goBtn.disabled = true;
    setStatus(status, 'Extracting text\u2026');
    try{
      const pages = await extractPdfTextByPage(doc);
      setStatus(status, 'Building Word document\u2026');
      const blob = await buildDocx(pages);
      setStatus(status, 'Done');
      showResult(document.getElementById('pw-result'), blob, `${fileName}.docx`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong converting the file.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   WORD TO PDF
   Pulls text out of the .docx (via mammoth.js) and lays it out on
   PDF pages with pdf-lib. Complex formatting, images and tables are
   not preserved — only the text.
================================================================== */
async function textToPdfDoc(paragraphs){
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = 11, lineHeight = size * 1.4;
  const pageW = 612, pageH = 792, margin = 56;
  const maxWidth = pageW - margin*2;
  let page = doc.addPage([pageW, pageH]);
  let y = pageH - margin;

  function newPage(){ page = doc.addPage([pageW,pageH]); y = pageH - margin; }
  function drawLine(line){
    if(y < margin){ newPage(); }
    page.drawText(line, {x:margin, y, size, font, color: rgb(0.13,0.13,0.13)});
    y -= lineHeight;
  }

  paragraphs.forEach(par=>{
    if(!par.trim()){ y -= lineHeight*0.6; if(y<margin) newPage(); return; }
    const words = par.trim().split(/\s+/);
    let line = '';
    words.forEach(word=>{
      const test = line ? line + ' ' + word : word;
      if(font.widthOfTextAtSize(test, size) > maxWidth && line){
        drawLine(line);
        line = word;
      } else {
        line = test;
      }
    });
    if(line) drawLine(line);
    y -= lineHeight*0.4;
  });
  return doc;
}

function renderWord2Pdf(body){
  body.innerHTML = `
    ${dropzoneTemplate('a .docx file')}
    <div id="wp-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const area = body.querySelector('#wp-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, fl=>{
    file = fl[0]; if(!file) return;
    if(!/\.docx$/i.test(file.name)){
      area.innerHTML = `<p class="status err">Please choose a .docx file (older .doc files aren't supported).</p>`;
      return;
    }
    fileName = baseName(file.name).replace(/\.docx$/i,'');
    area.innerHTML = `
      <div class="file-chip"><span>${file.name}</span><span class="sz">${formatBytes(file.size)}</span></div>
      <p class="fine-note">This pulls the text out of your Word document onto PDF pages. Complex formatting, images and tables aren't preserved \u2014 only the text.</p>
      <div class="ws-actions">
        <button class="btn" id="wp-go">Convert to PDF</button>
        <span class="status" id="wp-status"></span>
      </div>
      <div id="wp-result"></div>
    `;
    area.querySelector('#wp-go').onclick = doWord2Pdf;
  });

  async function doWord2Pdf(){
    const status = document.getElementById('wp-status');
    const goBtn = document.getElementById('wp-go');
    goBtn.disabled = true;
    setStatus(status, 'Reading document\u2026');
    try{
      const buf = await readAsArrayBuffer(file);
      const result = await mammoth.extractRawText({arrayBuffer: buf});
      const paragraphs = result.value.split(/\n/);
      setStatus(status, 'Building PDF\u2026');
      const doc = await textToPdfDoc(paragraphs);
      const bytes = await doc.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(document.getElementById('wp-result'), blob, `${fileName}.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong converting the file.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   ADD PAGE NUMBERS
================================================================== */
function renderNumbers(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="n-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#n-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `
      <div class="file-chip"><span>${file.name}</span><span class="sz">${formatBytes(file.size)}</span></div>
      <div class="field-row">
        <div class="field">
          <label>Position</label>
          <select id="n-pos">
            <option value="bottom-center" selected>Bottom center</option>
            <option value="bottom-right">Bottom right</option>
            <option value="top-center">Top center</option>
            <option value="top-right">Top right</option>
          </select>
        </div>
        <div class="field">
          <label>Start at</label>
          <input type="number" id="n-start" value="1" min="1" style="width:80px;">
        </div>
        <div class="field">
          <label>Font size</label>
          <input type="number" id="n-size" value="10" min="6" max="24" style="width:80px;">
        </div>
      </div>
      <div class="ws-actions">
        <button class="btn" id="n-go">Add page numbers</button>
        <span class="status" id="n-status"></span>
      </div>
      <div id="n-result"></div>
    `;
    area.querySelector('#n-go').onclick = doNumbers;
  });

  async function doNumbers(){
    const status = document.getElementById('n-status');
    const goBtn = document.getElementById('n-go');
    goBtn.disabled = true;
    setStatus(status, 'Adding numbers\u2026');
    try{
      const pos = document.getElementById('n-pos').value;
      const start = parseInt(document.getElementById('n-start').value,10) || 1;
      const size = parseInt(document.getElementById('n-size').value,10) || 10;
      const buf = await readAsArrayBuffer(file);
      const doc = await PDFDocument.load(buf, {ignoreEncryption:true});
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const margin = 26;
      doc.getPages().forEach((page, i)=>{
        const label = String(start + i);
        const w = page.getWidth(), h = page.getHeight();
        const tw = font.widthOfTextAtSize(label, size);
        let x,y;
        if(pos==='bottom-center'){ x=(w-tw)/2; y=margin*0.6; }
        else if(pos==='bottom-right'){ x=w-margin-tw; y=margin*0.6; }
        else if(pos==='top-center'){ x=(w-tw)/2; y=h-margin; }
        else { x=w-margin-tw; y=h-margin; }
        page.drawText(label, {x,y,size,font,color:rgb(0.15,0.15,0.15)});
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(document.getElementById('n-result'), blob, `${fileName}-numbered.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   ADD WATERMARK
================================================================== */
function renderWatermark(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="w-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#w-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `
      <div class="file-chip"><span>${file.name}</span><span class="sz">${formatBytes(file.size)}</span></div>
      <div class="field-row">
        <div class="field" style="flex:1; min-width:180px;">
          <label>Watermark text</label>
          <input type="text" id="w-text" placeholder="e.g. DRAFT" value="DRAFT">
        </div>
        <div class="field">
          <label>Size</label>
          <input type="number" id="w-size" value="54" min="12" max="120" style="width:80px;">
        </div>
        <div class="field">
          <label>Opacity</label>
          <input type="range" id="w-opacity" min="10" max="80" value="30">
        </div>
      </div>
      <div class="ws-actions">
        <button class="btn" id="w-go">Add watermark</button>
        <span class="status" id="w-status"></span>
      </div>
      <div id="w-result"></div>
    `;
    area.querySelector('#w-go').onclick = doWatermark;
  });

  async function doWatermark(){
    const status = document.getElementById('w-status');
    const goBtn = document.getElementById('w-go');
    goBtn.disabled = true;
    const text = document.getElementById('w-text').value.trim() || 'DRAFT';
    const size = parseInt(document.getElementById('w-size').value,10) || 54;
    const opacity = (parseInt(document.getElementById('w-opacity').value,10) || 30) / 100;
    setStatus(status, 'Stamping pages\u2026');
    try{
      const buf = await readAsArrayBuffer(file);
      const doc = await PDFDocument.load(buf, {ignoreEncryption:true});
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages().forEach(page=>{
        const w = page.getWidth(), h = page.getHeight();
        const tw = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: w/2 - tw/2, y: h/2, size, font,
          color: rgb(0.55,0.15,0.1), opacity,
          rotate: degrees(40),
        });
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      setStatus(status, 'Done');
      showResult(document.getElementById('w-result'), blob, `${fileName}-watermarked.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   COMPRESS PDF
================================================================== */
function renderCompress(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="c-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#c-area');
  let file=null, fileName='document';

  wireDropzone(zone, input, fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `
      <div class="file-chip"><span>${file.name}</span><span class="sz">${formatBytes(file.size)}</span></div>
      <p class="fine-note">This rebuilds the file with an optimized internal structure. It works best on PDFs with lots of small edits, unused objects, or embedded fonts. Files already saved by image compressors won't shrink much further.</p>
      <div class="ws-actions">
        <button class="btn" id="c-go">Compress PDF</button>
        <span class="status" id="c-status"></span>
      </div>
      <div id="c-result"></div>
    `;
    area.querySelector('#c-go').onclick = doCompress;
  });

  async function doCompress(){
    const status = document.getElementById('c-status');
    const goBtn = document.getElementById('c-go');
    goBtn.disabled = true;
    setStatus(status, 'Compressing\u2026');
    try{
      const buf = await readAsArrayBuffer(file);
      const before = buf.byteLength;
      const doc = await PDFDocument.load(buf, {ignoreEncryption:true, updateMetadata:false});
      const bytes = await doc.save({useObjectStreams:true});
      const after = bytes.byteLength;
      const blob = new Blob([bytes], {type:'application/pdf'});
      const pct = Math.max(0, Math.round((1 - after/before)*100));
      setStatus(status, `Before ${formatBytes(before)} \u2192 after ${formatBytes(after)} (\u2212${pct}%)`);
      showResult(document.getElementById('c-result'), blob, `${fileName}-compressed.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong.', true); }
    goBtn.disabled = false;
  }
}

/* ==================================================================
   REDUCE FILE SIZE (custom size reducer)
   Re-renders every page as a JPEG at a resolution and quality you
   choose, then rebuilds the PDF from those images. Gives real,
   adjustable size control (unlike Compress's lossless rebuild), at
   the cost of text no longer being selectable or searchable.
================================================================== */
function renderResize(body){
  body.innerHTML = `
    ${dropzoneTemplate('a PDF file')}
    <div id="rz-area"></div>
  `;
  const zone = body.querySelector('.dropzone');
  const input = zone.querySelector('input');
  input.accept = 'application/pdf';
  const area = body.querySelector('#rz-area');
  let file=null, fileName='document', pdfjsDoc=null;

  wireDropzone(zone, input, async fl=>{
    file = fl[0]; if(!file) return;
    fileName = baseName(file.name);
    area.innerHTML = `<p class="status">Reading file\u2026</p>`;
    try{
      const buf = await readAsArrayBuffer(file);
      pdfjsDoc = await pdfjsLib.getDocument({data:buf}).promise;
      area.innerHTML = `
        <div class="file-chip"><span>${file.name}</span><span class="sz">${pdfjsDoc.numPages} pages \u00b7 ${formatBytes(file.size)}</span></div>
        <div class="field-row">
          <div class="field">
            <label>Resolution</label>
            <select id="rz-res">
              <option value="0.85">Draft (smallest)</option>
              <option value="1.25" selected>Standard</option>
              <option value="1.75">Sharp</option>
            </select>
          </div>
          <div class="field">
            <label>Quality (<span id="rz-q-val">65</span>%)</label>
            <input type="range" id="rz-quality" min="20" max="95" value="65">
          </div>
        </div>
        <p class="fine-note">This re-renders each page as an image at the size and quality you pick, then rebuilds the PDF from those images. Lower resolution and quality mean a smaller file, but text stops being selectable or searchable \u2014 use Compress instead if you need to keep the file as-is.</p>
        <div class="ws-actions">
          <button class="btn" id="rz-go">Reduce size</button>
          <span class="status" id="rz-status"></span>
        </div>
        <div id="rz-result"></div>
      `;
      const qInput = area.querySelector('#rz-quality');
      qInput.oninput = ()=>{ area.querySelector('#rz-q-val').textContent = qInput.value; };
      area.querySelector('#rz-go').onclick = doResize;
    }catch(e){ console.error(e); area.innerHTML = `<p class="status err">Could not read that PDF.</p>`; }
  });

  async function doResize(){
    const status = document.getElementById('rz-status');
    const goBtn = document.getElementById('rz-go');
    goBtn.disabled = true;
    const scale = parseFloat(document.getElementById('rz-res').value);
    const quality = (parseInt(document.getElementById('rz-quality').value,10) || 65) / 100;
    try{
      const before = file.size;
      const out = await PDFDocument.create();
      for(let i=1;i<=pdfjsDoc.numPages;i++){
        setStatus(status, `Rendering page ${i} of ${pdfjsDoc.numPages}\u2026`);
        const page = await pdfjsDoc.getPage(i);
        const vp = page.getViewport({scale});
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
        const jpegBlob = await new Promise(res=>canvas.toBlob(res, 'image/jpeg', quality));
        const jpegBytes = await jpegBlob.arrayBuffer();
        const img = await out.embedJpg(jpegBytes);
        const nativeVp = page.getViewport({scale:1});
        const pdfPage = out.addPage([nativeVp.width, nativeVp.height]);
        pdfPage.drawImage(img, {x:0, y:0, width: nativeVp.width, height: nativeVp.height});
      }
      setStatus(status, 'Saving\u2026');
      const bytes = await out.save();
      const blob = new Blob([bytes], {type:'application/pdf'});
      const after = blob.size;
      const pct = Math.round((1 - after/before)*100);
      setStatus(status, pct > 0
        ? `Before ${formatBytes(before)} \u2192 after ${formatBytes(after)} (\u2212${pct}%)`
        : `Before ${formatBytes(before)} \u2192 after ${formatBytes(after)}`);
      showResult(document.getElementById('rz-result'), blob, `${fileName}-reduced.pdf`);
    }catch(e){ console.error(e); setStatus(status, 'Something went wrong reducing the file.', true); }
    goBtn.disabled = false;
  }
}

/* ---------- renderer dispatch ---------- */
const RENDERERS = {
  merge: renderMerge,
  split: renderSplit,
  remove: (b,t)=>renderOrganizer(b,t),
  extract: (b,t)=>renderOrganizer(b,t),
  rotate: (b,t)=>renderOrganizer(b,t),
  rearrange: (b,t)=>renderOrganizer(b,t),
  img2pdf: renderImg2Pdf,
  pdf2img: renderPdf2Img,
  pdf2word: renderPdf2Word,
  word2pdf: renderWord2Pdf,
  numbers: renderNumbers,
  watermark: renderWatermark,
  compress: renderCompress,
  resize: renderResize,
};

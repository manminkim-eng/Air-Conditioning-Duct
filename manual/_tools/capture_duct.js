// 공조 덕트 규격 산정 시스템 매뉴얼 화면 캡처 — usage: node capture_duct.js <repoDir> <outDir>
// 규격: 1440×900 · DSF 1.25 · _marks.json(번호 배지 % 좌표) · _example.json(예제 검증값 — 앱에서 읽음)
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=1440,VH=900,DSF=1.25,PORT=8897;
/* 예제 A = 업무시설 AHU-1 급기 주덕트 — 사각 · 급기 주덕트 · 1.0 Pa/m · 아연도금강판 · 고정 λ · 저압 · 4:1 · 12,000 m³/h
   예제 B = 급기 분기 원형덕트 1,500 m³/h (그 외 A와 같음)
   예제 C = 천장 속 높이 제약 — 사각 H 300 고정 · 8:1(보강조치 전제) · 12,000 m³/h
   다중 = 주덕트 12,000 · 분기 3,000(사각) · 분기 1,200(원형) / 정압 = AHU-1 급기 계통 12,000 m³/h · ESP 400 Pa */
const FREEZE=`(()=>{const T=new Date(2026,9,14,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear();['pwa-dismissed','pwa-banner-dismissed','pwa-welcome','duct-pwa-dismissed','mm-master-seen','duct-guide-seen'].forEach(k=>localStorage.setItem(k,'1'))}catch(e){}})()`;
const HIDE='#pwaBanner,.pwa-banner,#iosModal,.ios-modal,#toastEl,.toast,#netToast,.net-toast,.pwa-update-bar,#toast{display:none!important}.calc-col-right{position:static!important;max-height:none!important;overflow:visible!important}';
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__card=t=>{const h=[...document.querySelectorAll('.card-tit')].find(e=>__vis(e)&&e.textContent.trim().startsWith(t));return h?h.closest('.card'):null;};
window.__find=sel=>{if(sel.startsWith('card:'))return __card(sel.slice(5));
 if(sel.startsWith('up:')){const [a,b]=sel.slice(3).split('|');const e=[...document.querySelectorAll(a)].find(__vis);return e?e.closest(b):null;}
 if(sel.startsWith('nth:')){const [q,i]=sel.slice(4).split('|');return [...document.querySelectorAll(q)].filter(__vis)[+i]||null;}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__S=(o)=>{for(const [k,v] of Object.entries(o)){const e=document.getElementById(k);e.value=v;}};
window.__tab=i=>{document.querySelectorAll('.tab-bar-inner .tb')[i].click();};
window.__closeM=()=>{try{closeMasterModal();}catch(e){}const m=document.getElementById('masterModal');if(m){m.classList.remove('open','show','active');}};
window.__base={spaceType:'supply_main',frictionBase:'1.0',ductMaterial:'galv',lamMode:'fixed',flexComp:'1.0',pressClass:'low',arLimit:'4',fixW:'',fixH:'',fixD:''};
window.__run=(dt,o)=>{selectDtype(document.querySelector('[data-dtype="'+dt+'"]'));__S(Object.assign({},__base,o));calcDuct();};
window.__F={
 A:()=>__run('rect',{flowInput:12000}),
 B:()=>__run('circ',{spaceType:'supply_branch',flowInput:1500}),
 C:()=>__run('rect',{arLimit:'8',fixH:300,flowInput:12000}),
};
window.__quiet=f=>{const si=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(){};try{f();}finally{setTimeout(()=>{Element.prototype.scrollIntoView=si;},300);}};
window.__multi=()=>{const mi=document.getElementById('multiItems');mi.innerHTML='';multiCount=0;addMultiItem();addMultiItem();addMultiItem();
 const D=[['AHU-1 급기 주덕트','rect','supply_main',12000],['3층 급기 분기','rect','supply_branch',3000],['회의실 급기 분기','circ','supply_branch',1200]];
 D.forEach((d,i)=>{const id='mi_'+(i+1);__S({[id+'_name']:d[0],[id+'_dtype']:d[1],[id+'_space']:d[2],[id+'_flow']:d[3],[id+'_fr']:1.0});});calcMulti();};
window.__sp=()=>{spReset();__S({sp_name:'AHU-1 급기 계통',sp_flow:12000,sp_esp:400});
 spAddSeg();spAddSeg();
 __S({sps_1_name:'주덕트 800×600',sps_1_dtype:'rect',sps_1_mat:'galv'});spSegShape('sps_1');__S({sps_1_w:800,sps_1_h:600,sps_1_len:40});
 __S({sps_2_name:'외기 도입 1000×600',sps_2_dtype:'rect',sps_2_mat:'galv'});spSegShape('sps_2');__S({sps_2_w:1000,sps_2_h:600,sps_2_len:6});
 spRefreshFitSegs();
 const F=[['elbow_rv',4,'sps_1'],['tee_main',3,'sps_1'],['vd',1,'sps_1'],['fd',2,'sps_1'],['hood',1,'sps_2'],['fixed',1,'sps_1',30,'취출구(제조사 값)']];
 F.forEach((f,i)=>{spAddFit();const id='spf_'+(i+1);__S({[id+'_type']:f[0],[id+'_n']:f[1]});spFitType(id);spRefreshFitSegs();document.getElementById(id+'_seg').value=f[2];if(f[3])__S({[id+'_pa']:f[3],[id+'_memo']:f[4]});});
 spCalc();};
window.__A=()=>__quiet(()=>{__closeM();resetAll();__tab(0);__S({projName:'만민 건축사 사옥 신축공사',projDate:'2026-10-14',projAuthor:'김만민'});updateStep(1);__F.A();window.scrollTo(0,0);});
window.__show=k=>__quiet(()=>{__tab(0);__F[k]();window.scrollTo(0,0);});
window.__ex=()=>{const r=state.result;if(!r)return null;const body=document.getElementById('resultBody').innerText;
 return {W:r.W||null,H:r.H||null,D:r.D||null,A:+r.A.toFixed(6),Dh:+r.Dh.toFixed(3),V:+r.V.toFixed(4),Fr:+r.Fr.toFixed(4),ar:r.ar?+r.ar.toFixed(3):null,lam:+((r.lam!==undefined?r.lam:LAMBDA[state.material])).toFixed(5),Re:r.Re?Math.round(r.Re):null,th:String(r.thickness),thNote:thkNote(state.material),
  vStd:[r.velStd.min,r.velStd.max],vLegal:vLegal(),legalOver:r.V>vLegal(),arWarn:body.includes('보강조치'),free:!!r.freeCalc,
  sum:[...document.querySelectorAll('.sum-bar .sum-item')].map(e=>e.textContent.trim())};};
window.__exM=()=>(state.multiResults||[]).map(r=>({name:r.name,size:r.dtype==='circ'?('Φ'+r.D):(r.W+'×'+r.H),V:+r.V.toFixed(3),Fr:+r.Fr.toFixed(3),th:String(r.thickness),ok:r.V>=r.velStd.min&&r.V<=r.velStd.max}));
window.__exS=()=>{const t=document.getElementById('spResult').innerText.replace(/\\s+/g,' ');return {text:t.slice(0,1600),res:spState.res?JSON.parse(JSON.stringify(spState.res)):null};};`;
const SHOTS=[
 {id:'s01_overview',pre:"__A()",clip:'viewport',m:[['.tab-bar-inner','작업 탭'],['.sum-bar','요약 스트립'],['.step-bar','진행 단계'],['card:STEP 1','공사 정보'],['card:STEP 2','덕트 조건'],['card:STEP 3','풍량 입력'],['card:STEP 4','산정 결과'],['#fab-group','초기화 · 설계기준']]},
 {id:'s02_tabs',clip:'.hdr-shell',m:[['nth:.tab-bar-inner .tb|0','단일 덕트 산정'],['nth:.tab-bar-inner .tb|1','다중 덕트 산정'],['nth:.tab-bar-inner .tb|2','정압 계산'],['nth:.tab-bar-inner .tb|3','설계 기준표'],['nth:.tab-bar-inner .tb|4','A4 미리보기'],['.tb-manual','매뉴얼'],['.hdr-right','근거 기준']]},
 {id:'s03_step2',clip:'card:STEP 2',m:[['.dtype-grid,.dtype-cards,up:.dtype-card|div','① 덕트 형상'],['up:#spaceType|.fgrp','② 설치 장소'],['up:#frictionBase|.fgrp','③ 마찰손실 기준'],['up:#ductMaterial|.fgrp','④ 덕트 재질'],['up:#lamMode|.fgrp','⑤ λ 산정 방식'],['up:#flexComp|.fgrp','⑥ 플렉시블 압축률'],['up:#arLimit|.fgrp','⑦ 장단비 제한'],['up:#pressClass|.fgrp','⑧ 압력 구분'],['up:#velStdText|.nb','설계 권장 풍속']]},
 {id:'s04_step3',clip:'card:STEP 3',m:[['.seg-ctrl','① 풍량 단위'],['up:#flowInput|.input-sfx','② 풍량'],['#convBox','③ 단위 환산'],['nth:.btn-g|0','④ 빠른 선택'],['#fixDimBox','⑤ 치수 제한(선택)']]},
 {id:'s05_result',clip:'card:STEP 4',m:[['.duct-result-hero','채택 규격 · 실제 풍속'],['.vel-gauge','풍속 게이지'],['.stat-grid','풍량 · 단면적 · 수력직경'],['nth:#resultBody .cbox|0','산정 상세'],['nth:#resultBody .rtbl|0','인접 규격 비교']]},
 {id:'s06_result_b',pre:"__show('B')",clip:'card:STEP 4',m:[['.duct-result-hero','Φ 채택 · 풍속'],['nth:#resultBody .cbox|0','산정 상세']]},
 {id:'s07_result_c',pre:"__show('C')",clip:'card:STEP 4',m:[['.duct-result-hero','1800×300 · 풍속'],['nth:#resultBody .cbox|0','판두께 1.0 · 법정 상한'],['nth:#resultBody .rtbl|0','인접 규격'],['nth:#resultBody .nb.org|0','장단비 4:1 초과 — 보강조치']]},
 {id:'s08_multi',pre:"__quiet(()=>{__show('A');__tab(1);__multi();scrollTo(0,0);})",wait:900,clip:'#tab-multi',m:[['#multiItems','구간 입력'],['.add-item-btn','구간 추가'],['nth:#tab-multi .btn-b|0','일괄 산정'],['card:일괄 산정 결과','일괄 산정 결과']]},
 {id:'s09_sp',pre:"__quiet(()=>{__tab(2);__sp();scrollTo(0,0);})",wait:900,clip:'#tab-sp',crop:1150,m:[['card:계통 조건','계통 조건 · ESP'],['card:직관 구간','직관 구간'],['card:피팅','피팅 · ζ'],['card:정압 계산 결과','정압 계산 결과']]},
 {id:'s10_guide_vel',pre:"__tab(3);switchGmTab('g-vel',document.querySelectorAll('.gm-tab')[0]);scrollTo(0,0)",wait:700,clip:'card:덕트 설계 기준표',m:[['nth:.gm-tab|0','기준표 5종'],['nth:#g-vel .nb|0','법정 상한 · 루버'],['nth:#g-vel .rtbl|0','설계 권장 풍속']]},
 {id:'s11_guide_th',pre:"switchGmTab('g-material',document.querySelectorAll('.gm-tab')[4]);scrollTo(0,0)",wait:700,clip:'card:덕트 설계 기준표',m:[['nth:#g-material .rtbl|0','사각 판두께(표 2)'],['nth:#g-material .nb.sky|0','스파이럴(표 4)'],['nth:#g-material .ref-box|0','보강 기준(참고)']]},
 {id:'s12_modal',pre:"__tab(0);openMasterModal(1)",wait:900,fixed:true,post:"__closeM()",clip:'.master-modal-box',m:[]},
 {id:'s13_a4',pre:"__A();__tab(4);scrollTo(0,0)",wait:1500,clip:'viewport',m:[['.mm-btn-print','인쇄 / PDF'],['.mm-btn-jpg','JPG 저장'],['#a4Page','A4 산정서']]},
 {id:'s14_a4page',clip:'#a4Page',crop:2400,m:[['nth:.a4-meta-table|0','산정 결과표'],['nth:#a4Page .a4-meta-table|1','인접 규격']]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(2500);
 await pg.addStyleTag({content:HIDE});
 await pg.evaluate(HELP);await pg.evaluate('__closeM()');
 const ex={};const meta={};
 for(const S of SHOTS){
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||600);
  await pg.evaluate(v=>{const f=document.getElementById('fab-group');if(f)f.style.visibility=v?'':'hidden';},S.clip==='viewport');
  if(S.id==='s01_overview')ex.A=await pg.evaluate('__ex()');
  if(S.id==='s06_result_b')ex.B=await pg.evaluate('__ex()');
  if(S.id==='s07_result_c')ex.C=await pg.evaluate('__ex()');
  if(S.id==='s08_multi')ex.M=await pg.evaluate('__exM()');
  if(S.id==='s09_sp')ex.SP=await pg.evaluate('__exS()');
  if(S.id==='s14_a4page')ex.A_a4=await pg.evaluate(()=>document.getElementById('a4Page').innerText.replace(/\s+/g,' '));
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     if(S.union){const e2=__find(S.union);if(e2){const a2=abs(e2);const x0=Math.min(clip.x,a2.x),y0=Math.min(clip.y,a2.y),x1=Math.max(clip.x+clip.width,a2.x+a2.w),y1=Math.max(clip.y+clip.height,a2.y+a2.h);clip={x:x0,y:y0,width:x1-x0,height:y1-y0};}}
     const P=12;clip={x:Math.max(0,clip.x-P),y:Math.max(0,clip.y-P),width:clip.width+2*P,height:clip.height+2*P};
     if(S.crop&&clip.height>S.crop)clip.height=S.crop;}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=__find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(Math.min(a.w,clip.x+clip.width-a.x)/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW-Math.max(0,c.x)),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:Math.max(0,c.x-sx),y:Math.max(0,c.y-sy),width:Math.min(c.width,VW),height:Math.min(c.height,VH-Math.max(0,c.y-sy))}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(Math.min(cl.height,S.fixed?VH:1e9)),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(400);}
 }
 await pg.evaluate('__A()');await pg.waitForTimeout(500);ex.after=await pg.evaluate('__ex()');
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(2500);
 await mp.addStyleTag({content:HIDE});await mp.evaluate(HELP);await mp.evaluate('__A()');await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s15_mobile_main.png')});meta['s15_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{const e=__card('STEP 4');const y=e.getBoundingClientRect().top+window.scrollY-12;window.scrollTo(0,y);document.scrollingElement.scrollTop=y;});await mp.waitForTimeout(1200);
 await mp.screenshot({path:path.join(out,'s16_mobile_result.png')});meta['s16_mobile_result']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{__tab(4);window.scrollTo(0,0);});await mp.waitForTimeout(1200);
 await mp.screenshot({path:path.join(out,'s17_mobile_a4.png')});meta['s17_mobile_a4']={w:390,h:844,marks:[]};
 ex.mobile=await mp.evaluate(()=>({page:document.documentElement.scrollWidth,tabbar:document.querySelector('.tab-bar-inner').scrollWidth,vw:innerWidth,tabRows:new Set([...document.querySelectorAll('.tab-bar-inner .tb')].map(e=>Math.round(e.getBoundingClientRect().top))).size}));
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify(ex,null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5||m.w<=0||m.h<=0)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 const strip=o=>JSON.stringify(o);
 const sh=o=>o&&[o.W?o.W+'x'+o.H:'Φ'+o.D,o.V,o.Fr,o.th,o.thNote,o.arWarn,o.legalOver];
 console.log(JSON.stringify({A:sh(ex.A),B:sh(ex.B),C:sh(ex.C),M:ex.M,SP:ex.SP&&ex.SP.text.slice(0,300),same:strip(ex.A)===strip(ex.after),mobile:ex.mobile,sizes:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();

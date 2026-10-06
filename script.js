const views=['hjem','om-oss','tjenester','kontakt'];
const nav=document.getElementById('nav'),burger=document.getElementById('burger');
function route(){
  let h=(location.hash||'#hjem').slice(1);
  if(!views.includes(h))h='hjem';
  views.forEach(v=>document.getElementById('v-'+v).classList.toggle('on',v===h));
  nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.v===h));
  nav.classList.remove('open');burger.setAttribute('aria-expanded','false');
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);route();
burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
document.querySelectorAll('.acc button').forEach(b=>b.addEventListener('click',()=>{
  const p=b.nextElementSibling,o=p.classList.toggle('open');
  b.setAttribute('aria-expanded',o);b.querySelector('span').textContent=o?'−':'+';
}));
document.getElementById('copy').addEventListener('click',e=>{
  const b=e.currentTarget;
  (navigator.clipboard?navigator.clipboard.writeText('30114'):Promise.reject()).then(()=>{b.textContent='Kopiert!'},()=>{b.textContent='Nummer: 30114'});
  setTimeout(()=>b.textContent='Kopier nummer',2000);
});

const DATA_DATE='2026-10-06';
const PT=[['Fajr','الفجر','5:56','6:06','5:58'],['Dhuhr','الظهر','13:10','14:00','13:10'],['Asr','العصر','15:48','15:58','15:46'],['Maghrib','المغرب','18:39','18:44','18:36'],['Isha','العشاء','19:57','20:07','19:54']];
const EX=[['Shurooq','الشروق','7:33','-','7:36'],["Jumu'ah",'جمعة','14:00','14:30','']];
function oslo(){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return{date:p.year+'-'+p.month+'-'+p.day,s:(+p.hour)*3600+(+p.minute)*60+(+p.second),hm:p.hour+':'+p.minute}}
const sec=t=>{const[a,b]=t.split(':');return a*3600+ +b*60};
function row(r,cls){return '<tr class="'+(cls||'')+'"><td>'+r[0]+'</td><td class="ar">'+r[1]+'</td><td class="t">'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td></tr>'}
function tick(){
  const n=oslo();let idx=PT.findIndex(r=>sec(r[2])>n.s),left;
  if(idx<0){idx=0;left=86400-n.s+sec(PT[0][4])}else left=sec(PT[idx][2])-n.s;
  document.getElementById('nn').textContent=PT[idx][0]+' '+PT[idx][1];
  const h=Math.floor(left/3600),m=Math.floor(left%3600/60),s=left%60,z=x=>String(x).padStart(2,'0');
  document.getElementById('cd').textContent=z(h)+':'+z(m)+':'+z(s);
  document.getElementById('clk').textContent='Klokka n\u00e5: '+n.hm;
  document.getElementById('pt').innerHTML=PT.map((r,i)=>row(r,i===idx?'nx':'')).join('')+EX.map((r,i)=>row(r,i===0?'sep':'')).join('');
  if(n.date!==DATA_DATE)document.getElementById('pnote').innerHTML='Obs: tidene er fra '+DATA_DATE+' og kan v\u00e6re litt feil i dag. <a href="https://www.my-masjid.com" target="_blank" rel="noopener">Se MyMasjid for riktige tider.</a>';
}
tick();setInterval(tick,1000);

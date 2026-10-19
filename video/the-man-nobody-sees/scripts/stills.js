const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const [html,out,...ts]=process.argv.slice(2);
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:1080,height:1920}});
 page.on('pageerror',e=>console.error('PAGEERR',e.message)); page.on('console',m=>{if(m.type()==='error')console.error('CONSOLE',m.text())});
 await page.goto('file://'+path.resolve(html)+(process.env.ALT?'?alt=1':'')); await page.evaluate(()=>document.fonts.ready);
 for(const t of ts){ await page.evaluate(t=>window.renderAt(t),+t); await page.screenshot({path:`${out}/t_${(+t).toFixed(2)}.png`,omitBackground:true}); }
 await browser.close(); })().catch(e=>{console.error(e);process.exit(1)});

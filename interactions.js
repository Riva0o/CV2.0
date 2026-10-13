// Ambient interactions: native scroll, canvas mist and elastic SVG dividers.
export function initAtmosphere(root) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const controller = new AbortController();
  const options = {passive:true, signal:controller.signal};
  const cleanup = [];
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const stage = root.querySelector('.immersive');
  const story = root.querySelector('.studio-story');
  let scrollFrame=0;
  const updateStory=()=>{
    scrollFrame=0;
    if(!story)return;
    const r=story.getBoundingClientRect();
    const progress=clamp(-r.top/Math.max(1,r.height-innerHeight));
    story.style.setProperty('--story-progress',progress);
    story.querySelectorAll('.story-lines p').forEach((p,i)=>{
      const amount=reduced.matches?1:clamp((progress-i*.25)/.24);
      p.style.opacity=String(.17+.83*amount);
      p.style.transform=`translateY(${reduced.matches?0:(1-amount)*10}px)`;
    });
  };
  const scheduleStory=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateStory);};
  window.addEventListener('scroll',scheduleStory,options);
  window.addEventListener('resize',scheduleStory,options);
  updateStory();cleanup.push(()=>cancelAnimationFrame(scrollFrame));
  if(stage){
    const canvas=stage.querySelector('canvas');
    const ctx=canvas.getContext('2d');
    const toggle=stage.querySelector('.reveal-toggle');
    const img=stage.querySelector('img');
    img.addEventListener('error',()=>{canvas.hidden=true;stage.classList.add('relief-unavailable');toggle.hidden=true;stage.querySelector('.mist-hint').textContent='浮雕背景暂时无法加载';},{once:true,signal:controller.signal});
    if(ctx){
      let width=0,height=0,raf=0,last=0,lastInput=0,visible=true,revealed=false,previous=null;
      const size=()=>{
        const rect=stage.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.5);
        width=rect.width;height=rect.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
        ctx.globalCompositeOperation='source-over';ctx.fillStyle='#f3f2ec';ctx.fillRect(0,0,width,height);
        canvas.style.opacity=revealed?'0':'1';
      };
      const dab=(x,y,radius)=>{
        const g=ctx.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,'rgba(0,0,0,.36)');g.addColorStop(.38,'rgba(0,0,0,.30)');g.addColorStop(.72,'rgba(0,0,0,.12)');g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
      };
      const paint=e=>{
        if(reduced.matches||revealed||!visible)return;
        const rect=stage.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
        if(x<0||y<0||x>width||y>height){previous=null;return;}
        const radius=Math.min(190,Math.max(100,width*.105));
        ctx.globalCompositeOperation='destination-out';
        if(previous){const length=Math.hypot(x-previous.x,y-previous.y),steps=Math.min(28,Math.max(1,Math.ceil(length/16)));for(let i=1;i<=steps;i++)dab(previous.x+(x-previous.x)*i/steps,previous.y+(y-previous.y)*i/steps,radius);}else dab(x,y,radius);
        ctx.globalCompositeOperation='source-over';previous={x,y};lastInput=performance.now();wake();
      };
      const animate=time=>{
        raf=0;if(!visible||revealed||reduced.matches)return;
        const dt=Math.min(60,time-(last||time));last=time;
        ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(243,242,236,${1-Math.exp(-dt/3300)})`;ctx.fillRect(0,0,width,height);
        if(time-lastInput<14000)raf=requestAnimationFrame(animate);
      };
      const wake=()=>{if(!raf){last=0;raf=requestAnimationFrame(animate);}};
      const resetPointer=()=>{previous=null;};
      stage.addEventListener('pointermove',paint,options);
      stage.addEventListener('pointerdown',paint,options);
      stage.addEventListener('pointerleave',resetPointer,options);
      stage.addEventListener('pointerup',resetPointer,options);
      toggle.addEventListener('click',()=>{revealed=!revealed;toggle.setAttribute('aria-pressed',String(revealed));toggle.textContent=revealed?'恢复雾气 −':'揭开浮雕 ＋';size();},{signal:controller.signal});
      const onPreference=()=>{revealed=reduced.matches;toggle.setAttribute('aria-pressed',String(revealed));toggle.textContent=revealed?'恢复雾气 −':'揭开浮雕 ＋';size();};
      reduced.addEventListener('change',onPreference,{signal:controller.signal});
      const ro=new ResizeObserver(size);ro.observe(stage);cleanup.push(()=>ro.disconnect());
      const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;previous=null;}else if(performance.now()-lastInput<14000)wake();});io.observe(stage);cleanup.push(()=>io.disconnect());
      if(reduced.matches)revealed=true;size();onPreference();cleanup.push(()=>cancelAnimationFrame(raf));
    }
  }
  // Preserve markup and text order; only short text receives individual hover units.
  root.querySelectorAll('h1,h2,h3,h4,.story-lines p,.hero-signature').forEach(el=>{
    if(el.classList.contains('type-interactive'))return;
    el.classList.add('type-interactive');
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      const units=node.textContent.match(/[\p{Script=Han}]|[^\p{Script=Han}\s]+|\s+/gu)||[];
      units.forEach(unit=>{
        if(/^\s+$/.test(unit)){fragment.append(document.createTextNode(unit));return;}
        const span=document.createElement('span');span.className='type-glyph';span.textContent=unit;fragment.append(span);
      });
      node.replaceWith(fragment);
    });
  });
  // Each divider reacts to crossing, bends towards the pointer, then rings down.
  const strings=[];
  const ns='http://www.w3.org/2000/svg';
  root.querySelectorAll('.section-heading,.next-project,.contact-bottom,.discipline,.cv-row,.cv-group>h3,.detail-top').forEach(host=>{
    const bottom=host.matches('.cv-row,.cv-group>h3,.detail-top');
    host.classList.add(bottom?'has-string-bottom':'has-string');const svg=document.createElementNS(ns,'svg');svg.classList.add('string-line');if(bottom)svg.classList.add('string-line-bottom');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(ns,'path');svg.append(path);host.prepend(svg);
    const state={svg,path,width:1,at:.5,offset:0,velocity:0,grab:false,previous:null};strings.push(state);
    const resize=()=>{state.width=svg.getBoundingClientRect().width;svg.setAttribute('viewBox',`0 0 ${state.width} 64`);draw(state);};
    const ro=new ResizeObserver(resize);ro.observe(svg);resize();cleanup.push(()=>ro.disconnect());
  });
  function draw(s){const w=s.width,x=clamp(s.at,1,w-1),y=32+s.offset; s.path.setAttribute('d',`M0 32 C${x*.5} 32 ${x*.5} ${y} ${x} ${y} C${x+(w-x)*.5} ${y} ${x+(w-x)*.5} 32 ${w} 32`);}
  let lineFrame=0,lineTime=0;
  const tick=time=>{lineFrame=0;let moving=false;const dt=Math.min((time-(lineTime||time))/1000,.035);lineTime=time;for(const s of strings){if(s.grab)continue;if(Math.abs(s.offset)<.025&&Math.abs(s.velocity)<.025){s.offset=0;s.velocity=0;draw(s);continue;}s.velocity+=(-210*s.offset-15*s.velocity)*dt;s.offset+=s.velocity*dt;draw(s);moving=true;}if(moving)lineFrame=requestAnimationFrame(tick);};
  const wakeLines=()=>{if(!lineFrame){lineTime=0;lineFrame=requestAnimationFrame(tick);}};
  const release=s=>{if(!s.grab)return;s.grab=false;s.velocity+=s.offset*8;wakeLines();};
  window.addEventListener('pointermove',e=>{
    if(!fine.matches||reduced.matches||e.pointerType==='touch')return;
    strings.forEach(s=>{
      const rect=s.svg.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight){s.previous=null;release(s);return;}
      const x=e.clientX-rect.left,y=e.clientY-(rect.top+32),inside=x>0&&x<s.width;
      if(s.grab){if(!inside||Math.abs(y)>14||y*s.offset<0){release(s);}else{s.offset=y;s.at=x;draw(s);}}
      else if(inside&&s.previous!==null&&(s.previous<=0&&y>0||s.previous>=0&&y<0)&&Math.abs(y-s.previous)<160){s.at=x;s.offset=clamp(y,-14,14);s.grab=Math.abs(y)<14;if(!s.grab){s.velocity=s.offset*9;wakeLines();}draw(s);}
      s.previous=y;
    });
  },options);
  document.documentElement.addEventListener('pointerleave',()=>strings.forEach(s=>{s.previous=null;release(s);}),options);
  cleanup.push(()=>cancelAnimationFrame(lineFrame));
  root.querySelectorAll('.project-visual,.experiment-grid article').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--hover-x',`${(e.clientX-r.left)/r.width*100}%`);el.style.setProperty('--hover-y',`${(e.clientY-r.top)/r.height*100}%`);el.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-2}deg`);el.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*2}deg`);},options);
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');},options);
  });
  return ()=>{controller.abort();cleanup.forEach(fn=>fn());};
}

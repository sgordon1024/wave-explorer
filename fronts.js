// Dimensionless display geometry. Physical readouts remain in SI in app.js.
export const DISPLAY_SPEED = 1.2;
export const displayFrequency = logF => .8 + (logF - 6) / 15 * .7;
export const frontSpacing = frequency => DISPLAY_SPEED / frequency;
export function frontRadii(time, frequency, maxRadius = 3.5) {
  const spacing = frontSpacing(frequency);
  const offset = ((DISPLAY_SPEED * time % spacing) + spacing) % spacing;
  const radii = [];
  for (let r = offset; r <= maxRadius; r += spacing) if (r > .06) radii.push(r);
  return radii;
}
export const fieldAt = (x, time, frequency) => Math.sin(2 * Math.PI * frequency * (x / DISPLAY_SPEED - time));

export function drawFronts({ctx,project,line,arrow,width,height,zoom,mode,time,frequency,electric,magnetic}) {
  const label = (text,p,color='#b4c8d0',dx=8,dy=-10) => {
    const q=project(...p);ctx.font='11px system-ui';ctx.fillStyle=color;ctx.fillText(text,q[0]+dx,q[1]+dy);
  };
  const dot=(p,color,r=3)=>{const q=project(...p);ctx.beginPath();ctx.arc(q[0],q[1],r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
  const polygon=(points,color)=>{ctx.beginPath();points.forEach((p,i)=>{const q=project(...p);i?ctx.lineTo(...q):ctx.moveTo(...q);});ctx.closePath();ctx.fillStyle=color;ctx.fill();};
  if(mode==='spread') {
    // The y=0 reference plane makes the 3D fronts' circular sections visible.
    polygon([[-3.8,0,-3.8],[-3.8,0,3.8],[3.8,0,3.8],[3.8,0,-3.8]],'#314c5928');
    for(let i=-3;i<=3;i++){line([[-3.5,0,i],[3.5,0,i]],'#38535f55');line([[i,0,-3.5],[i,0,3.5]],'#38535f55');}
    for(const r of frontRadii(time,frequency).reverse()) {
      const fade=Math.min(1,(3.65-r)*1.5);
      // Transparent globe guides: circles on each spherical phase surface.
      const alpha=Math.round(100*fade).toString(16).padStart(2,'0');
      for(const latitude of [-.6,0,.6]) {
        const ring=Array.from({length:81},(_,i)=>{const a=i/80*Math.PI*2;const rr=r*Math.sqrt(1-latitude**2);return [rr*Math.cos(a),r*latitude,rr*Math.sin(a)];});
        line(ring,latitude===0?'#98f1cf'+Math.round(195*fade).toString(16).padStart(2,'0'):'#98f1cf'+alpha,latitude===0?1.7:1);
      }
      for(const longitude of [0,Math.PI/3,2*Math.PI/3]) {
        const ring=Array.from({length:81},(_,i)=>{const a=i/80*Math.PI*2;return [r*Math.cos(a)*Math.cos(longitude),r*Math.sin(a),r*Math.cos(a)*Math.sin(longitude)];});
        line(ring,'#98f1cf'+alpha,1);
      }
    }
    for(const direction of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])arrow(direction.map(v=>v*2.5),direction.map(v=>v*3.65),'#d6e8ed88');
    dot([0,0,0],'#ffcb92',6);label('source',[0,0,0],'#ffcb92');
    label('reference plane',[1.8,0,3.5],'#8aaab6',-25,20);
    return;
  }
  // A finite drawing window through an ideal plane wave, not a beam or tube.
  const lo=-3.4,hi=3.4;
  for(const y of [-1.4,1.4])for(const z of [-1.4,1.4])line([[lo,y,z],[hi,y,z]],'#47616b66');
  const spacing=frontSpacing(frequency),offset=((DISPLAY_SPEED*time%spacing)+spacing)%spacing;
  for(let x=lo+offset;x<=hi;x+=spacing){
    const plane=[[x,-1.4,-1.4],[x,1.4,-1.4],[x,1.4,1.4],[x,-1.4,1.4]];
    polygon(plane,'#98f1cf0b');line([...plane,plane[0]],'#98f1cf44');
  }
  for(const x of [-2.4,0,2.4])for(const y of [-.8,.8])for(const z of [-.8,.8]){
    const v=.55*fieldAt(x,time,frequency),p=[x,y,z];dot(p,'#708d98',2);
    if(electric)arrow(p,[x,y+v,z],'#98f1cfbb');
    if(magnetic)arrow(p,[x,y,z+v],'#ffb183bb');
  }
  const v=.55*fieldAt(0,time,frequency);dot([0,0,0],'#fff',4);
  if(electric)arrow([0,0,0],[0,v,0],'#98f1cf');
  if(magnetic)arrow([0,0,0],[0,0,v],'#ffb183');
  label('fixed probe',[0,0,0],'#fff',8,18);
  arrow([lo,-1.9,0],[hi,-1.9,0],'#d6e8ed');label('propagation',[1,-1.9,0],'#b4c8d0',0,20);
}

import {C,physics,units} from './app.js';
function close(a,b){if(Math.abs(a/b-1)>1e-8)throw new Error(`${a} != ${b}`)}
close(physics(1e8).wavelength,2.99792458);close(physics(2.45e9).wavelength,.12236426857142857);close(physics(C/550e-9).wavelength,550e-9);close(physics(2e8).wavelength,physics(1e8).wavelength/2);close(physics(2e8).energy,physics(1e8).energy*2);
for(let n=6;n<=21;n+=.125){const p=physics(10**n);close(p.wavelength*10**n,C);if(!(p.energy>0))throw Error('energy');for(const [v,k] of [[10**n,'frequency'],[p.wavelength,'length'],[p.energy,'energy']])if(/NaN|undefined/.test(units(v,k)))throw Error('format');}
console.log('PASS: vacuum relation, FM, microwave, visible, photon-energy doubling, and formats across 121 spectrum points');
import {spectralRGB,mixDescription,wavePath} from './color.js';
close(physics(C/(700e-9)).wavelength/physics(C/(400e-9)).wavelength,1.75);
close(physics(C/(400e-9)).energy/physics(C/(700e-9)).energy,1.75);
for(const nm of [400,450,550,580,700]){if(spectralRGB(nm).some(v=>v<0||v>255||!Number.isFinite(v)))throw Error('invalid spectral swatch');if(/NaN/.test(wavePath(nm,700)))throw Error('invalid wave');}
if(spectralRGB(580).join()!=='255,255,0')throw Error('yellow representation');
for(const [v,name] of [[[100,100,0],'Yellow mix'],[[100,0,100],'Magenta mix'],[[100,100,100],'White mix'],[[0,0,0],'Black'],[[50,50,50],'Neutral gray']]){if(mixDescription(v)[0]!==name)throw Error('mix description');}
// A complete wavelength of travel returns the local field to the same shape.
if(wavePath(550,0)!==wavePath(550,550))throw Error('field periodicity');
console.log('PASS: visible frequency/energy ratios, spectral colors, RGB states, and fixed-scale wave periodicity');
import {DISPLAY_SPEED,frontSpacing,frontRadii,fieldAt} from './fronts.js';
close(frontSpacing(1)/frontSpacing(2),2);
const a=frontRadii(.2,1),b=frontRadii(.3,1);close(b[0]-a[0],DISPLAY_SPEED*.1);
const d=frontRadii(.2,2),e=frontRadii(.3,2);close(e[0]-d[0],DISPLAY_SPEED*.1);
for(let i=1;i<a.length;i++)close(a[i]-a[i-1],frontSpacing(1));
close(fieldAt(.23,.17,1),fieldAt(.23+DISPLAY_SPEED*.1,.27,1));
console.log('PASS: frequency doubling halves phase-front spacing; front speed unchanged; plane-field phase travels at same speed');

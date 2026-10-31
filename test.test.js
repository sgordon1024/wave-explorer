import {C,physics,units} from './app.js';
function close(a,b){if(Math.abs(a/b-1)>1e-8)throw new Error(`${a} != ${b}`)}
close(physics(1e8).wavelength,2.99792458);close(physics(2.45e9).wavelength,.12236426857142857);close(physics(C/550e-9).wavelength,550e-9);close(physics(2e8).wavelength,physics(1e8).wavelength/2);close(physics(2e8).energy,physics(1e8).energy*2);
for(let n=6;n<=21;n+=.125){const p=physics(10**n);close(p.wavelength*10**n,C);if(!(p.energy>0))throw Error('energy');for(const [v,k] of [[10**n,'frequency'],[p.wavelength,'length'],[p.energy,'energy']])if(/NaN|undefined/.test(units(v,k)))throw Error('format');}
console.log('PASS: vacuum relation, FM, microwave, visible, photon-energy doubling, and formats across 121 spectrum points');

// Display approximations only: this interpolation is not a color-matching model.
const spectralStops = [
  [400, [110, 40, 255]], [450, [45, 70, 255]], [490, [0, 190, 255]],
  [530, [50, 230, 45]], [580, [255, 255, 0]], [610, [255, 140, 0]],
  [650, [255, 45, 25]], [700, [255, 30, 30]],
];
export function spectralRGB(nm) {
  const clamped = Math.max(400, Math.min(700, nm));
  const upper = spectralStops.findIndex(([w]) => w >= clamped);
  if (upper === 0) return [...spectralStops[0][1]];
  const [a, rgbA] = spectralStops[upper - 1];
  const [b, rgbB] = spectralStops[upper];
  return rgbA.map((v, i) => Math.round(v + (rgbB[i] - v) * (clamped - a) / (b - a)));
}
export function mixDescription([r, g, b]) {
  if (r === 0 && g === 0 && b === 0) return ['Black', 'Channels at zero', 'All screen channels are set to zero. In an ideal display that means no emitted light; actual black levels depend on the screen. Black is not a wavelength.'];
  if (r === g && g === b) return [r === 100 ? 'White mix' : 'Neutral gray', 'Red + green + blue', 'Balanced screen channels look white at full level, or gray at lower levels. White can come from many different spectra; it does not require every wavelength.'];
  if (r === g && r > 0 && b === 0) return ['Yellow mix', 'Red + green', 'Red and green light together can look yellow. They do not turn into a single yellow wavelength: both parts of the spectrum remain present.'];
  if (r === b && r > 0 && g === 0) return ['Magenta mix', 'Red + blue', 'Magenta has no single wavelength. It arises from a combination of cone signals that a lone spectral wavelength cannot produce. It is distinct from spectral violet.'];
  if (g === b && g > 0 && r === 0) return ['Cyan mix', 'Green + blue', 'Green and blue channels together produce cyan on this screen. This is a mixture of light, not a newly created intermediate frequency.'];
  const active = [r > 0 && 'red', g > 0 && 'green', b > 0 && 'blue'].filter(Boolean);
  return [active.length === 1 ? `${active[0][0].toUpperCase() + active[0].slice(1)} channel` : 'Your own mix', active.join(' + '), 'Changing the channel levels changes the combination reaching your eyes. These screen levels are not a measurement of cone activity, and each primary itself spans wavelengths.'];
}
export function wavePath(nm, travelNm = 0) {
  return Array.from({length:211}, (_, i) => {
    const x = i * 2;
    const y = 50 - 30 * Math.sin(2 * Math.PI * ((x / 420 * 1400 - travelNm) / nm));
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(2)}`;
  }).join(' ');
}
const cssRGB = rgb => `rgb(${rgb.join(',')})`;
const colorName = nm => nm >= 620 ? 'Red' : nm >= 590 ? 'Orange' : nm >= 565 ? 'Yellow' : nm >= 495 ? 'Green' : nm >= 475 ? 'Cyan / blue' : nm >= 440 ? 'Blue' : 'Violet';

export function setupColorExplorer({C, physics, units, selectFrequency, toggleMotion}) {
  const $ = id => document.getElementById(id);
  let nm = 550, source = 'spectral', travelNm = 0;
  const channels = ['r', 'g', 'b'];
  const shownNm = () => Number(nm.toFixed(1));
  const rgb = () => channels.map(c => Number($(`mix-${c}`).value));
  function updateSource() {
    const spectral = source === 'spectral';
    $('source-spectral').setAttribute('aria-pressed', String(spectral));
    $('source-mix').setAttribute('aria-pressed', String(!spectral));
    $('source-explanation').textContent = spectral
      ? `Imagine light concentrated at ${shownNm()} nm: one wavelength, ${(C / (nm * 1e-9) / 1e12).toFixed(1)} THz. The left swatch represents its approximate appearance using your screen’s RGB primaries. It is not actually emitting only that wavelength.`
      : `${mixDescription(rgb())[2]} The right swatch is an RGB mixture. Its components have their own spectra and photon energies; assigning the whole mix one wavelength or one photon energy would be misleading.`;
  }
  function renderSpectral() {
    const f = C / (nm * 1e-9);
    $('visible-wavelength').value = 700 - nm;
    $('visible-wavelength').setAttribute('aria-valuetext', `${shownNm()} nanometres, ${colorName(nm)}, ${(f / 1e12).toFixed(1)} terahertz`);
    $('wavelength-output').textContent = `${shownNm()} nm`;
    $('spectral-nm').textContent = `${shownNm()} nm`;
    $('spectral-name').textContent = colorName(nm);
    $('spectral-orb').style.setProperty('--swatch', cssRGB(spectralRGB(nm)));
    $('visible-f').textContent = units(f, 'frequency');
    $('visible-energy').textContent = units(physics(f).energy, 'energy');
    $('visible-wave-path').setAttribute('d', wavePath(nm, travelNm));
    updateSource();
  }
  function renderMix() {
    const values = rgb();
    channels.forEach((c, i) => {
      $(`mix-${c}-value`).textContent = `${values[i]}%`;
      $(`mix-${c}`).setAttribute('aria-valuetext', `${values[i]} percent screen channel level`);
      $(`channel-${c}`).style.transform = `scaleY(${values[i] / 100})`;
    });
    $('mix-orb').style.setProperty('--swatch', cssRGB(values.map(v => Math.round(v / 100 * 255))));
    const [name, formula, reading] = mixDescription(values);
    $('mix-name').textContent = name;
    $('mix-formula').textContent = formula;
    $('mix-reading').textContent = reading;
    updateSource();
  }
  function chooseWavelength(value) {
    nm = value;
    source = 'spectral';
    renderSpectral();
    selectFrequency(C / (nm * 1e-9));
  }
  $('visible-wavelength').oninput = () => chooseWavelength(700 - Number($('visible-wavelength').value));
  channels.forEach(c => $(`mix-${c}`).oninput = () => { source = 'mix'; renderMix(); });
  $('source-spectral').onclick = () => { source = 'spectral'; updateSource(); };
  $('source-mix').onclick = () => { source = 'mix'; updateSource(); };
  $('focus-visible').onclick = () => chooseWavelength(nm);
  $('color-motion').onclick = toggleMotion;
  function preset(name) {
    const values = name === 'magenta' ? [100, 0, 100] : name === 'white' ? [100, 100, 100] : [100, 100, 0];
    channels.forEach((c, i) => $(`mix-${c}`).value = values[i]);
    if (name === 'yellow') chooseWavelength(580);
    else source = 'mix';
    renderMix();
  }
  document.querySelectorAll('[data-color-preset]').forEach(button => button.onclick = () => preset(button.dataset.colorPreset));
  $('reset-color').onclick = () => {
    travelNm = 0;
    channels.forEach((c, i) => $(`mix-${c}`).value = [100, 100, 0][i]);
    chooseWavelength(550);
    renderMix();
  };
  renderSpectral();
  renderMix();
  return {
    sync(f) {
      const selectedNm = C / f * 1e9;
      if (selectedNm >= 399.999 && selectedNm <= 700.001) {
        nm = Math.max(400, Math.min(700, selectedNm));
        renderSpectral();
        $('visible-link').textContent = 'Linked to the 3D wave above. Both use this frequency; their display scales differ.';
      } else {
        $('visible-link').textContent = 'The 3D explorer is outside this 400–700 nm zoom. This visible study keeps its last wavelength; choose one here to reconnect.';
      }
    },
    animate(dt, paused) {
      if (!paused) travelNm += dt * 700;
      $('visible-wave-path').setAttribute('d', wavePath(nm, travelNm));
    },
    motion(paused) {
      $('color-motion').textContent = paused ? 'Play wave motion' : 'Pause wave motion';
    },
  };
}

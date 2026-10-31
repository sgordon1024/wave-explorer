# Wave / A field guide to light

A mobile-friendly, dependency-free electromagnetic spectrum explorer. Rotate a perspective-projected 3D field diagram, change frequency across 15 decades, compare seven presets, and explore wavelength and photon energy.

## Run

Serve this directory with any static HTTP server, e.g. `python3 -m http.server 8765`. Open http://localhost:8765. No build, backend, tracking, or external runtime assets.

Run physics checks with `bun test.test.js` or `node test.test.js`.

## Model

For propagation in +x, electric field Ey and magnetic field Bz share sin(kx−ωt). They are perpendicular, in phase, and independently normalized in the illustration (physical E = cB). The curves show fields along a line, not a photon trajectory. The display compresses log10(f) into 1–5 cycles and uses constant display phase velocity. Space and time scales vary across settings. It is a conceptual illustration, not a literal scale simulation.

Physical readouts use exact SI c = 299792458 m/s, h = 6.62607015e−34 J s, elementary charge = 1.602176634e−19 C. λ = c/f; energy in eV = hf/e. Spectrum boundaries are conventional, and gamma/X-ray naming also depends on origin.

## Controls & accessibility

- Drag: orbit. Pinch: zoom. Two-finger drag / shift-drag: pan.
- Focus the canvas: arrow keys orbit, +/− zoom. Reset view restores the camera.
- Standard keyboard-accessible range, presets, pause and field toggles.
- Reduced-motion preference starts the illustration paused; Play opts in.
- The explanatory text and readouts remain available outside the canvas.

## Scientific references

- [NASA spectrum guide](https://science.nasa.gov/ems/)
- [OpenStax: electromagnetic waves](https://openstax.org/books/college-physics-2e/pages/24-2-production-of-electromagnetic-waves)
- [FDA: microwave ovens](https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens)

Designed for static GitHub Pages hosting from the main branch root.

## Color perception lab

The `#color` section adds a 400–700 nm visible-spectrum zoom connected to the main explorer, a fixed 1,400 nm field window, and an independent RGB channel mixer. The local field translates at 700 nm per displayed second, corresponding to about 2.34 femtoseconds of physical time per display second. Both animations share pause and reduced-motion behavior.

Spectral colors are explicitly approximate display swatches interpolated between illustrative RGB anchors, not a color-matching-function calculation. RGB levels are screen channel code values, not cone responses or calibrated radiant power. Mixtures never receive a fictional average wavelength or photon energy. Source-selection buttons explain either a conceptual single-wavelength source or the RGB mixture; all actual screen patches use display primaries.

Additional sources: [Stockman & Rider (2023), cone sensitivities](https://doi.org/10.1002/col.22879), [CIE observer metamerism](https://cie.co.at/publications/special-metamerism-index-change-observer), [Physics Classroom color addition](https://www.physicsclassroom.com/class/light/Lesson-2/Color-Addition).

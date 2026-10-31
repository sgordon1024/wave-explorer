# Wave / A field guide to light

A mobile-friendly, dependency-free electromagnetic spectrum explorer. Rotate perspective-projected 3D wavefronts or a field-probe volume, change frequency across 15 decades, compare seven presets, and explore wavelength and photon energy.

## Run

Serve this directory with any static HTTP server, e.g. `python3 -m http.server 8765`. Open http://localhost:8765. No build, backend, tracking, or external runtime assets.

Run physics checks with `bun test.test.js` or `node test.test.js`.

## Model

The default “How it spreads” view draws spherical equal-phase surfaces expanding from an idealized point source. It is a geometric guide, not a claim of physically isotropic EM emission or a full antenna solution. The continuous field exists between fronts; they are not material shells, separate pulses, or photon trajectories. A reference plane and outward arrows make the 3D geometry explicit. No atmosphere is required.

“Fields at fixed points” shows a finite window through an ideal plane wave, with stationary probes throughout the volume. For propagation in +x, electric field Ey and magnetic field Bz share sin(kx−ωt). They are perpendicular, in phase, and independently normalized (physical E = cB). Every probe uses the same visual field scale; no string-like curve connects them. Translucent planes mark equal phase; the plane wave extends beyond the drawing window.

The full-spectrum display compresses log10(f) into 0.8–1.5 display Hz, with a constant propagation speed of 1.2 display distance units per second. “Compare: double frequency” doubles both physical frequency and the current displayed frequency while preserving display scales, so front spacing halves and cadence doubles. Restoring returns to the original selected frequency. The comparison is disabled if doubling would exceed the global slider range. Manual frequency changes exit the fixed-scale comparison. Setting changes redraw a steady-state pattern, not a time-dependent frequency switch at the source.

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

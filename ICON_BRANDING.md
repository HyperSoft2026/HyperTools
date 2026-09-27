# HyperTools Official Branding & Icon Specification

## Master Icon (Single Source of Truth)
- **Primary Master Icon Path:** `./hypertools-icon.png`
- **Official Raw GitHub Source:** `https://raw.githubusercontent.com/HyperSoft2026/HyperTools/main/hypertools-icon.png`

## Architecture & Policy
1. `./hypertools-icon.png` is the sole Master Icon / Single Source of Truth for HyperTools.
2. `public/assets/branding/hypertools-icon.png` is maintained as an exact byte-for-byte identical copy of `./hypertools-icon.png`.
3. All Android launcher resources (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`) across all densities (`mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`) are **GENERATED DERIVATIVES** strictly resized directly from `./hypertools-icon.png`.
4. No alternative artwork, placeholders, or legacy Capacitor assets are permitted in the codebase.

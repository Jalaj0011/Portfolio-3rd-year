# Jalaj Parmar — Portfolio

A stunning Three.js + Vite portfolio with interactive 3D scenes, floating particles, holographic photo effects, and smooth animations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open http://localhost:5173

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
jalaj-portfolio/
├── index.html          # Main HTML entry
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── public/
│   └── jalaj.jpg       # Your photo (replace with your image)
└── src/
    ├── main.js         # All Three.js scenes + animations
    └── style.css       # Full stylesheet
```

## ✨ Features

- **Three.js Background** — Animated 3D particle field with mouse parallax
- **Holographic Photo** — Orbiting rings and floating dots around your photo
- **3D Torus Knot** — Metallic sculpture in the About section
- **Unique Project Scenes** — Each project card has its own 3D object
- **Contact Vortex** — Rotating particle spiral in the contact section
- **Custom Cursor** — Smooth lagging ring cursor
- **Scroll Ticker** — Infinite scrolling tech stack marquee
- **Reveal Animations** — Smooth scroll-triggered fade-ins

## 🎨 Customization

Edit `index.html` to update your name, bio, projects, and contact info.
Edit `src/style.css` CSS variables at the top to change the color theme.
Replace `public/jalaj.jpg` with your own photo.

## 📦 Dependencies

- [Three.js](https://threejs.org/) — 3D WebGL rendering
- [Vite](https://vitejs.dev/) — Lightning-fast build tool

import * as THREE from 'three'
import './style.css'

// ===== CURSOR =====
const cursor = document.getElementById('cursor')
const ring = document.getElementById('cursorRing')
let mx = 0, my = 0, rx = 0, ry = 0
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
  requestAnimationFrame(animateCursor)
}
animateCursor()

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar')
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60)
})

// ===== REVEAL ON SCROLL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80)
    }
  })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el))


// ====================================================
// BG CANVAS — Floating particle field
// ====================================================
;(function() {
  const canvas = document.getElementById('bg-canvas')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6

  // Particles
  const count = 3000
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const palette = [
    [0.784, 0.941, 0.431],  // lime
    [0.431, 0.906, 0.941],  // cyan
    [1, 0.42, 0.208],       // orange
  ]
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*26
    pos[i*3+1] = (Math.random()-0.5)*22
    pos[i*3+2] = (Math.random()-0.5)*16
    const p = palette[Math.floor(Math.random() * palette.length)]
    col[i*3] = p[0]; col[i*3+1] = p[1]; col[i*3+2] = p[2]
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.5 })
  scene.add(new THREE.Points(geo, mat))

  // Thin grid lines
  const gridHelper = new THREE.GridHelper(30, 30, 0xc8f06e, 0xc8f06e)
  gridHelper.material.transparent = true; gridHelper.material.opacity = 0.025
  gridHelper.position.y = -6
  scene.add(gridHelper)

  // Subtle icosahedron accent
  const icoGeo = new THREE.IcosahedronGeometry(1.8, 1)
  const icoMat = new THREE.MeshBasicMaterial({ color: 0xc8f06e, wireframe: true, transparent: true, opacity: 0.04 })
  const ico = new THREE.Mesh(icoGeo, icoMat)
  ico.position.set(5, 1, -2)
  scene.add(ico)

  let mouseX = 0, mouseY = 0
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX/window.innerWidth - 0.5) * 2
    mouseY = -(e.clientY/window.innerHeight - 0.5) * 2
  })

  function tick() {
    requestAnimationFrame(tick)
    const t = Date.now() * 0.001
    // Breathe particles
    for (let i = 0; i < count; i++) {
      pos[i*3+1] += Math.sin(t*0.3 + i*0.01) * 0.00015
    }
    geo.attributes.position.needsUpdate = true
    ico.rotation.x = t * 0.15; ico.rotation.y = t * 0.22
    camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.04
    camera.position.y += (mouseY * 0.15 - camera.position.y) * 0.04
    camera.lookAt(scene.position)
    renderer.render(scene, camera)
  }
  tick()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
})()


// ====================================================
// PHOTO CANVAS — Orbiting rings overlay (circular)
// ====================================================
;(function() {
  const canvas = document.getElementById('photo-canvas')
  if (!canvas) return
  const frame = document.getElementById('photoFrame')
  if (!frame) return

  const size = 420
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(size, size)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50)
  camera.position.z = 4

  // Inner orbit ring
  const r1Geo = new THREE.TorusGeometry(1.55, 0.007, 8, 100)
  const r1Mat = new THREE.MeshBasicMaterial({ color: 0xc8f06e, transparent: true, opacity: 0.45 })
  const ring1 = new THREE.Mesh(r1Geo, r1Mat)
  ring1.rotation.x = Math.PI / 2.5
  scene.add(ring1)

  // Outer orbit ring
  const r2Geo = new THREE.TorusGeometry(1.85, 0.005, 8, 100)
  const r2Mat = new THREE.MeshBasicMaterial({ color: 0x6ee7f0, transparent: true, opacity: 0.25 })
  const ring2 = new THREE.Mesh(r2Geo, r2Mat)
  ring2.rotation.x = -Math.PI / 3
  ring2.rotation.z = Math.PI / 5
  scene.add(ring2)

  // Orbiting dot on ring1
  const dotGeo = new THREE.SphereGeometry(0.06, 8, 8)
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xc8f06e })
  const dot = new THREE.Mesh(dotGeo, dotMat)
  scene.add(dot)

  // Orbiting dot 2 on ring2
  const dot2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff6b35 })
  )
  scene.add(dot2)

  let hovered = false
  frame.addEventListener('mouseenter', () => hovered = true)
  frame.addEventListener('mouseleave', () => hovered = false)

  function tick() {
    requestAnimationFrame(tick)
    const t = Date.now() * 0.001

    ring1.rotation.y = t * 0.55
    ring2.rotation.y = -t * 0.38

    // Move dot along ring1 orbit
    const dotAngle = t * 0.9
    dot.position.set(
      Math.cos(dotAngle) * 1.55,
      Math.sin(dotAngle * 0.4) * 0.6,
      Math.sin(dotAngle) * 0.8
    )
    const dot2Angle = t * 0.6 + Math.PI
    dot2.position.set(
      Math.cos(dot2Angle) * 1.85 * 0.7,
      Math.sin(dot2Angle) * 1.85 * 0.5,
      Math.sin(dot2Angle * 0.8) * 0.6
    )

    renderer.render(scene, camera)
  }
  tick()
})()


// ====================================================
// ABOUT CANVAS — 3D Torus Knot
// ====================================================
;(function() {
  const canvas = document.getElementById('about-canvas')
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const w = canvas.parentElement.offsetWidth || 500
  const h = 400
  renderer.setSize(w, h)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 50)
  camera.position.z = 5

  const geo = new THREE.TorusKnotGeometry(1.3, 0.38, 140, 18)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xc8f06e, metalness: 0.85, roughness: 0.15,
    emissive: 0x2a3300, emissiveIntensity: 0.4
  })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  // Wire overlay
  const wMat = new THREE.MeshBasicMaterial({ color: 0x6ee7f0, wireframe: true, transparent: true, opacity: 0.12 })
  scene.add(new THREE.Mesh(geo, wMat))

  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  const pt1 = new THREE.PointLight(0xc8f06e, 3, 12)
  pt1.position.set(4, 4, 4); scene.add(pt1)
  const pt2 = new THREE.PointLight(0xff6b35, 2, 10)
  pt2.position.set(-4, -2, 3); scene.add(pt2)
  const pt3 = new THREE.PointLight(0x6ee7f0, 1.5, 8)
  pt3.position.set(0, -4, -2); scene.add(pt3)

  function tick() {
    requestAnimationFrame(tick)
    const t = Date.now() * 0.001
    mesh.rotation.x = t * 0.3
    mesh.rotation.y = t * 0.45
    renderer.render(scene, camera)
  }
  tick()
})()


// ====================================================
// PROJECT CANVASES — Unique 3D accent per project
// ====================================================
const projectColors = [
  [0xc8f06e, 0x6ee7f0],
  [0xff6b35, 0xc8f06e],
  [0x6ee7f0, 0xff6b35],
]

document.querySelectorAll('.project-canvas').forEach((canvas, index) => {
  const wrap = canvas.parentElement
  const w = wrap.offsetWidth || 280
  const h = 160
  canvas.width = w; canvas.height = h

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 50)
  camera.position.z = 3.5

  const colors = projectColors[index % projectColors.length]
  let mesh

  if (index === 0) {
    const geo = new THREE.OctahedronGeometry(0.8, 1)
    const mat = new THREE.MeshStandardMaterial({ color: colors[0], metalness: 0.9, roughness: 0.1, emissive: 0x1a2200, emissiveIntensity: 0.3 })
    mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: colors[1], wireframe: true, transparent: true, opacity: 0.2 })))
  } else if (index === 1) {
    const geo = new THREE.IcosahedronGeometry(0.75, 1)
    const mat = new THREE.MeshStandardMaterial({ color: colors[0], metalness: 0.8, roughness: 0.2, emissive: 0x2d1000, emissiveIntensity: 0.3 })
    mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: colors[1], wireframe: true, transparent: true, opacity: 0.18 })))
  } else {
    const geo = new THREE.TorusGeometry(0.65, 0.22, 16, 50)
    const mat = new THREE.MeshStandardMaterial({ color: colors[0], metalness: 0.7, roughness: 0.2, emissive: 0x001a20, emissiveIntensity: 0.3 })
    mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  const pt1 = new THREE.PointLight(colors[0], 2.5, 8)
  pt1.position.set(3, 3, 3); scene.add(pt1)
  const pt2 = new THREE.PointLight(colors[1], 1.5, 6)
  pt2.position.set(-2, -2, 2); scene.add(pt2)

  const speed = 0.4 + index * 0.2
  function tick() {
    requestAnimationFrame(tick)
    const t = Date.now() * 0.001
    if (mesh) {
      mesh.rotation.x = t * speed
      mesh.rotation.y = t * (speed + 0.15)
      mesh.position.y = Math.sin(t * 0.8) * 0.1
    }
    renderer.render(scene, camera)
  }
  tick()
})


// ====================================================
// CONTACT CANVAS — Particle vortex
// ====================================================
;(function() {
  const canvas = document.getElementById('contact-canvas')
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const w = canvas.parentElement.offsetWidth || window.innerWidth
  const h = canvas.parentElement.offsetHeight || 600
  renderer.setSize(w, h)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100)
  camera.position.z = 8

  const count = 1500
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = 2 + Math.random() * 5
    pos[i*3] = Math.cos(angle) * r
    pos[i*3+1] = (Math.random()-0.5) * 4
    pos[i*3+2] = Math.sin(angle) * r
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ color: 0xc8f06e, size: 0.025, transparent: true, opacity: 0.3 })
  scene.add(new THREE.Points(geo, mat))

  function tick() {
    requestAnimationFrame(tick)
    const t = Date.now() * 0.001
    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(pos[i*3+2], pos[i*3]) + 0.003
      const r = Math.sqrt(pos[i*3]*pos[i*3] + pos[i*3+2]*pos[i*3+2])
      pos[i*3] = Math.cos(angle) * r
      pos[i*3+2] = Math.sin(angle) * r
    }
    geo.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
  }
  tick()

  window.addEventListener('resize', () => {
    const nw = canvas.parentElement.offsetWidth
    const nh = canvas.parentElement.offsetHeight
    camera.aspect = nw/nh; camera.updateProjectionMatrix()
    renderer.setSize(nw, nh)
  })
})()

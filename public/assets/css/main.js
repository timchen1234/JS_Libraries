/* ════════════════════════════════════════════════
   main.js — Wanderlust Atlas
   Uses: Glide.js, AOS, Leaflet.js, Chart.js
════════════════════════════════════════════════ */

/* ── 1. GLIDE.JS — Hero Carousel ─────────────── */
new Glide('#heroGlide', {
    type: 'carousel',
    autoplay: 5500,
    animationDuration: 900,
    hoverpause: true,
}).mount();


/* ── 2. AOS — Animate On Scroll ──────────────── */
AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
});


/* ── 3. LEAFLET.JS — Interactive Map ─────────── */
const map = L.map('map', {
    center: [20, 15],
    zoom: 2,
    zoomControl: true,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Custom gold pin icon
const pinIcon = (emoji) => L.divIcon({
    className: '',
    html: `<div style="
    width:42px;height:42px;
    background:#c9a84c;
    border:3px solid #fff;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 12px rgba(0,0,0,.3);
    font-size:1.1rem;
  "><span style="transform:rotate(45deg)">${emoji}</span></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -46],
});

const destinations = [
    { lat: 36.4, lng: 25.43, label: '🏛️ Santorini, Greece', desc: 'Clifftop villages & caldera views.', emoji: '🏛️' },
    { lat: 35.01, lng: 135.76, label: '⛩️ Kyoto, Japan', desc: 'Ancient temples & bamboo forests.', emoji: '⛩️' },
    { lat: -8.35, lng: 115.09, label: '🌺 Bali, Indonesia', desc: 'Rice terraces & sacred ceremonies.', emoji: '🌺' },
    { lat: -13.16, lng: -72.54, label: '🏔️ Machu Picchu, Peru', desc: 'Inca citadel in the Andes.', emoji: '🏔️' },
    { lat: -50.5, lng: -73.1, label: '🧊 Patagonia, Argentina', desc: 'Glaciers, peaks & endless skies.', emoji: '🧊' },
    { lat: -4.03, lng: 39.62, label: '🦓 Mombasa, Kenya', desc: 'Safari & coastal paradise.', emoji: '🦓' },
    { lat: 48.86, lng: 2.35, label: '🗼 Paris, France', desc: 'Art, fashion & the Eiffel Tower.', emoji: '🗼' },
    { lat: 27.17, lng: 78.04, label: '✨ Agra, India', desc: 'The timeless Taj Mahal.', emoji: '✨' },
    { lat: -33.87, lng: 151.21, label: '🦘 Sydney, Australia', desc: 'Harbour, beaches & iconic opera.', emoji: '🦘' },
    { lat: 25.2, lng: 55.27, label: '🌆 Dubai, UAE', desc: 'Desert luxury & dazzling skylines.', emoji: '🌆' },
];

destinations.forEach(d => {
    L.marker([d.lat, d.lng], { icon: pinIcon(d.emoji) })
        .addTo(map)
        .bindPopup(`
      <div style="font-family:'DM Sans',sans-serif;min-width:160px;">
        <strong style="font-size:.95rem;color:#0b1f3a;">${d.label}</strong>
        <p style="margin:.4rem 0 0;font-size:.82rem;color:#7a8499;">${d.desc}</p>
      </div>
    `);
});


/* ── 4. CHART.JS — Travel Insights Charts ────── */
const ctx = document.getElementById('mainChart').getContext('2d');
let chart;

const chartData = {
    monthly: {
        type: 'bar',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Trips Booked (thousands)',
            data: [3.2, 3.8, 5.1, 7.8, 9.2, 8.6, 10.1, 9.7, 7.4, 6.1, 4.8, 5.9],
            backgroundColor: 'rgba(201,168,76,.75)',
            borderColor: '#c9a84c',
            borderWidth: 2,
            borderRadius: 8,
        }]
    },
    budget: {
        type: 'doughnut',
        labels: ['Flights', 'Accommodation', 'Food & Drink', 'Activities', 'Shopping', 'Transport'],
        datasets: [{
            data: [32, 28, 18, 12, 6, 4],
            backgroundColor: ['#0b1f3a', '#c9a84c', '#2d6a9f', '#e8c97a', '#7a8499', '#c8e0f4'],
            borderWidth: 3,
            borderColor: '#fff',
        }]
    },
    region: {
        type: 'polarArea',
        labels: ['SE Asia', 'Europe', 'S. America', 'Middle East', 'Africa', 'Oceania'],
        datasets: [{
            data: [42, 28, 14, 8, 5, 3],
            backgroundColor: [
                'rgba(201,168,76,.8)',
                'rgba(11,31,58,.8)',
                'rgba(45,106,159,.8)',
                'rgba(232,201,122,.8)',
                'rgba(122,132,153,.8)',
                'rgba(200,224,244,.8)',
            ],
            borderWidth: 2,
            borderColor: '#fff',
        }]
    }
};

function switchChart(type) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    if (chart) chart.destroy();
    const d = chartData[type];
    chart = new Chart(ctx, {
        type: d.type,
        data: { labels: d.labels, datasets: d.datasets },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: d.type !== 'bar',
                    labels: { font: { family: 'DM Sans', size: 12 }, color: '#1a1a2e' }
                },
                tooltip: {
                    bodyFont: { family: 'DM Sans' },
                    titleFont: { family: 'Playfair Display' },
                }
            },
            scales: d.type === 'bar' ? {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,.06)' },
                    ticks: { font: { family: 'DM Sans', size: 11 }, color: '#7a8499' },
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'DM Sans', size: 11 }, color: '#7a8499' }
                }
            } : {}
        }
    });
}

// Init default chart on page load
(function initChart() {
    const firstTab = document.querySelector('.chart-tab');
    if (firstTab) {
        firstTab.classList.add('active');
        const d = chartData['monthly'];
        chart = new Chart(ctx, {
            type: d.type,
            data: { labels: d.labels, datasets: d.datasets },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        bodyFont: { family: 'DM Sans' },
                        titleFont: { family: 'Playfair Display' },
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,.06)' },
                        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#7a8499' },
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#7a8499' }
                    }
                }
            }
        });
    }
})();


/* ── NAV SCROLL + SCROLL-TO-TOP BUTTON ────────── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
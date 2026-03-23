/* CURSOR PERSONNALISÉ */
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

(function tick() {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
})();

document.querySelectorAll('a, button, .toggle, .project-item, .cl, .track-pill').forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.width = '46px';
        ring.style.height = '46px';
        ring.style.borderColor = 'rgba(0,229,160,.7)';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(0,229,160,.4)';
    });
});

/* TOGGLE THÈME DARK / LIGHT */
const html = document.documentElement;
const btn = document.getElementById('toggleBtn');
const lbl = document.getElementById('themeLbl');
const saved = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-theme', saved);
lbl.textContent = saved;

btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    lbl.textContent = next;
});

btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') btn.click();
});

/*SCROLL REVEAL*/
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.sr').forEach(el => observer.observe(el));

/* LIEN NAV ACTIF AU SCROLL */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 110) {
            current = section.id;
        }
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}, { passive: true });

/* FORMULAIRE DE CONTACT */
document.getElementById('sendBtn').addEventListener('click', async() => {
    const name = document.getElementById('fn').value.trim();
    const email = document.getElementById('fe').value.trim();
    const subject = document.getElementById('fs').value.trim();
    const msg = document.getElementById('fm').value.trim();

    if (!name || !email || !msg) {
        showToast('⚠ Remplissez les champs obligatoires');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('⚠ Email invalide');
        return;
    }

    const endpoint = "https://formspree.io/f/myknvnqb";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom: name,
                email: email,
                sujet: subject,
                message: msg
            })
        });
        if (response.ok) {
            showToast('✓ Message envoyé !');
            ['fn', 'fe', 'fs', 'fm'].forEach(id => {
                document.getElementById(id).value = '';
            });
        } else {
            showToast('⚠ Erreur lors de l\'envoi du message');
        }
    } catch (error) {
        showToast('⚠ Erreur réseau de connexion');
    }
});

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
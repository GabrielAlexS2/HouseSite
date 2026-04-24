// Forçar scroll no topo antes do recarregamento e desabilitar âncoras passadas
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// Lógica da Tela de Preloader
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Dá um tempo mínimo de leitura (1.5s) da arte { Hello World! }
    setTimeout(() => {
      preloader.classList.add('opacity-0');
      
      // Espera terminar o fade-out CSS para jogar fora e liberar o overflow
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
        document.body.classList.add('overflow-x-hidden'); // Retorna overflow padrão x
      }, 1000); 
    }, 1500); 
  }
});

// Revelação ao Rolar a Página (Scroll Reveal)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});

// Efeitos de Parallax Suaves Customizados (Nativo)
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  
  // Efeito Parallax em elementos decorativos
  const parallaxies = document.querySelectorAll('.animate-float, .wireframe-mesh, .animate-glow-pulse, .animate-glow-pulse-alt');
  parallaxies.forEach((el, index) => {
    const speed = (index + 1) * 0.05;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
  
  // Efeito Parallax no cabeçalho (glass-card) para torná-lo mais dinâmico
  const header = document.querySelector('header');
  if (header) {
    if(scrolled > 50) {
      if (header.classList.contains('glass-card-solid')) {
        header.style.background = 'rgba(22, 27, 34, 0.85)';
      } else {
        header.style.background = 'rgba(13, 17, 23, 0.85)';
      }
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      if (header.classList.contains('glass-card-solid')) {
        header.style.background = 'rgba(22, 27, 34, 0.4)';
      } else {
        header.style.background = 'rgba(17, 24, 39, 0.7)';
      }
      header.style.boxShadow = 'none';
    }
  }
});

// Alternar Menu Mobile
const menuBtn = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.toggle('translate-x-full');
    document.body.classList.toggle('overflow-hidden');
  }
}

if (menuBtn) {
  menuBtn.addEventListener('click', toggleMobileMenu);
}

if (closeBtn) {
  closeBtn.addEventListener('click', toggleMobileMenu);
}

if (mobileLinks.length > 0) {
  mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
  });
}

// Configuração do Efeito Parallax GSAP (De Hero para a próxima Seção)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  const heroSection = document.querySelector('section.bg-grid');
  
  if (heroSection) {
    // Faz a seção Hero deslizar para baixo mais lentamente do que o scroll visual,
    // criando profundidade em relação à próxima seção que vem por cima.
    gsap.to(heroSection, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Animação da nova seção criada após o Hero com Pin (Travar tela) usando matchMedia para responsividade
  const featuresSection = document.getElementById('features-scroll');
  if (featuresSection) {
    let mm = gsap.matchMedia();

    // ----------------------------------------------------
    // Desktop (>1024px)
    // ----------------------------------------------------
    mm.add("(min-width: 1025px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuresSection,
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      tl.to({}, { duration: 0.3 })
        .fromTo('.features-img', 
          { opacity: 0, y: 100 }, 
          { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
        )
        .fromTo('.card-item', 
          { opacity: 0, x: 150 }, 
          { opacity: 1, x: 0, duration: 1.5, stagger: 1.2, ease: "power2.out" },
          "+=0.2"
        )
        .to({}, { duration: 0.5 });
    });

    // ----------------------------------------------------
    // Mobile/Tablet (<=1024px)
    // ----------------------------------------------------
    mm.add("(max-width: 1024px)", () => {
      // Animação temporária de entrada/saída (slide) dos cartões
      
      const tlMobile = gsap.timeline({
        scrollTrigger: {
          trigger: featuresSection,
          start: "top top",
          end: "+=3000", // Aumentamos um pouco o espaço de scroll para dar tempo da animação ler
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      // Inicia ocultando os cartões
      gsap.set('.card-item', { opacity: 0, y: 50, display: 'none' });

      tlMobile.to({}, { duration: 0.2 })
        // 1. A imagem surge
        .fromTo('.features-img', 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );

      // Lógica sequencial para Mobile
      const cards = gsap.utils.toArray('.card-item');
      
      cards.forEach((card, index) => {
        // Elevação tática para centralizar na tela
        const upShift = -200; 
        
        if (index < cards.length - 1) {
          tlMobile
            .set(card, { display: 'block' }) 
            .to(card, { opacity: 1, y: upShift, duration: 1, ease: "power2.out" }) 
            .to({}, { duration: 0.8 }) 
            .to(card, { opacity: 0, y: upShift - 50, duration: 0.5, ease: "power2.in" }) 
            .set(card, { display: 'none' });
        } else {
          tlMobile
            .set(card, { display: 'block' })
            .to(card, { opacity: 1, y: upShift, duration: 1, ease: "power2.out" })
            .to({}, { duration: 0.8 });
        }
      });

      // Mostra a grade completa ao término da rolagem
      tlMobile
        .to('.card-item', { opacity: 0, duration: 0.4 }) // Limpa a tela
        .set('.card-item', { display: 'block', y: 50 })  // Prepara o grid em bloco
        .to('.card-item', { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "+=0.3")
        .to({}, { duration: 0.5 }); // Pausa para finalizar leitura
    });
  }

  // Animação de Scroll do Vídeo - Seção do Robô
  const roboSection = document.getElementById('robo-section');
  const roboVideo = document.getElementById('robo-video');

  if (roboSection && roboVideo) {
    const initScrollVideo = () => {
      // Faz barra de navegação principal da página SUMIR enquanto anima o robô
      const header = document.querySelector('header');
      let duration = roboVideo.duration || 10;

      const tlVideo = gsap.timeline({
        scrollTrigger: {
          trigger: roboSection,
          start: "top top",
          end: "+=5000", // Fixa a tela durante o ciclo
          pin: true,     
          scrub: 1.5,    // Suaviza rolagem
          anticipatePin: 1,
          onEnter: () => gsap.to(header, { yPercent: -120, duration: 0.4, ease: "power2.inOut" }),
          onLeave: () => gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.inOut" }),
          onEnterBack: () => gsap.to(header, { yPercent: -120, duration: 0.4, ease: "power2.inOut" }),
          onLeaveBack: () => gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.inOut" })
        }
      });
      
      // 1. Apaga o título gigante principal lentamente logo que começamos a rolar
      tlVideo.to("#robo-title", {
        opacity: 0,
        y: -50,
        duration: 0.1, 
        ease: "none"
      }, 0);

      // 2. Animação principal do vídeo (Tempo de 0 até duração total)
      tlVideo.fromTo(roboVideo, 
        { currentTime: 0 },
        {
          currentTime: duration,
          ease: "none",
          duration: 1
        }, 
      0);

      // 3. Efeito Escaneamento Fisicamente do Elemeto: Move o vídeo para cima
      tlVideo.fromTo(roboVideo, 
        { y: 0 },
        {
          y: () => window.innerHeight - roboVideo.offsetHeight,
          duration: 1,
          ease: "sine.inOut"
        }, 
      0);

      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(roboVideo, { y: 0 }); // reset antes da medição GSAP
      });

      // 4. Animar os textos
      const textItems = gsap.utils.toArray('.robo-text-item');
      const stagp = 0.8 / (textItems.length || 1); 
      
      textItems.forEach((item, index) => {
        const startPoint = 0.1 + (index * stagp);
        const direction = index % 2 === 0 ? -100 : 100;
        
        tlVideo.fromTo(item, 
          { opacity: 0, x: direction, y: 50 },
          { opacity: 1, x: 0, y: 0, duration: 0.15, ease: "power2.out" },
          startPoint
        );
      });
    };

    // Escuta os metadados para garantir que sabemos a duração do vídeo
    if (roboVideo.readyState >= 1) {
      initScrollVideo();
    } else {
      roboVideo.addEventListener('loadedmetadata', initScrollVideo);
    }
  }
}

// Scroll Spy para Menu Ativo
const sections = document.querySelectorAll('section[id]');
const navLinksDesktop = document.querySelectorAll('header nav a.nav-spy');
const navLinksMobile = document.querySelectorAll('#mobile-menu a.nav-spy');

function updateActiveLink() {
  // Ajuste do cálculo com threshold visual
  const scrollY = window.scrollY + 200; 
  
  let currentSection = sections[0];
  
  // Verifica de baixo para cima qual é a seção visível
  // Ignora 'offsetHeight' porque as seções pinadas pelo GSAP estouram o limite da altura natural
  for (let i = sections.length - 1; i >= 0; i--) {
    let el = sections[i];
    let sectionTop = el.offsetTop;
    
    // GSAP envolve o elemento em <div class="pin-spacer"> quando 'pinned'
    if (el.parentElement && el.parentElement.classList.contains('pin-spacer')) {
      sectionTop = el.parentElement.offsetTop;
    }
    
    if (el.id === "features-scroll") sectionTop -= window.innerHeight / 2;

    if (scrollY >= sectionTop) {
      currentSection = el;
      break;
    }
  }

  if (!currentSection) return;
  
  const sectionId = currentSection.getAttribute('id');

  if (navLinksDesktop.length) {
    navLinksDesktop.forEach(link => link.classList.remove('text-brand-primary'));
    let activeDesktop = document.querySelector(`header nav a.nav-spy[href="#${sectionId}"]`);
    // Se estiver no features ou no robô, o menu permanece na home
    if (sectionId === "features-scroll" || sectionId === "robo-section") {
      activeDesktop = document.querySelector(`header nav a.nav-spy[href="#home"]`);
    }
    if (activeDesktop) activeDesktop.classList.add('text-brand-primary');
  }
  
  if (navLinksMobile.length) {
    navLinksMobile.forEach(link => link.classList.remove('text-brand-primary'));
    let activeMobile = document.querySelector(`#mobile-menu a.nav-spy[href="#${sectionId}"]`);
    if (sectionId === "features-scroll" || sectionId === "robo-section") {
      activeMobile = document.querySelector(`#mobile-menu a.nav-spy[href="#home"]`);
    }
    if (activeMobile) activeMobile.classList.add('text-brand-primary');
  }
}

if (sections.length > 0) {
  window.addEventListener('scroll', updateActiveLink);
  // Atraso sutil para pegar render do carregamento GSAP
  setTimeout(updateActiveLink, 500); // aumentado para aguardar GSAP montar o DOM virtual
}

// Filtro de Pesquisa na Loja
const searchDesktop = document.getElementById('search-desktop');
const searchMobile = document.getElementById('search-mobile');
const productCards = document.querySelectorAll('.product-card');

function filterProducts(query) {
  const lowerQuery = query.toLowerCase();
  productCards.forEach(card => {
    const titleObj = card.querySelector('h3');
    if (titleObj) {
      const title = titleObj.textContent.toLowerCase();
      if (title.includes(lowerQuery)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

if (searchDesktop) {
  searchDesktop.addEventListener('input', (e) => {
    filterProducts(e.target.value);
    if(searchMobile) searchMobile.value = e.target.value; // Sync mobile
  });
}

if (searchMobile) {
  searchMobile.addEventListener('input', (e) => {
    filterProducts(e.target.value);
    if(searchDesktop) searchDesktop.value = e.target.value; // Sync desktop
  });
}

// ====== DADOS MOCKADOS E RENDERIZAÇÃO DOM ======
const mockData = {
  voluntarios: [
    { nome: "Ana Lessa", role: "UI/UX Designer", img: "https://i.pravatar.cc/150?u=ana", github: "#", instagram: "#" },
    { nome: "Rosana", role: "Frontend Dev", img: "https://i.pravatar.cc/150?u=rosana", github: "#", instagram: "#" },
    { nome: "Davi", role: "Backend Dev", img: "https://i.pravatar.cc/150?u=davi", github: "#", instagram: "#" },
    { nome: "Julia", role: "Community Manager", img: "https://i.pravatar.cc/150?u=julia", github: "#", instagram: "#" },
    { nome: "Samuel", role: "Fullstack Dev", img: "https://i.pravatar.cc/150?u=samuel", github: "#", instagram: "#" },
    { nome: "Erliza", role: "Frontend Dev", img: "https://i.pravatar.cc/150?u=erliza", github: "#", instagram: "#" }
  ],
  ongs: [
    { nome: "ONG Vida Tech", logo: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80" },
    { nome: "Educa Código", logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=150&q=80" },
    { nome: "Devs Sem Fronteiras", logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=150&q=80" },
    { nome: "Apoio Digital", logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80" },
    { nome: "Inclusão JS", logo: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80" },
    { nome: "Code for Good", logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=150&q=80" },
    { nome: "ONG Reactives", logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=150&q=80" },
    { nome: "Tech do Bem", logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=150&q=80" }
  ],
  projetos: [
    { titulo: "Podcast Housecast", tipo: "Mídia", desc: "Episódios semanais com grandes nomes da tecnologia compartilhando carreira e dicas técnicas.", img: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=400&q=80", link: "#" },
    { titulo: "House UI Kit", tipo: "Open Source", desc: "Biblioteca de componentes open source construída com React e Tailwind para projetos da comunidade.", img: "https://images.unsplash.com/photo-1618477247222-ac60c647046e?auto=format&fit=crop&w=400&q=80", link: "#" },
    { titulo: "JS Jobs API", tipo: "Open Source", desc: "API desenvolvida em Node.js para agregação de vagas focadas exclusivamente no ecossistema JS.", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80", link: "#" }
  ],
  depoimentos: [
    { texto: "Graças à House JS consegui aprimorar meu conhecimento e garantir minha primeira vaga de júnior!", autor: "Marcos S.", cargo: "Jr. Backend Developer" },
    { texto: "O networking e os projetos open source me deram a experiência prática que faltava no currículo.", autor: "Fernanda L.", cargo: "Frontend Engineer" },
    { texto: "As aulas e mentorias da comunidade mudaram a minha forma de enxergar o desenvolvimento web moderno.", autor: "Carlos M.", cargo: "Fullstack Developer" }
  ],
  cursos: [
    { titulo: "Curso Em Vídeo - Javascript Moderno (Completo)", link: "https://youtube.com" },
    { titulo: "Trilha Node.js Gratuita para Iniciantes", link: "https://youtube.com" },
    { titulo: "Vagas Remotas Tech Tracker - Vagas Abertas", link: "https://github.com" },
    { titulo: "Masterclass Next.js 14 com Tailwind", link: "https://youtube.com" },
    { titulo: "Lógica de Programação com JS Zero ao Pro", link: "https://youtube.com" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Renderizar Projetos Divisões Alternadas
  const projetosContainer = document.getElementById('projetos-dinamicos');
  if (projetosContainer) {
    projetosContainer.innerHTML = mockData.projetos.map((p, idx) => `
      <div class="glass-card flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} rounded-2xl overflow-hidden group">
        <div class="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
          <img src="${p.img}" alt="${p.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-brand-bg/40"></div>
          <span class="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-white text-xs font-bold rounded-full">${p.tipo}</span>
        </div>
        <div class="w-full md:w-1/2 p-8 flex flex-col justify-center items-start text-left">
          <h3 class="text-2xl font-bold mb-3 text-white">${p.titulo}</h3>
          <p class="text-brand-textSecondary text-base leading-relaxed mb-6">${p.desc}</p>
          <a href="${p.link}" class="inline-flex items-center justify-center text-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-colors">
            Acessar Projeto
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
      </div>
    `).join('');
  }

  // Renderizar ONGs (Marquee em 2 linhas)
  const ongsContainer = document.getElementById('ongs-marquee');
  if (ongsContainer) {
    const half = Math.ceil(mockData.ongs.length / 2);
    const row1 = mockData.ongs.slice(0, half);
    const row2 = mockData.ongs.slice(half);

    const renderRow = (arr) => arr.map(o => `
      <div class="px-8 py-6 glass-card rounded-xl flex flex-col items-center justify-center shrink-0 w-64 h-32 hover:border-brand-primary/50 transition-colors">
        <img src="${o.logo}" alt="${o.nome}" class="w-full h-16 object-cover rounded filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 mb-2">
        <span class="text-white text-xs font-bold whitespace-nowrap">${o.nome}</span>
      </div>
    `).join('');
    
    ongsContainer.classList.add('flex-col'); // Stack them vertically
    ongsContainer.innerHTML = `
      <div class="flex overflow-hidden w-full gap-2 group marquee-row">
        <div class="marquee-content">${renderRow(row1)}</div><div class="marquee-content" aria-hidden="true">${renderRow(row1)}</div>
      </div>
      <div class="flex overflow-hidden w-full gap-2 group marquee-row">
        <div class="marquee-content" style="animation-direction: reverse; animation-duration: 22s;">${renderRow(row2)}</div><div class="marquee-content" aria-hidden="true" style="animation-direction: reverse; animation-duration: 22s;">${renderRow(row2)}</div>
      </div>
    `;
  }

  // Renderizar Voluntários (Marquee em 2 linhas)
  const membrosContainer = document.getElementById('membros-marquee');
  if (membrosContainer) {
    const half = Math.ceil(mockData.voluntarios.length / 2);
    const row1 = mockData.voluntarios.slice(0, half);
    const row2 = mockData.voluntarios.slice(half);

    const renderRow = (arr) => arr.map(v => `
      <div class="p-6 glass-card rounded-2xl flex items-center gap-4 shrink-0 w-72 hover:border-brand-secondary/50 transition-colors">
        <img src="${v.img}" alt="${v.nome}" class="w-16 h-16 rounded-full object-cover border-2 border-brand-secondary/30">
        <div>
          <h4 class="text-white font-bold text-lg leading-tight">${v.nome}</h4>
          <p class="text-brand-secondary text-xs font-mono mb-2">${v.role}</p>
          <div class="flex gap-2 text-brand-textSecondary mt-2">
             <a href="${v.github}" class="hover:text-white transition-colors" target="_blank"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg></a>
             <a href="${v.instagram}" class="hover:text-white transition-colors" target="_blank"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>
          </div>
        </div>
      </div>
    `).join('');

    membrosContainer.classList.add('flex-col');
    membrosContainer.innerHTML = `
      <div class="flex overflow-hidden w-full gap-2 group marquee-row">
        <div class="marquee-content" style="animation-duration: 25s;">${renderRow(row1)}</div><div class="marquee-content" aria-hidden="true" style="animation-duration: 25s;">${renderRow(row1)}</div>
      </div>
      <div class="flex overflow-hidden w-full gap-2 group marquee-row">
        <div class="marquee-content" style="animation-duration: 28s; animation-direction: reverse;">${renderRow(row2)}</div><div class="marquee-content" aria-hidden="true" style="animation-duration: 28s; animation-direction: reverse;">${renderRow(row2)}</div>
      </div>
    `;
  }

  // Renderizar Depoimentos
  const depContainer = document.getElementById('depoimentos-dinamicos');
  if (depContainer) {
    depContainer.innerHTML = mockData.depoimentos.map(d => `
      <div class="glass-card p-8 rounded-2xl relative border-l-4 border-brand-primary">
        <svg class="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"></path></svg>
        <p class="text-white text-base md:text-lg italic mb-6 relative z-10 leading-relaxed">"${d.texto}"</p>
        <div class="border-t border-white/10 pt-4 flex items-center justify-between">
          <span class="font-bold text-brand-primary whitespace-nowrap">${d.autor}</span>
          <span class="text-brand-textSecondary text-xs md:text-sm font-mono text-right">${d.cargo}</span>
        </div>
      </div>
    `).join('');
  }

  // Renderizar Cursos
  const cursosContainer = document.getElementById('cursos-lista');
  if (cursosContainer) {
    cursosContainer.innerHTML = mockData.cursos.map(c => `
      <a href="${c.link}" target="_blank" class="flex items-center justify-between p-4 bg-black/40 hover:bg-white/5 border border-brand-primary/10 hover:border-brand-primary/50 shadow-[0_0_15px_rgba(0,151,178,0.05)] rounded-xl transition-all group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span class="font-bold text-brand-textMain group-hover:text-brand-primary transition-colors text-sm md:text-base">${c.titulo}</span>
        </div>
        <svg class="w-5 h-5 text-brand-textSecondary group-hover:text-brand-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
      </a>
    `).join('');
  }
});

// Ações Personalizadas (Lojinha WhatsApp)
document.addEventListener('DOMContentLoaded', () => {
  const btnsComprar = document.querySelectorAll('.product-card button');
  if (btnsComprar.length > 0) {
    btnsComprar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const tituloEl = card.querySelector('h3');
        if (tituloEl) {
          const produto = tituloEl.textContent;
          const msg = encodeURIComponent(`Olá, pessoal da House JS! Tenho interesse em adquirir o produto: *${produto}*. Como funciona o pagamento e entrega?`);
          const zapLink = `https://wa.me/5511999999999?text=${msg}`;
          window.open(zapLink, '_blank');
        }
      });
    });
  }
});

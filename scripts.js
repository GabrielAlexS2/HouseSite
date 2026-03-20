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
    // DESKTOP (telas maiores que 1024px) - Comportamento atual
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
    // MOBILE/TABLET (telas até 1024px) - O que você pediu
    // ----------------------------------------------------
    mm.add("(max-width: 1024px)", () => {
      // Como os cards ficarão empilhados no DOM, vamos usar posicionamento absoluto para o efeito "slide in/out"
      // temporariamente, ou apenas animar opacidade e y se sobrepondo.
      // O truque aqui é usar o stagger para esconder/mostrar na timeline.
      
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

      // Garantimos que todos comecem ocultos e com posição original
      gsap.set('.card-item', { opacity: 0, y: 50, display: 'none' });

      tlMobile.to({}, { duration: 0.2 })
        // 1. A imagem surge
        .fromTo('.features-img', 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );

      // Pegamos os elementos para fazer a sequência manual no Mobile
      const cards = gsap.utils.toArray('.card-item');
      
      cards.forEach((card, index) => {
        // Elevação artificial (-200) para centralizá-los mais no meio da tela e sair da base oculta
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

      // Transição para a aparição conjunta final de todos os cards no lugar de origem na página
      tlMobile
        .to('.card-item', { opacity: 0, duration: 0.4 }) // desaparece com qualquer card isolado remanescente centralizado
        .set('.card-item', { display: 'block', y: 50 })  // prepara o layout em formato real (flex-col sem elevação GSAP)
        .to('.card-item', { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "+=0.3")
        .to({}, { duration: 0.5 }); // Pausa para finalizar leitura
    });
  }

  // Animação de Scroll de Imagens (Canvas) - Seção do Robô
  const roboSection = document.getElementById('robo-section');
  const roboCanvas = document.getElementById('robo-canvas');

  if (roboSection && roboCanvas) {
    const context = roboCanvas.getContext('2d');
    
    // Configurações da sequência (Tamanho e Nomes Atualizados)
    const frameCount = 240; // do 001 até ezgif-frame-240
    const currentFrame = index => (
      `./img-robo/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const processedImages = [];
    const robo = { frame: 0 };
    let firstRenderDone = false;

    // Faz o preload assíncrono das imagens já limpas (sem fundo)
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            processedImages[i] = img; // Guarda a imagem direto, não precisa mais do loop de pixels
            
            // Dispara render base 1ª vez
            if (i === 0 && !firstRenderDone) {
                renderFrame();
                firstRenderDone = true;
            }
        };
    }

    // Função que plota a imagem no canvas secamente (Sem rastro/Crossfade)
    const renderFrame = () => {
        // Garantindo número inteiro para não pegar imagens fracionadas e borrar
        const f = Math.round(robo.frame);
        const img = processedImages[f];

        if (img) {
            // Garante o aspect ratio no redimensionamento da janela e desliga anti-aliasing excessivo do navegador
            if (roboCanvas.width !== img.width || roboCanvas.height !== img.height) {
                roboCanvas.width = img.width;
                roboCanvas.height = img.height;
                // Ativando a suavização de imagem para preservar a qualidade!
                context.imageSmoothingEnabled = true; 
                context.imageSmoothingQuality = "high";
            }
            
            // Limpa TODO o frame anterior (evita ghosting/sobreposição)
            context.clearRect(0, 0, roboCanvas.width, roboCanvas.height);
            context.drawImage(img, 0, 0);
        }
    };

    // Timeline GSAP ScrollTrigger
    const initScrollCanvas = () => {
      // Faz barra de navegação principal da página SUMIR enquanto anima o robô
      const header = document.querySelector('header');

      const tlCanvas = gsap.timeline({
        scrollTrigger: {
          trigger: roboSection,
          start: "top top",
          end: "+=5000", // "Pede" muito espaço de tela para dar o tempo exato do scan longo
          pin: true,     
          scrub: 2,    // Inércia leve amortece as incosistências de scroll (mouse wheel vs pad)
          anticipatePin: 1,
          onEnter: () => gsap.to(header, { yPercent: -120, duration: 0.4, ease: "power2.inOut" }),
          onLeave: () => gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.inOut" }),
          onEnterBack: () => gsap.to(header, { yPercent: -120, duration: 0.4, ease: "power2.inOut" }),
          onLeaveBack: () => gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.inOut" }),
        }
      });
      
      // 1. Apaga o título gigante principal lentamente logo que começamos a rolar
      tlCanvas.to("#robo-title", {
        opacity: 0,
        y: -50,
        duration: 0.1, 
        ease: "none"
      }, 0);

      // 2. Animação principal dos frames (Girar) em passos exatos
      tlCanvas.to(robo, {
        frame: frameCount - 1,
        snap: "frame", // Força frames redondos exatos (0,1,2..) e não decimais (1.4)
        ease: "none",
        duration: 1, // Timeline de 0 a 1 relativa ao scroll total (+5000)
        onUpdate: () => requestAnimationFrame(renderFrame)
      }, 0);

      // 3. O "Efeito Escaneamento": Fazer as imagens subirem juntamente quando rola a página
      // Pegando da cabeça até a parte inferior (pés).
      // Em vez de mexer na propriedade CSS interna 'object-position', nós movemos fisicamente 
      // a tag canvas inteira para cima pelo exato tamanho de sobra dela em relação à tela.
      tlCanvas.fromTo(roboCanvas, 
        { y: 0 },
        {
          y: () => window.innerHeight - roboCanvas.offsetHeight,
          duration: 1,
          ease: "sine.inOut"
        }, 
      0);

      // Re-calcular a proporção se a tela mudar de tamanho (Responsividade GSAP)
      ScrollTrigger.addEventListener("refreshInit", () => {
        // Assegura que GSAP zere o transform antes de medir a altura natural novamente
        gsap.set(roboCanvas, { y: 0 });
      });

      // 4. Animar os textos em sequência no decorrer do descimento e do giro
      const textItems = gsap.utils.toArray('.robo-text-item');
      
      // Dividimos o espaço total (duration 1) em blocos iguais de entrada
      // para ir pipocando as frases num zigzag. 
      const stagp = 0.8 / textItems.length; // 80% do percurso usado pros textos
      
      textItems.forEach((item, index) => {
        const startPoint = 0.1 + (index * stagp);
        
        // Entra (Fade in + Surge do lado)
        const direction = index % 2 === 0 ? -100 : 100; // Esquerda para Dir, ou Dir para Esq
        
        tlCanvas.fromTo(item, 
          { opacity: 0, x: direction, y: 50 },
          { opacity: 1, x: 0, y: 0, duration: 0.15, ease: "power2.out" },
          startPoint
        );
        
        // CÓDIGO DE SAÍDA REMOVIDO:
        // Agora, uma vez que entram na tela animadinhos, os cards permanecem estáticos (pinned) visíveis
        // até toda a seção acabar o seu progresso de +5000 de scroll nativo.
      });
    };

    initScrollCanvas();
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

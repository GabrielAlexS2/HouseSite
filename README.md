# House JS - Comunidade de Desenvolvedores JavaScript

Bem-vindo ao repositório oficial da **House JS**, uma landing page e plataforma focada na comunidade de desenvolvedores JavaScript. O projeto visa centralizar aprendizado, networking, eventos e projetos de ponta (open source) dentro do ecossistema JS (JavaScript, Node.js, React/Next, TypeScript).

## 🚀 Visão Geral do Projeto

A aplicação consiste em uma Single Page Application (com páginas conectadas como uma loja virtual) altamente interativa, com foco central em animações fluidas e design moderno, inspirada em arquiteturas visuais tecnológicas e imersivas.

### Principais Seções
- **Hero / Home:** Uma introdução visual de impacto com efeitos de malha aramada (wireframe mesh) e brilho pulsante, contendo forte chamada para ação ("Construindo o futuro da tecnologia").
- **Features (Scroll Animado):** Uma apresentação em cascata das vantagens de participar da comunidade (Ecossistema Completo, Networking de Valor, Projetos Práticos) orquestrada por efeitos de travamento de tela com GSAP.
- **Máquina do Futuro (Robô Interativo):** O ápice criativo e técnico da página. Utiliza o motor GSAP ScrollTrigger renderizando dentro de um Canvas HTML para processar 22 frames sequenciais de um robô 3D, em sincronia milimétrica com a rolagem do usuário. Conforme o scroll ocorre, módulos do robô ("Sensor Óptico", "Núcleo JS") saltam na tela relatando stacks da programação atual.
- **Comunidade, Eventos, Stacks e Projetos:** Estruturas focadas na exibição de dados e iniciativas (Meetups, Hackathons, Projetos Open Source, UI Kits).
- **Loja (`loja.html`):** Portal suplementar com buscador em tempo real (Search Spy) de produtos e itens de marca House JS.

## 🛠 Tecnologias e Ferramentas Utilizadas

O projeto foi construído empregando as melhores práticas do Frontend clássico combinado a bibliotecas modernas de animação de alto desempenho corporativo:

* **HTML5:** Estruturação semântica limpa para suportar componentes espaciais flutuantes.
* **Tailwind CSS v3 (via CDN):** Framework utilitário instanciado dinamicamente usando `tailwind-config.js` e plugins para `forms` e `container-queries`. Estende o design nativo incluindo a identidade visual de cores (`brand-primary`, `brand-secondary`) e estilização de grids espaciais responsivos (Mobile a UHD).
* **CSS Customizado (`styles.css`):** Regras especializadas para animações específicas por frame e declaração fina de variáveis CSS não cobertas nativamente.
* **JavaScript (JS Vanilla ES6+):** Utilizado de ponta a ponta sem frameworks front-end pesados para a lógica da página, englobando controle robusto do Mobile Menu, funções utilitárias de domínios específicos (ex. search de listagens na loja) e `Intersection Observers` (`.reveal`) gerenciando visibilidade de paineis ao rolar.
* **Motor GSAP v3 & ScrollTrigger:** Utilizado pesadamente para arquitetar comportamentos cinematográficos complexos, fixação (pin) nas sessões da tela base e orquestrar múltiplos objetos HTML (`timeline`).
* **HTML Canvas Engine:** Camada renderizadora 2D puramente controlada por tempo (scroll-frame) baseando o movimento liso da sessão do Robô sem perda de FPS ou poluição exagerada do DOM.

## ⚙️ Estrutura de Arquivos

```text
House/
├── index.html            # Landing page core com a vitrine principal House JS e interatividade.
├── loja.html             # Página da store agregada e filtro modular.
├── scripts.js            # Arquivo vital definindo a lógica do GSAP, menus, busca e ScrollSpy.
├── styles.css            # Base de keyframes personalizados extras e estilos raízes complexos.
├── tailwind-config.js    # Arquivo de injeção dos tokens de design (Fontes Inter, Brand Colors).
├── img/                  # Assets gráficos estáticos de interface (logos em PNG).
├── img-robo/             # Sequência extraída para animação de scroll frame-a-frame do Canvas.
└── stitch-skills/        # Área configurada relacionada ao Agente IA / servidor MCP Stitch (Design AI).
```

## 🧠 Lógica Principal do Javascript App (`scripts.js`)

1. **Intersection Observers (`.reveal`):** Observa 10% da entrada do campo de visão. Exibe de modo contínuo blocos baseados em `opacity-0` traduzindo para visíveis, impulsionando a sensação de página "viva".
2. **Scroll Spy Customizado:** Um algoritmo customizado mapeia as alturas das seções. Mesmo com o GSAP travando (Pinning) artificialmente partes da página (como a área do Canvas/Robô), ele detecta o contexto base ativando os botões na navegação de topo (`header nav a.nav-spy`).
3. **Animação em HTML Canvas (Robô) acoplada a Scroll (GSAP):** Carrega assincronamente 22 quadros pesados (png's recortados) mapeando-os nos quadros da `gsap.timeline()` baseados em `requestAnimationFrame()`. Destrava frames absolutos mantendo a taxa alta sem travamentos visuais.

## 💻 Como Rodar o Projeto (Desenvolvimento Local)

Dado que trata-se de um sistema client-side com bundlers dinâmicos (CDN) preestabelecidos, não há a necessidade impeditiva da compilação Node/NPM.

1. **Pré-requisitos:** Utilize qualquer servidor local de desenvolvimento live-reload (Ex: extensão **Live Server** para VS Code).
2. Abra a pasta base do projeto (`/House`).
3. Dê start no ambiente estático rodando `index.html`.
4. *A mágica da comunidade House JS estará viva e funcional na sua tela.*

---

<div align="center">
  <b>House JS</b> Community • <i>Aprender, Construir, Compartilhar, Crescer.</i><br/>
  Desenvolvido com ☕️ e 💻 para revolucionar as metodologias Open Source!
</div>

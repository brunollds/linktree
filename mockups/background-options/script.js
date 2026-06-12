const themes = {
  organic: {
    number: 'Opção 1',
    name: 'Gradiente orgânico estático',
    description:
      'Manchas suaves em verde e terracota mantêm a identidade sem competir com os links.',
    performance: 'Excelente',
    personality: 'Acolhedora e premium',
    verdict: 'Melhor equilíbrio geral',
  },
  moving: {
    number: 'Opção 2',
    name: 'Gradiente com movimento lento',
    description:
      'Formas desfocadas se deslocam quase imperceptivelmente, preservando vida sem exigir WebGL.',
    performance: 'Muito boa',
    personality: 'Contemporânea e viva',
    verdict: 'Boa se ainda quisermos movimento',
  },
  editorial: {
    number: 'Opção 3',
    name: 'Textura editorial',
    description:
      'Fundo escuro, granulação discreta e um brilho concentrado no perfil criam atmosfera de revista.',
    performance: 'Excelente',
    personality: 'Sofisticada e sóbria',
    verdict: 'Mais elegante e menos promocional',
  },
  aurora: {
    number: 'Opção 4',
    name: 'Aurora suave',
    description:
      'Faixas luminosas de baixa opacidade adicionam profundidade sem reagir ao cursor ou ao toque.',
    performance: 'Muito boa',
    personality: 'Digital e premium',
    verdict: 'Mantém impacto com menos distração',
  },
  paper: {
    number: 'Opção 5',
    name: 'Papel premium claro',
    description:
      'Off-white, verde-floresta e terracota aproximam a página de casa, decoração e lifestyle.',
    performance: 'Excelente',
    personality: 'Editorial e acolhedora',
    verdict: 'Maior mudança de identidade',
  },
  photo: {
    number: 'Opção 6',
    name: 'Imagem ambiental desfocada',
    description:
      'Uma imagem de ambiente cria conexão imediata com casa e decoração, sob uma camada escura.',
    performance: 'Boa',
    personality: 'Humana e contextual',
    verdict: 'Forte, mas depende da foto certa',
  },
};

const screen = document.querySelector('#phone-screen');
const buttons = document.querySelectorAll('[data-theme]');

function applyTheme(themeName) {
  const theme = themes[themeName];
  screen.className = `phone-screen theme-${themeName}`;

  document.querySelector('#theme-number').textContent = theme.number;
  document.querySelector('#theme-name').textContent = theme.name;
  document.querySelector('#theme-description').textContent = theme.description;
  document.querySelector('#theme-performance').textContent = theme.performance;
  document.querySelector('#theme-personality').textContent = theme.personality;
  document.querySelector('#theme-verdict').textContent = theme.verdict;

  buttons.forEach((button) => {
    button.classList.toggle('active', button.dataset.theme === themeName);
  });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const themeName = button.dataset.theme;
    applyTheme(themeName);
    window.history.replaceState(null, '', `?theme=${themeName}`);
  });
});

const initialTheme = new URLSearchParams(window.location.search).get('theme');
if (initialTheme && themes[initialTheme]) {
  applyTheme(initialTheme);
}

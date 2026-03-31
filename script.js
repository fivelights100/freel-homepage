const defaultConfig = {
  registryUrl: 'http://127.0.0.1:4000/plugins/registry',
  protocolScheme: 'freel',
};

const storageKey = 'freel.pluginHome.config';

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return { ...defaultConfig, ...saved };
  } catch {
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  localStorage.setItem(storageKey, JSON.stringify(config));
}

function setStatus(message, isError = false) {
  const el = document.getElementById('status-pill');
  el.textContent = message;
  el.style.color = isError ? '#ff9a9a' : '';
}

function buildProtocolUrl(action, pluginId) {
  const scheme = document.getElementById('protocol-scheme').value.trim() || defaultConfig.protocolScheme;
  return `${scheme}://plugin/${action}?pluginId=${encodeURIComponent(pluginId)}`;
}

function openProtocol(action, pluginId) {
  window.location.href = buildProtocolUrl(action, pluginId);
}

function fillConfigFields(config) {
  document.getElementById('registry-url').value = config.registryUrl;
  document.getElementById('protocol-scheme').value = config.protocolScheme;
}

function renderPlugins(plugins) {
  const list = document.getElementById('plugin-list');
  const template = document.getElementById('plugin-card-template');
  list.innerHTML = '';

  if (!plugins.length) {
    list.innerHTML = '<div class="empty-state">표시할 플러그인이 없습니다. 레지스트리 주소를 다시 확인해 주세요.</div>';
    return;
  }

  plugins.forEach((plugin) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.plugin-card__eyebrow').textContent = plugin.official ? 'Official Plugin' : 'External Plugin';
    node.querySelector('h3').textContent = plugin.name;
    node.querySelector('.plugin-card__version').textContent = `v${plugin.version}`;
    node.querySelector('.plugin-card__description').textContent = plugin.description;

    const meta = node.querySelector('.plugin-card__meta');
    [plugin.pluginId, plugin.signerKeyId ? `Signer ${plugin.signerKeyId}` : 'Signer unknown', plugin.publishedAt ? new Date(plugin.publishedAt).toLocaleString() : 'publishedAt 없음']
      .forEach((item) => {
        const span = document.createElement('span');
        span.textContent = item;
        meta.appendChild(span);
      });

    node.querySelector('.install-btn').addEventListener('click', () => openProtocol('install', plugin.pluginId));
    node.querySelector('.uninstall-btn').addEventListener('click', () => openProtocol('uninstall', plugin.pluginId));
    node.querySelector('.details-link').href = plugin.manifestUrl;

    list.appendChild(node);
  });
}

async function loadRegistry() {
  const registryUrl = document.getElementById('registry-url').value.trim();
  setStatus('레지스트리 불러오는 중...');

  try {
    const response = await fetch(registryUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const plugins = Array.isArray(payload.plugins) ? payload.plugins : [];
    renderPlugins(plugins);
    setStatus(`공식 플러그인 ${plugins.length}개`);
  } catch (error) {
    console.error(error);
    renderPlugins([]);
    setStatus('레지스트리 연결 실패', true);
  }
}

const config = loadConfig();
fillConfigFields(config);

document.getElementById('save-config-btn').addEventListener('click', () => {
  const next = {
    registryUrl: document.getElementById('registry-url').value.trim() || defaultConfig.registryUrl,
    protocolScheme: document.getElementById('protocol-scheme').value.trim() || defaultConfig.protocolScheme,
  };
  saveConfig(next);
  setStatus('설정을 저장했습니다.');
  loadRegistry();
});

document.getElementById('reload-btn').addEventListener('click', () => loadRegistry());
document.getElementById('open-app-btn').addEventListener('click', () => {
  const scheme = document.getElementById('protocol-scheme').value.trim() || defaultConfig.protocolScheme;
  window.location.href = `${scheme}://plugin/open`;
});

loadRegistry();

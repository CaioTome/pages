/**
 * MIZUHOME (水の家) — Motor Lógico & Interatividade da Ficha
 * Desenvolvido com base no sistema oficial e nas mecânicas de exportação e rolagem de dados
 */

// Estado Global da Ficha
const sheetState = {
    selectedClass: 'vanguarda',
    kamiPatrono: 'amaterasu',
    activeConditions: new Set(),
    deathSaves: 0,
    weapons: [],
    powers: [],
    items: [],
    diceHistory: [],
    theme: 'washi'
};

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderAllSkills();
    populateCatalogModals();
    loadSheet();
    calculateSheet();
    setupEventListeners();
});

// ==========================================================================
// 1. Tema Visual (Washi Xintoísta vs. Noite Espiritual)
// ==========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('mizuhome_theme') || 'washi';
    setTheme(savedTheme);
}

function toggleTheme() {
    const newTheme = document.body.classList.contains('dark-mode') ? 'washi' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    sheetState.theme = theme;
    localStorage.setItem('mizuhome_theme', theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Tema Washi';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Noite Espiritual';
    }
}

// ==========================================================================
// 2. Renderização de Perícias Dinâmicas
// ==========================================================================
function renderAllSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    MIZUHOME_DATA.pericias.forEach(pericia => {
        const row = document.createElement('div');
        row.className = 'skill-row';
        row.id = `skill-row-${pericia.id}`;
        row.dataset.attr = pericia.atributo;

        row.innerHTML = `
            <div class="skill-info">
                <input type="checkbox" id="skill-train-${pericia.id}" class="skill-checkbox" onchange="onSkillToggle('${pericia.id}')">
                <label for="skill-train-${pericia.id}" class="skill-name" title="${pericia.descricao}">${pericia.nome}</label>
                <span class="skill-attr-tag">${pericia.atributo.substring(0, 3).toUpperCase()}</span>
            </div>
            <div class="skill-actions">
                <span id="skill-bonus-${pericia.id}" class="skill-mod-badge">+0</span>
                <button type="button" class="btn btn-sm btn-roll-attr" onclick="rollSkillTest('${pericia.id}', '${pericia.nome}', '${pericia.atributo}')">
                    <i class="fa-solid fa-dice-d20"></i> Rolar
                </button>
            </div>
        `;
        container.appendChild(row);
    });
}

function onSkillToggle(skillId) {
    const row = document.getElementById(`skill-row-${skillId}`);
    const checkbox = document.getElementById(`skill-train-${skillId}`);
    if (checkbox && row) {
        if (checkbox.checked) {
            row.classList.add('trained');
        } else {
            row.classList.remove('trained');
        }
    }
    calculateSheet();
    saveSheet();
}

// ==========================================================================
// 3. Cálculos Dinâmicos do Sistema MIZUHOME
// ==========================================================================
function calculateSheet() {
    // 1. Atributos
    const forca = Math.max(1, parseInt(document.getElementById('attr-for')?.value) || 1);
    const agilidade = Math.max(1, parseInt(document.getElementById('attr-agi')?.value) || 1);
    const vigor = Math.max(1, parseInt(document.getElementById('attr-vig')?.value) || 1);
    const intelecto = Math.max(1, parseInt(document.getElementById('attr-int')?.value) || 1);
    const presenca = Math.max(1, parseInt(document.getElementById('attr-pre')?.value) || 1);

    // Validação de 10 Pontos Iniciais
    const totalPoints = forca + agilidade + vigor + intelecto + presenca;
    const pointsBadge = document.getElementById('attr-points-total');
    if (pointsBadge) {
        pointsBadge.innerText = `${totalPoints} / 10`;
        if (totalPoints === 10) {
            pointsBadge.className = 'points-badge valid';
        } else {
            pointsBadge.className = 'points-badge';
        }
    }

    // 2. Classe Selecionada & Fórmulas
    const classSelect = document.getElementById('char-class');
    const classId = classSelect ? classSelect.value : 'vanguarda';
    sheetState.selectedClass = classId;
    const classData = MIZUHOME_DATA.classes[classId] || MIZUHOME_DATA.classes.vanguarda;

    // PV Máximo: Vanguarda 32+(2xVIG), Erudito 26+VIG, Conjurador 22+VIG
    const extraHp = parseInt(document.getElementById('hp-extra')?.value) || 0;
    const basePv = classData.pvBase + (classData.pvVigorMultiplier * vigor) + extraHp;
    const hpMaxEl = document.getElementById('hp-max');
    if (hpMaxEl) hpMaxEl.innerText = basePv;

    let hpCurrentInput = document.getElementById('hp-current');
    if (hpCurrentInput) {
        if (hpCurrentInput.value === '' || isNaN(parseInt(hpCurrentInput.value))) {
            hpCurrentInput.value = basePv;
        }
        const currentHp = parseInt(hpCurrentInput.value);
        updateHealthStatus(currentHp, basePv);
    }

    // Estamina Máxima: Vanguarda 10+PRE, Erudito 11+PRE, Conjurador 12+PRE
    const extraStamina = parseInt(document.getElementById('stamina-extra')?.value) || 0;
    const baseStamina = classData.estaminaBase + presenca + extraStamina;
    const staminaMaxEl = document.getElementById('stamina-max');
    if (staminaMaxEl) staminaMaxEl.innerText = baseStamina;

    let staminaCurrentInput = document.getElementById('stamina-current');
    if (staminaCurrentInput) {
        if (staminaCurrentInput.value === '' || isNaN(parseInt(staminaCurrentInput.value))) {
            staminaCurrentInput.value = baseStamina;
        }
        const currentStamina = parseInt(staminaCurrentInput.value);
        updateStaminaStatus(currentStamina, baseStamina);
    }

    // Defesa Base: 10 + Agilidade (+2 se Vanguarda) + Bônus Escudo/Equipamento
    const defenseBonus = parseInt(document.getElementById('defense-bonus')?.value) || 0;
    const baseDefesa = 10 + agilidade + classData.defesaBaseBonus + defenseBonus;
    const defenseValEl = document.getElementById('defense-val');
    if (defenseValEl) defenseValEl.innerText = baseDefesa;

    // Deslocamento padrão = 9m
    const movementEl = document.getElementById('movement-val');
    if (movementEl && !movementEl.innerText) movementEl.innerText = "9m";

    // 3. Atualizar Bônus de Perícias (+5 se treinada)
    let trainedCount = 0;
    MIZUHOME_DATA.pericias.forEach(p => {
        const checkbox = document.getElementById(`skill-train-${p.id}`);
        const bonusEl = document.getElementById(`skill-bonus-${p.id}`);
        
        // Conjurador tem Conjuração obrigatória
        if (classId === 'conjurador' && p.id === 'conjuracao' && checkbox) {
            checkbox.checked = true;
            checkbox.disabled = true;
        } else if (checkbox && p.id === 'conjuracao' && classId !== 'conjurador') {
            checkbox.disabled = false;
        }

        if (checkbox && checkbox.checked) {
            trainedCount++;
            if (bonusEl) bonusEl.innerText = "+5";
        } else {
            if (bonusEl) bonusEl.innerText = "+0";
        }
    });

    const skillsCountEl = document.getElementById('skills-trained-count');
    if (skillsCountEl) {
        skillsCountEl.innerText = `${trainedCount} / ${classData.periciasIniciais} Treinadas`;
        if (trainedCount > classData.periciasIniciais) {
            skillsCountEl.style.color = 'var(--accent-red)';
        } else {
            skillsCountEl.style.color = 'var(--text-muted)';
        }
    }

    // 4. Inventário e Capacidade de Carga: Força x 5 (+3 se tiver Zukin de Viagem)
    let zukinExtra = 0;
    sheetState.items.forEach(item => {
        if (item.id === 'zukin' || (item.nome && item.nome.toLowerCase().includes('zukin'))) {
            zukinExtra += 3;
        }
    });
    const maxCapacity = (forca * 5) + zukinExtra;
    const capMaxEl = document.getElementById('inventory-capacity-max');
    if (capMaxEl) capMaxEl.innerText = maxCapacity;

    calculateCurrentLoad(maxCapacity);
}

// Atualizar Barra de Vida & Estado de Agonia
function updateHealthStatus(current, max) {
    const hpBar = document.getElementById('hp-bar');
    const statusText = document.getElementById('hp-status-text');
    const agoniaPanel = document.getElementById('agonia-panel');
    const pct = Math.max(0, Math.min(100, (current / max) * 100));

    if (hpBar) {
        hpBar.style.width = `${pct}%`;
        if (pct <= 0) {
            hpBar.style.background = '#212121';
        } else if (pct <= 25) {
            hpBar.style.background = '#c62828';
        } else if (pct <= 50) {
            hpBar.style.background = '#e65100';
        } else {
            hpBar.style.background = 'linear-gradient(90deg, #b54434 0%, #d85947 100%)';
        }
    }

    if (current <= 0) {
        if (statusText) {
            statusText.innerText = "Em Agonia (0 PV)";
            statusText.style.color = "#c62828";
        }
        if (agoniaPanel) agoniaPanel.classList.add('active');
        setConditionState('agonia', true);
    } else {
        if (statusText) {
            if (current === max) {
                statusText.innerText = "Saudável";
                statusText.style.color = "var(--accent-green)";
            } else {
                statusText.innerText = "Ferido";
                statusText.style.color = "var(--accent-amber)";
            }
        }
        if (agoniaPanel) agoniaPanel.classList.remove('active');
        setConditionState('agonia', false);
    }
}

// Atualizar Barra de Estamina
function updateStaminaStatus(current, max) {
    const staminaBar = document.getElementById('stamina-bar');
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    if (staminaBar) {
        staminaBar.style.width = `${pct}%`;
    }
}

// Modificadores Rápidos de PV e Estamina
function adjustVital(vital, delta) {
    const input = document.getElementById(`${vital}-current`);
    const maxEl = document.getElementById(`${vital}-max`);
    if (!input || !maxEl) return;

    const max = parseInt(maxEl.innerText) || 100;
    let current = parseInt(input.value) || 0;
    current = Math.max(0, Math.min(max, current + delta));
    input.value = current;

    if (vital === 'hp') {
        updateHealthStatus(current, max);
    } else if (vital === 'stamina') {
        updateStaminaStatus(current, max);
    }
    saveSheet();
}

// ==========================================================================
// 4. Controle de Condições e Agonia
// ==========================================================================
function toggleConditionBadge(badgeEl, conditionId) {
    const isActive = badgeEl.classList.toggle('active');
    if (isActive) {
        sheetState.activeConditions.add(conditionId);
        showToast(`Condição ativada: ${conditionId.toUpperCase()}`);
    } else {
        sheetState.activeConditions.delete(conditionId);
        showToast(`Condição removida: ${conditionId.toUpperCase()}`);
    }
    saveSheet();
}

function setConditionState(conditionId, state) {
    const badge = document.querySelector(`.badge[data-condition="${conditionId}"]`);
    if (badge) {
        if (state) {
            badge.classList.add('active');
            sheetState.activeConditions.add(conditionId);
        } else {
            badge.classList.remove('active');
            sheetState.activeConditions.delete(conditionId);
        }
    }
}

function isConditionActive(conditionId) {
    return sheetState.activeConditions.has(conditionId);
}

// Teste de Fortitude para Agonia
function rollAgoniaSave() {
    const vigor = Math.max(1, parseInt(document.getElementById('attr-vig')?.value) || 1);
    const fortitudeCheckbox = document.getElementById('skill-train-fortitude');
    const isTrained = fortitudeCheckbox ? fortitudeCheckbox.checked : false;
    const bonus = isTrained ? 5 : 0;

    const isPerturbado = isConditionActive('perturbado');
    const diceCount = Math.max(1, vigor - (isPerturbado ? 1 : 0));

    let rolls = [];
    for (let i = 0; i < diceCount; i++) {
        rolls.push(Math.floor(Math.random() * 20) + 1);
    }
    const maxRoll = Math.max(...rolls);
    const total = maxRoll + bonus;

    let resultMsg = "";
    if (maxRoll === 1) {
        sheetState.deathSaves = Math.min(3, sheetState.deathSaves + 2);
        resultMsg = `FALHA CRÍTICA (Dado 1)! +2 Falhas de Morte (${sheetState.deathSaves}/3)`;
    } else if (total < 10) {
        sheetState.deathSaves = Math.min(3, sheetState.deathSaves + 1);
        resultMsg = `Falha no teste! +1 Falha de Morte (${sheetState.deathSaves}/3)`;
    } else {
        resultMsg = `Sucesso no teste de estabilidade! Não acumulou falhas neste turno.`;
    }

    renderDeathSaves();

    if (sheetState.deathSaves >= 3) {
        resultMsg += `\n⚠️ O PERSONAGEM MORREU (3 Falhas Acumuladas).`;
    }

    showDiceModal({
        title: `Teste de Agonia (Fortitude)`,
        totalResult: total,
        breakdown: `Dados: [${rolls.join(', ')}] (Maior: ${maxRoll}) + Fortitude: ${bonus} = ${total}`,
        details: resultMsg,
        isCrit: maxRoll === 20,
        isFumble: maxRoll === 1
    });

    saveSheet();
}

function toggleDeathSaveCircle(index) {
    if (sheetState.deathSaves === index + 1) {
        sheetState.deathSaves = index;
    } else {
        sheetState.deathSaves = index + 1;
    }
    renderDeathSaves();
    saveSheet();
}

function renderDeathSaves() {
    for (let i = 0; i < 3; i++) {
        const circle = document.getElementById(`death-save-${i}`);
        if (circle) {
            if (i < sheetState.deathSaves) {
                circle.classList.add('filled');
            } else {
                circle.classList.remove('filled');
            }
        }
    }
}

function stabilizeCharacter() {
    adjustVital('hp', 1);
    sheetState.deathSaves = 0;
    renderDeathSaves();
    showToast("Personagem estabilizado com 1 PV!");
}

// ==========================================================================
// 5. Motor de Rolagem de Dados (Dice Roller)
// ==========================================================================
function rollSkillTest(skillId, skillName, attrName) {
    const attrVal = Math.max(1, parseInt(document.getElementById(`attr-${attrName.substring(0, 3)}`)?.value) || 1);
    const checkbox = document.getElementById(`skill-train-${skillId}`);
    const isTrained = checkbox ? checkbox.checked : false;
    const bonus = isTrained ? 5 : 0;

    const isPerturbado = isConditionActive('perturbado');
    const diceCount = Math.max(1, attrVal - (isPerturbado ? 1 : 0));

    let rolls = [];
    for (let i = 0; i < diceCount; i++) {
        rolls.push(Math.floor(Math.random() * 20) + 1);
    }
    const maxRoll = Math.max(...rolls);
    const total = maxRoll + bonus;

    let pertNote = isPerturbado ? " (Penalidade -1 dado por Perturbado)" : "";

    showDiceModal({
        title: `Teste de ${skillName} (${attrName.toUpperCase()})`,
        totalResult: total,
        breakdown: `Rolagem: ${diceCount}d20${pertNote} → [${rolls.join(', ')}] | Maior: ${maxRoll} + Bônus: ${bonus}`,
        details: maxRoll === 20 ? "⭐ CRÍTICO NATURAL (20)! Dobro de efeito/dano se aplicável!" : (maxRoll === 1 ? "💀 FALHA CRÍTICA (1)!" : ""),
        isCrit: maxRoll === 20,
        isFumble: maxRoll === 1
    });

    logDiceRoll(`Teste ${skillName}`, total, `[${rolls.join(', ')}] + ${bonus}`);
}

function rollPureAttribute(attrKey, attrTitle) {
    const attrVal = Math.max(1, parseInt(document.getElementById(`attr-${attrKey}`)?.value) || 1);
    const isPerturbado = isConditionActive('perturbado');
    const diceCount = Math.max(1, attrVal - (isPerturbado ? 1 : 0));

    let rolls = [];
    for (let i = 0; i < diceCount; i++) {
        rolls.push(Math.floor(Math.random() * 20) + 1);
    }
    const maxRoll = Math.max(...rolls);
    let pertNote = isPerturbado ? " (-1 dado por Perturbado)" : "";

    showDiceModal({
        title: `Teste Puro de ${attrTitle}`,
        totalResult: maxRoll,
        breakdown: `Rolagem: ${diceCount}d20${pertNote} → [${rolls.join(', ')}]`,
        details: maxRoll === 20 ? "⭐ CRÍTICO NATURAL (20)!" : (maxRoll === 1 ? "💀 FALHA CRÍTICA (1)!" : ""),
        isCrit: maxRoll === 20,
        isFumble: maxRoll === 1
    });

    logDiceRoll(`Atributo ${attrTitle}`, maxRoll, `[${rolls.join(', ')}]`);
}

function rollFormula(formulaStr, label = "Dano", isCritDouble = false) {
    if (!formulaStr) return;
    const cleanFormula = formulaStr.trim();
    const regex = /(\d+)?d(\d+)(?:\s*([+-])\s*(\d+))?/i;
    const match = cleanFormula.match(regex);

    if (!match) {
        showToast("Fórmula de dados inválida");
        return;
    }

    let numDice = parseInt(match[1]) || 1;
    const diceSides = parseInt(match[2]) || 6;
    const sign = match[3];
    const modVal = match[4] ? parseInt(match[4]) : 0;
    let formulaMod = 0;
    if (sign === '+') formulaMod = modVal;
    if (sign === '-') formulaMod = -modVal;

    let rolls = [];
    let sum = 0;
    for (let i = 0; i < numDice; i++) {
        const r = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(r);
        sum += r;
    }

    let total = Math.max(0, sum + formulaMod);
    let critText = "";
    if (isCritDouble) {
        total = total * 2;
        critText = " (DOBRADO POR 20 NATURAL!)";
    }

    showDiceModal({
        title: `${label}: ${cleanFormula}${critText}`,
        totalResult: total,
        breakdown: `Dados (${numDice}d${diceSides}): [${rolls.join(', ')}] = ${sum} ${formulaMod !== 0 ? `| Modificador: ${formulaMod >= 0 ? '+' : ''}${formulaMod}` : ''}`,
        details: isCritDouble ? "⭐ DANO CRÍTICO DUPLICADO PELO 20 NATURAL!" : "",
        isCrit: isCritDouble
    });

    logDiceRoll(label, total, `[${rolls.join(', ')}] ${formulaMod !== 0 ? (formulaMod > 0 ? '+' + formulaMod : formulaMod) : ''}`);
}

function showDiceModal({ title, totalResult, breakdown, details, isCrit, isFumble }) {
    document.getElementById('modal-dice-title').innerText = title;
    const numberEl = document.getElementById('modal-dice-result-number');
    numberEl.innerText = totalResult;
    numberEl.className = 'dice-result-number';
    if (isCrit) numberEl.classList.add('nat-20');
    if (isFumble) numberEl.classList.add('nat-1');

    document.getElementById('modal-dice-breakdown').innerText = breakdown || '';
    document.getElementById('modal-dice-details').innerText = details || '';

    const overlay = document.getElementById('dice-result-modal');
    if (overlay) overlay.classList.add('active');
}

function closeDiceModal() {
    const overlay = document.getElementById('dice-result-modal');
    if (overlay) overlay.classList.remove('active');
}

function openQuickRoller() {
    document.getElementById('quick-roller-modal').classList.add('active');
}

function closeQuickRoller() {
    document.getElementById('quick-roller-modal').classList.remove('active');
}

function executeFreeRoll(sides) {
    const count = parseInt(document.getElementById('free-dice-count')?.value) || 1;
    const mod = parseInt(document.getElementById('free-dice-mod')?.value) || 0;

    let rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        rolls.push(r);
        sum += r;
    }
    const total = sum + mod;
    closeQuickRoller();

    showDiceModal({
        title: `Rolagem Livre (${count}d${sides}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''})`,
        totalResult: total,
        breakdown: `Dados: [${rolls.join(', ')}] = ${sum} | Mod: ${mod >= 0 ? '+' : ''}${mod}`,
        details: ""
    });

    logDiceRoll(`Livre ${count}d${sides}`, total, `[${rolls.join(', ')}] + ${mod}`);
}

function logDiceRoll(label, total, details) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem = { label, total, details, timestamp };
    sheetState.diceHistory.unshift(logItem);
    if (sheetState.diceHistory.length > 20) sheetState.diceHistory.pop();
    renderDiceHistory();
}

function renderDiceHistory() {
    const list = document.getElementById('dice-history-list');
    if (!list) return;
    list.innerHTML = '';
    sheetState.diceHistory.forEach(item => {
        const div = document.createElement('div');
        div.style.padding = '6px 8px';
        div.style.borderBottom = '1px solid var(--border-color)';
        div.style.fontSize = '0.8rem';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--accent-red);">
                <span>${item.label}</span>
                <span style="font-family:var(--font-mono); font-size:0.95rem;">${item.total}</span>
            </div>
            <div style="color:var(--text-muted); font-size:0.75rem;">${item.details} <span style="float:right; opacity:0.7;">${item.timestamp}</span></div>
        `;
        list.appendChild(div);
    });
}

// ==========================================================================
// 6. Gerenciador de Armas & Ataques
// ==========================================================================
function renderWeapons() {
    const tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (sheetState.weapons.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:16px;">Nenhuma arma equipada. Clique em "+ Arma do Catálogo" ou adicione manualmente.</td></tr>`;
        return;
    }

    sheetState.weapons.forEach((w, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="text" class="weapon-name" value="${w.nome || ''}" placeholder="Nome da Arma" onchange="updateWeapon(${index}, 'nome', this.value)">
                <div style="font-size:0.72rem; color:var(--text-muted);">${w.tipo || 'Corpo a corpo'}</div>
            </td>
            <td>
                <select class="weapon-attr" onchange="updateWeapon(${index}, 'atributo', this.value)">
                    <option value="forca" ${w.atributo === 'forca' ? 'selected' : ''}>Força (FOR)</option>
                    <option value="agilidade" ${w.atributo === 'agilidade' ? 'selected' : ''}>Agilidade (AGI)</option>
                    <option value="presenca" ${w.atributo === 'presenca' ? 'selected' : ''}>Presença (PRE)</option>
                </select>
            </td>
            <td>
                <input type="text" class="weapon-dmg" value="${w.dano || '1d6'}" placeholder="ex: 1d10" onchange="updateWeapon(${index}, 'dano', this.value)">
                <div style="font-size:0.72rem; color:var(--text-muted);">${w.tipoDano || ''}</div>
            </td>
            <td>
                <span style="font-size:0.8rem;">${w.alcance || 'Adj.'}</span>
                ${w.municaoMax > 0 ? `
                    <div style="display:flex; align-items:center; gap:4px; margin-top:4px;">
                        <button type="button" class="btn btn-sm" onclick="adjustWeaponAmmo(${index}, -1)">-</button>
                        <span style="font-family:var(--font-mono); font-weight:bold;">${w.municaoAtual}/${w.municaoMax}</span>
                        <button type="button" class="btn btn-sm" onclick="adjustWeaponAmmo(${index}, 1)">+</button>
                        <button type="button" class="btn btn-sm" title="Recarregar" onclick="reloadWeaponAmmo(${index})"><i class="fa-solid fa-arrows-rotate"></i></button>
                    </div>
                ` : ''}
            </td>
            <td>
                <span style="font-family:var(--font-mono);">${w.espaco || 1} esp</span>
            </td>
            <td>
                <div style="display:flex; gap:4px;">
                    <button type="button" class="btn btn-sm btn-primary" onclick="rollWeaponAttack(${index})" title="Rolar Teste de Ataque"><i class="fa-solid fa-crosshairs"></i> Ataque</button>
                    <button type="button" class="btn btn-sm btn-gold" onclick="rollWeaponDamage(${index})" title="Rolar Dano"><i class="fa-solid fa-burst"></i> Dano</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeWeapon(${index})" title="Remover"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addWeapon(weaponData = {}) {
    const defaultWeapon = {
        nome: "Katana",
        tipo: "Corpo a corpo (versátil)",
        atributo: "forca",
        pericia: "luta",
        alcance: "Adjacente",
        dano: "1d10",
        tipoDano: "cortante",
        espaco: 3,
        municaoMax: 0,
        municaoAtual: 0
    };
    sheetState.weapons.push(Object.assign({}, defaultWeapon, weaponData));
    renderWeapons();
    calculateSheet();
    saveSheet();
}

function updateWeapon(index, field, value) {
    if (sheetState.weapons[index]) {
        sheetState.weapons[index][field] = value;
        calculateSheet();
        saveSheet();
    }
}

function removeWeapon(index) {
    sheetState.weapons.splice(index, 1);
    renderWeapons();
    calculateSheet();
    saveSheet();
}

function adjustWeaponAmmo(index, delta) {
    const w = sheetState.weapons[index];
    if (w && w.municaoMax > 0) {
        w.municaoAtual = Math.max(0, Math.min(w.municaoMax, w.municaoAtual + delta));
        renderWeapons();
        saveSheet();
    }
}

function reloadWeaponAmmo(index) {
    const w = sheetState.weapons[index];
    if (w && w.municaoMax > 0) {
        w.municaoAtual = w.municaoMax;
        renderWeapons();
        showToast(`Arma ${w.nome} recarregada para 15 munições!`);
        saveSheet();
    }
}

function rollWeaponAttack(index) {
    const w = sheetState.weapons[index];
    if (!w) return;

    if (w.municaoMax > 0 && w.municaoAtual <= 0) {
        showToast("⚠️ Sem munição! Recarregue a arma antes de atacar.");
        return;
    }
    if (w.municaoMax > 0) {
        w.municaoAtual = Math.max(0, w.municaoAtual - 1);
        renderWeapons();
    }

    const attrName = w.atributo || (w.tipo.toLowerCase().includes('tiro') || w.tipo.toLowerCase().includes('distância') || w.tipo.toLowerCase().includes('arremesso') ? 'agilidade' : 'forca');
    const skillName = (attrName === 'agilidade' || w.tipo.toLowerCase().includes('tiro')) ? 'pontaria' : 'luta';

    const attrVal = Math.max(1, parseInt(document.getElementById(`attr-${attrName.substring(0, 3)}`)?.value) || 1);
    const checkbox = document.getElementById(`skill-train-${skillName}`);
    const isTrained = checkbox ? checkbox.checked : false;
    const bonus = isTrained ? 5 : 0;

    const isPerturbado = isConditionActive('perturbado');
    const diceCount = Math.max(1, attrVal - (isPerturbado ? 1 : 0));

    let rolls = [];
    for (let i = 0; i < diceCount; i++) {
        rolls.push(Math.floor(Math.random() * 20) + 1);
    }
    const maxRoll = Math.max(...rolls);
    const total = maxRoll + bonus;

    let critNote = "";
    if (maxRoll === 20) {
        critNote = "⭐ CRÍTICO NATURAL (20)! O dano desta arma é DOBRADO!";
    }

    showDiceModal({
        title: `Ataque com ${w.nome} (${skillName.toUpperCase()})`,
        totalResult: total,
        breakdown: `Rolagem: ${diceCount}d20 → [${rolls.join(', ')}] | Maior: ${maxRoll} + Bônus: ${bonus}`,
        details: critNote,
        isCrit: maxRoll === 20,
        isFumble: maxRoll === 1
    });

    logDiceRoll(`Ataque ${w.nome}`, total, `[${rolls.join(', ')}] + ${bonus}`);
}

function rollWeaponDamage(index) {
    const w = sheetState.weapons[index];
    if (!w) return;
    rollFormula(w.dano || "1d6", `Dano de ${w.nome}`);
}

// ==========================================================================
// 7. Gerenciador de Poderes Divinos (MIZUHOME — Poderes)
// ==========================================================================
function renderPowers() {
    const container = document.getElementById('powers-container');
    if (!container) return;
    container.innerHTML = '';

    if (sheetState.powers.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">Nenhum poder adicionado. Clique em "+ Poder do Catálogo Divino" para adicionar os poderes dos Kamis.</div>`;
        return;
    }

    sheetState.powers.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = `power-card ${p.tipo ? p.tipo.toLowerCase() : 'ativo'}`;
        card.innerHTML = `
            <div class="power-header">
                <div>
                    <span class="power-title">${p.nome}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${p.tipo || 'Ativo'} • ${p.acao || 'Ação Padrão'})</span>
                </div>
                <span class="power-cost-badge"><i class="fa-solid fa-fire-flame-curved"></i> Custo: ${p.custo || 1} Estamina</span>
            </div>
            <div class="power-desc">${p.efeito || ''}</div>
            <div class="power-footer">
                <span><strong>Rolagem:</strong> ${p.atributo ? p.atributo.toUpperCase() : 'PRE'} + ${p.pericia ? p.pericia.toUpperCase() : 'CONJURAÇÃO'}</span>
                <div style="display:flex; gap:6px;">
                    <button type="button" class="btn btn-sm btn-spirit" onclick="castPower(${index})"><i class="fa-solid fa-wand-magic-sparkles"></i> Conjurar / Testar</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removePower(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addPower(powerData) {
    sheetState.powers.push(powerData);
    renderPowers();
    saveSheet();
    showToast(`Poder adicionado: ${powerData.nome}`);
}

function removePower(index) {
    sheetState.powers.splice(index, 1);
    renderPowers();
    saveSheet();
}

function castPower(index) {
    const p = sheetState.powers[index];
    if (!p) return;

    // Verificar Estamina
    const staminaInput = document.getElementById('stamina-current');
    const currentStamina = staminaInput ? parseInt(staminaInput.value) || 0 : 0;
    const cost = parseInt(p.custo) || 0;

    if (currentStamina < cost) {
        showToast(`⚠️ Estamina insuficiente (${currentStamina}/${cost}) para conjurar ${p.nome}!`);
    } else {
        adjustVital('stamina', -cost);
        showToast(`Estamina gasta: -${cost} PE`);
    }

    // Executar Rolagem associada
    const attrName = p.atributo || 'presenca';
    const skillName = p.pericia || 'conjuracao';
    rollSkillTest(skillName, `${p.nome} (${p.tipo})`, attrName);
}

// ==========================================================================
// 8. Gerenciador de Inventário & Capacidade de Carga
// ==========================================================================
function renderItems() {
    const tbody = document.getElementById('items-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (sheetState.items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:16px;">Inventário vazio. Adicione itens básicos ou itens customizados.</td></tr>`;
        return;
    }

    sheetState.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="text" value="${item.nome || ''}" placeholder="Nome do Item" onchange="updateItem(${index}, 'nome', this.value)">
                <div style="font-size:0.75rem; color:var(--text-muted);">${item.descricao || ''}</div>
            </td>
            <td>
                <input type="number" value="${item.quantidade || 1}" min="1" style="width:50px !important;" onchange="updateItem(${index}, 'quantidade', parseInt(this.value))">
            </td>
            <td>
                <span style="font-family:var(--font-mono);">${item.espaco || 1} esp</span>
            </td>
            <td>
                <div style="display:flex; gap:4px;">
                    ${item.recupera ? `<button type="button" class="btn btn-sm btn-spirit" onclick="useItemAction(${index})"><i class="fa-solid fa-heart-pulse"></i> Usar</button>` : ''}
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addItem(itemData) {
    sheetState.items.push(Object.assign({ quantidade: 1, espaco: 1 }, itemData));
    renderItems();
    calculateSheet();
    saveSheet();
    showToast(`Item adicionado: ${itemData.nome}`);
}

function updateItem(index, field, value) {
    if (sheetState.items[index]) {
        sheetState.items[index][field] = value;
        calculateSheet();
        saveSheet();
    }
}

function removeItem(index) {
    sheetState.items.splice(index, 1);
    renderItems();
    calculateSheet();
    saveSheet();
}

function calculateCurrentLoad(maxCapacity) {
    let totalLoad = 0;
    // Carga das armas
    sheetState.weapons.forEach(w => {
        totalLoad += (parseFloat(w.espaco) || 0);
    });
    // Carga dos itens
    sheetState.items.forEach(item => {
        totalLoad += (parseFloat(item.espaco) || 0) * (parseInt(item.quantidade) || 1);
    });

    const loadCurrentEl = document.getElementById('inventory-capacity-current');
    const loadBar = document.getElementById('inventory-load-bar');
    if (loadCurrentEl) loadCurrentEl.innerText = totalLoad.toFixed(1);

    if (loadBar) {
        const pct = Math.min(100, (totalLoad / maxCapacity) * 100);
        loadBar.style.width = `${pct}%`;
        if (totalLoad > maxCapacity) {
            loadBar.style.background = '#c62828';
            showToast("⚠️ Sobrecarga de inventário! Excedendo o limite de Força.");
        } else {
            loadBar.style.background = 'var(--accent-gold)';
        }
    }
}

function useItemAction(index) {
    const item = sheetState.items[index];
    if (!item) return;

    if (item.id === 'cicatrizante' || item.id === 'primeiros_socorros') {
        rollFormula(item.recupera, `Cura de ${item.nome}`);
        if (item.consumivel) {
            if (item.quantidade > 1) {
                item.quantidade--;
            } else {
                sheetState.items.splice(index, 1);
            }
            renderItems();
            calculateSheet();
            saveSheet();
        }
    } else if (item.id === 'amuleto_estamina') {
        rollFormula("1d4+2", `Recuperação de Estamina (${item.nome})`);
    } else {
        showToast(`Item usado: ${item.nome}`);
    }
}

// ==========================================================================
// 9. Modais de Catálogo (Kamis, Armas, Itens Básicos)
// ==========================================================================
function populateCatalogModals() {
    // 1. Catálogo de Poderes Divinos
    const kamiCatalogContainer = document.getElementById('kami-catalog-list');
    if (kamiCatalogContainer) {
        kamiCatalogContainer.innerHTML = '';
        Object.values(MIZUHOME_DATA.kamis).forEach(kami => {
            const section = document.createElement('div');
            section.style.marginBottom = '20px';
            section.innerHTML = `
                <h3 style="font-family:var(--font-title); color:var(--accent-red); border-bottom:1px solid var(--border-color); padding-bottom:4px; margin-bottom:10px;">
                    ${kami.nome} <span style="font-family:var(--font-kanji); color:var(--accent-gold); font-size:0.95rem;">${kami.nomeJp}</span>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-family:var(--font-sub); font-weight:normal; display:block;">${kami.titulo}</span>
                </h3>
            `;
            const powersList = document.createElement('div');
            powersList.style.display = 'grid';
            powersList.style.gap = '8px';

            kami.poderes.forEach(p => {
                const itemDiv = document.createElement('div');
                itemDiv.style.background = 'var(--bg-input)';
                itemDiv.style.border = '1px solid var(--border-color)';
                itemDiv.style.borderRadius = 'var(--radius-sm)';
                itemDiv.style.padding = '10px';
                itemDiv.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <strong style="color:var(--accent-red);">${p.nome}</strong>
                        <span class="power-cost-badge">${p.custo} PE (${p.tipo})</span>
                    </div>
                    <p style="font-size:0.82rem; color:var(--text-main); margin-bottom:6px;">${p.efeito}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted);">
                        <span>Rolagem: ${p.atributo.toUpperCase()} + ${p.pericia.toUpperCase()}</span>
                        <button type="button" class="btn btn-sm btn-primary" onclick="addPowerFromCatalog('${kami.id}', '${p.id}')">+ Adicionar à Ficha</button>
                    </div>
                `;
                powersList.appendChild(itemDiv);
            });
            section.appendChild(powersList);
            kamiCatalogContainer.appendChild(section);
        });
    }

    // 2. Catálogo de Armamentos
    const weaponCatalogContainer = document.getElementById('weapon-catalog-list');
    if (weaponCatalogContainer) {
        weaponCatalogContainer.innerHTML = '';
        MIZUHOME_DATA.armas.forEach(w => {
            const row = document.createElement('div');
            row.style.background = 'var(--bg-input)';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-sm)';
            row.style.padding = '8px 12px';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.marginBottom = '6px';
            row.innerHTML = `
                <div>
                    <strong style="color:var(--accent-red);">${w.nome}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${w.tipo} • ${w.alcance})</span>
                    <div style="font-size:0.8rem;">Dano: <strong>${w.dano}</strong> (${w.tipoDano}) | Espaço: ${w.espaco}</div>
                </div>
                <button type="button" class="btn btn-sm btn-primary" onclick="addWeaponFromCatalog('${w.id}')">+ Equipar</button>
            `;
            weaponCatalogContainer.appendChild(row);
        });
    }

    // 3. Catálogo de Itens Básicos
    const itemCatalogContainer = document.getElementById('item-catalog-list');
    if (itemCatalogContainer) {
        itemCatalogContainer.innerHTML = '';
        MIZUHOME_DATA.itensBasicos.forEach(item => {
            const row = document.createElement('div');
            row.style.background = 'var(--bg-input)';
            row.style.border = '1px solid var(--border-color)';
            row.style.borderRadius = 'var(--radius-sm)';
            row.style.padding = '8px 12px';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.marginBottom = '6px';
            row.innerHTML = `
                <div>
                    <strong style="color:var(--accent-red);">${item.nome}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${item.espaco} esp)</span>
                    <div style="font-size:0.8rem; color:var(--text-main);">${item.descricao}</div>
                </div>
                <button type="button" class="btn btn-sm btn-primary" onclick="addItemFromCatalog('${item.id}')">+ Guardar</button>
            `;
            itemCatalogContainer.appendChild(row);
        });
    }
}

function openCatalogModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeCatalogModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function addPowerFromCatalog(kamiId, powerId) {
    const kami = MIZUHOME_DATA.kamis[kamiId];
    if (kami) {
        const power = kami.poderes.find(p => p.id === powerId);
        if (power) {
            addPower(Object.assign({}, power, { kami: kami.nome }));
            closeCatalogModal('powers-catalog-modal');
        }
    }
}

function addWeaponFromCatalog(weaponId) {
    const weapon = MIZUHOME_DATA.armas.find(w => w.id === weaponId);
    if (weapon) {
        addWeapon(Object.assign({}, weapon));
        closeCatalogModal('weapons-catalog-modal');
    }
}

function addItemFromCatalog(itemId) {
    const item = MIZUHOME_DATA.itensBasicos.find(i => i.id === itemId);
    if (item) {
        addItem(Object.assign({}, item));
        closeCatalogModal('items-catalog-modal');
    }
}

// ==========================================================================
// 10. Descanso Curto & Descanso Longo
// ==========================================================================
function performShortRest() {
    const maxStamina = parseInt(document.getElementById('stamina-max')?.innerText) || 12;
    const currentStamina = parseInt(document.getElementById('stamina-current')?.value) || 0;
    const recovered = Math.ceil(maxStamina / 2);
    const newStamina = Math.min(maxStamina, currentStamina + recovered);
    document.getElementById('stamina-current').value = newStamina;
    updateStaminaStatus(newStamina, maxStamina);
    showToast(`Descanso Curto concluído: +${recovered} Estamina recuperada!`);
    saveSheet();
}

function performLongRest() {
    const maxHp = parseInt(document.getElementById('hp-max')?.innerText) || 30;
    const maxStamina = parseInt(document.getElementById('stamina-max')?.innerText) || 12;
    document.getElementById('hp-current').value = maxHp;
    document.getElementById('stamina-current').value = maxStamina;
    sheetState.deathSaves = 0;
    renderDeathSaves();
    updateHealthStatus(maxHp, maxHp);
    updateStaminaStatus(maxStamina, maxStamina);
    showToast(`Descanso Longo concluído: PV e Estamina totalmente restaurados!`);
    saveSheet();
}

// ==========================================================================
// 11. Salvar, Carregar, Exportar e Importar JSON
// ==========================================================================
function saveSheet() {
    const form = document.getElementById('character-sheet');
    if (!form) return;
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    data.trainedSkills = [];
    MIZUHOME_DATA.pericias.forEach(p => {
        const cb = document.getElementById(`skill-train-${p.id}`);
        if (cb && cb.checked) {
            data.trainedSkills.push(p.id);
        }
    });

    data.weapons = sheetState.weapons;
    data.powers = sheetState.powers;
    data.items = sheetState.items;
    data.activeConditions = Array.from(sheetState.activeConditions);
    data.deathSaves = sheetState.deathSaves;
    data.theme = sheetState.theme;

    localStorage.setItem('mizuhome_character_sheet', JSON.stringify(data));
}

function loadSheet() {
    const saved = localStorage.getItem('mizuhome_character_sheet');
    if (!saved) {
        addWeapon(MIZUHOME_DATA.armas[4]); // Katana
        addPower(MIZUHOME_DATA.kamis.amaterasu.poderes[0]); // Luz Purificadora
        addItem(MIZUHOME_DATA.itensBasicos[6]); // Primeiros Socorros
        return;
    }

    try {
        const data = JSON.parse(saved);

        Object.keys(data).forEach(key => {
            const el = document.getElementById(`char-${key}`) || document.getElementById(`attr-${key}`) || document.getElementsByName(key)[0];
            if (el && typeof data[key] !== 'object') {
                el.value = data[key];
            }
        });

        if (data.trainedSkills && Array.isArray(data.trainedSkills)) {
            data.trainedSkills.forEach(skillId => {
                const cb = document.getElementById(`skill-train-${skillId}`);
                if (cb) cb.checked = true;
                const row = document.getElementById(`skill-row-${skillId}`);
                if (row) row.classList.add('trained');
            });
        }

        sheetState.weapons = data.weapons || [];
        sheetState.powers = data.powers || [];
        sheetState.items = data.items || [];
        sheetState.deathSaves = data.deathSaves || 0;

        renderWeapons();
        renderPowers();
        renderItems();
        renderDeathSaves();

        sheetState.activeConditions.clear();
        if (data.activeConditions && Array.isArray(data.activeConditions)) {
            data.activeConditions.forEach(cond => {
                setConditionState(cond, true);
            });
        }
    } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
    }
}

function exportJSON() {
    saveSheet();
    const dataStr = localStorage.getItem('mizuhome_character_sheet');
    const charName = document.getElementById('char-name')?.value || 'semikami';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `mizuhome_ficha_${charName.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Ficha exportada em formato JSON!");
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('mizuhome_character_sheet', JSON.stringify(data));
            loadSheet();
            calculateSheet();
            showToast("Ficha importada com sucesso!");
        } catch (err) {
            alert("Erro ao ler o arquivo JSON fornecido.");
        }
    };
    reader.readAsText(file);
}

function resetSheet() {
    if (confirm("Deseja criar um novo personagem e resetar a ficha atual? Certifique-se de exportar seu backup em JSON antes.")) {
        localStorage.removeItem('mizuhome_character_sheet');
        location.reload();
    }
}

function printSheet() {
    window.print();
}

function switchTab(tabName, btnEl) {
    document.querySelectorAll('.quick-nav-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.querySelectorAll('.card[data-tab]').forEach(card => {
        if (tabName === 'all' || card.dataset.tab === tabName) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-torii-gate" style="color:var(--accent-red)"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3200);
}

function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDiceModal();
            closeQuickRoller();
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
    });
}

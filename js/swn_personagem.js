/**
 * STARS WITHOUT NUMBER (Inúmeras Estrelas) — Motor Lógico da Ficha de Personagem
 */

// Grupos Oficiais de Perícias de Stars Without Number Traduzidos por Atributo
const SKILL_GROUPS = [
    {
        title: "Força (FOR)",
        skills: [
            { id: "punch", name: "Briga (Desarmado)", defaultAttr: "str" },
            { id: "stab", name: "Armas Brancas (Stab)", defaultAttr: "str" },
            { id: "exert", name: "Esforço Físico", defaultAttr: "str" },
            { id: "work", name: "Ofício / Trabalho", defaultAttr: "str" }
        ]
    },
    {
        title: "Destreza (DES)",
        skills: [
            { id: "sneak", name: "Furtividade", defaultAttr: "dex" },
            { id: "pilot", name: "Pilotagem", defaultAttr: "dex" },
            { id: "shoot", name: "Pontaria (Armas)", defaultAttr: "dex" }
        ]
    },
    {
        title: "Inteligência (INT)",
        skills: [
            { id: "admin", name: "Administração", defaultAttr: "int" },
            { id: "know", name: "Conhecimento", defaultAttr: "int" },
            { id: "heal", name: "Cura", defaultAttr: "int" },
            { id: "program", name: "Programação", defaultAttr: "int" },
            { id: "fix", name: "Reparo", defaultAttr: "int" }
        ]
    },
    {
        title: "Sabedoria (SAB)",
        skills: [
            { id: "notice", name: "Percepção", defaultAttr: "wis" },
            { id: "survive", name: "Sobrevivência", defaultAttr: "wis" }
        ]
    },
    {
        title: "Carisma (CAR)",
        skills: [
            { id: "trade", name: "Comércio", defaultAttr: "cha" },
            { id: "connect", name: "Conexões", defaultAttr: "cha" },
            { id: "lead", name: "Liderança", defaultAttr: "cha" },
            { id: "perform", name: "Performance", defaultAttr: "cha" },
            { id: "talk", name: "Persuasão / Conversa", defaultAttr: "cha" }
        ]
    },
    {
        title: "Perícias Psíquicas (Psionismo)",
        psychicGroup: true,
        skills: [
            { id: "biopsionics", name: "Biopsionismo", defaultAttr: "wis", psychic: true },
            { id: "metapsionics", name: "Metapsionismo", defaultAttr: "wis", psychic: true },
            { id: "precognition", name: "Precognição", defaultAttr: "wis", psychic: true },
            { id: "telekinesis", name: "Telecinese", defaultAttr: "wis", psychic: true },
            { id: "telepathy", name: "Telepatia", defaultAttr: "wis", psychic: true },
            { id: "teleportation", name: "Teletransporte", defaultAttr: "wis", psychic: true }
        ]
    }
];

const SKILLS_LIST = SKILL_GROUPS.flatMap(g => g.skills);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    loadSheet();
    calculateSheet();

    const form = document.getElementById('character-sheet');
    if (form) {
        form.addEventListener('input', () => {
            calculateSheet();
            saveSheet();
        });
    }
});

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    SKILL_GROUPS.forEach(group => {
        const header = document.createElement('div');
        header.className = `skill-group-title ${group.psychicGroup ? 'psychic-title' : ''}`;
        header.innerText = group.title;
        container.appendChild(header);

        group.skills.forEach(skill => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.innerHTML = `
                <button type="button" class="skill-name-btn" onclick="rollSkill('${skill.name}', '${skill.id}')">
                    <span>${skill.name}</span>
                </button>
                <select id="skill-lvl-${skill.id}" class="skill-level-select" onchange="calculateSheet(); saveSheet();">
                    <option value="-2">Sem Treino (-2)</option>
                    <option value="0">Nível 0 (+0)</option>
                    <option value="1">Nível 1 (+1)</option>
                    <option value="2">Nível 2 (+2)</option>
                    <option value="3">Nível 3 (+3)</option>
                    <option value="4">Nível 4 (+4)</option>
                </select>
            `;
            container.appendChild(div);
        });
    });
}

function getModifier(score) {
    score = parseInt(score) || 10;
    if (score <= 3) return -2;
    if (score <= 7) return -1;
    if (score <= 13) return 0;
    if (score <= 17) return +1;
    return +2;
}

function calculateSheet() {
    const str = parseInt(document.getElementById('attr-str')?.value) || 10;
    const dex = parseInt(document.getElementById('attr-dex')?.value) || 10;
    const con = parseInt(document.getElementById('attr-con')?.value) || 10;
    const int = parseInt(document.getElementById('attr-int')?.value) || 10;
    const wis = parseInt(document.getElementById('attr-wis')?.value) || 10;
    const cha = parseInt(document.getElementById('attr-cha')?.value) || 10;

    const modStr = getModifier(str);
    const modDex = getModifier(dex);
    const modCon = getModifier(con);
    const modInt = getModifier(int);
    const modWis = getModifier(wis);
    const modCha = getModifier(cha);

    const elModStr = document.getElementById('mod-str'); if (elModStr) elModStr.innerText = (modStr >= 0 ? '+' : '') + modStr;
    const elModDex = document.getElementById('mod-dex'); if (elModDex) elModDex.innerText = (modDex >= 0 ? '+' : '') + modDex;
    const elModCon = document.getElementById('mod-con'); if (elModCon) elModCon.innerText = (modCon >= 0 ? '+' : '') + modCon;
    const elModInt = document.getElementById('mod-int'); if (elModInt) elModInt.innerText = (modInt >= 0 ? '+' : '') + modInt;
    const elModWis = document.getElementById('mod-wis'); if (elModWis) elModWis.innerText = (modWis >= 0 ? '+' : '') + modWis;
    const elModCha = document.getElementById('mod-cha'); if (elModCha) elModCha.innerText = (modCha >= 0 ? '+' : '') + modCha;

    const level = parseInt(document.getElementById('char-level')?.value) || 1;

    const physSave = Math.max(1, 16 - level - Math.max(modStr, modCon));
    const evasSave = Math.max(1, 16 - level - Math.max(modDex, modInt));
    const mentSave = Math.max(1, 16 - level - Math.max(modWis, modCha));

    const elPhys = document.getElementById('save-physical'); if (elPhys) elPhys.innerText = physSave + '+';
    const elEvas = document.getElementById('save-evasion'); if (elEvas) elEvas.innerText = evasSave + '+';
    const elMent = document.getElementById('save-mental'); if (elMent) elMent.innerText = mentSave + '+';

    const elStrain = document.getElementById('strain-max'); if (elStrain) elStrain.innerText = con;

    let maxPsychicSkillLvl = -1;
    SKILLS_LIST.filter(s => s.psychic).forEach(s => {
        const el = document.getElementById(`skill-lvl-${s.id}`);
        const lvl = el ? parseInt(el.value) || -1 : -1;
        if (lvl > maxPsychicSkillLvl) maxPsychicSkillLvl = lvl;
    });

    const charClass = document.getElementById('char-class')?.value;
    let effortMax = 0;
    if (charClass === 'Psíquico' || maxPsychicSkillLvl >= 0) {
        const bestPsicMod = Math.max(modWis, modCon);
        effortMax = Math.max(1, 1 + bestPsicMod + (maxPsychicSkillLvl >= 0 ? maxPsychicSkillLvl : 0));
    }
    const elEffort = document.getElementById('effort-max'); if (elEffort) elEffort.innerText = effortMax;

    // Barra de Vida
    const hpCurRaw = document.getElementById('hp-current')?.value;
    const hpMaxRaw = document.getElementById('hp-max')?.value;
    const hpCur = hpCurRaw !== "" ? parseInt(hpCurRaw) : 0;
    const hpMax = hpMaxRaw !== "" ? parseInt(hpMaxRaw) : 0;
    const hpBar = document.getElementById('hp-bar');
    const hpStatus = document.getElementById('hp-status-text');

    if (hpBar && hpStatus) {
        if (hpCurRaw === "" && hpMaxRaw === "") {
            hpBar.style.width = '100%';
            hpStatus.innerText = 'Saudável';
            hpStatus.style.color = 'var(--accent-green)';
        } else {
            const maxVal = Math.max(1, hpMax);
            const hpPercent = Math.max(0, Math.min(100, (hpCur / maxVal) * 100));
            hpBar.style.width = hpPercent + '%';
            if (hpCur <= 0) {
                hpStatus.innerText = 'Inconsciente / Perigo';
                hpStatus.style.color = 'var(--accent-red)';
            } else if (hpPercent <= 25) {
                hpStatus.innerText = 'Crítico';
                hpStatus.style.color = 'var(--accent-red)';
            } else if (hpPercent <= 50) {
                hpStatus.innerText = 'Machucado';
                hpStatus.style.color = 'var(--accent-amber)';
            } else {
                hpStatus.innerText = 'Saudável';
                hpStatus.style.color = 'var(--accent-green)';
            }
        }
    }

    calculateEncumbrance(str);
}

function calculateEncumbrance(str) {
    const readiedMax = Math.floor(str / 2);
    const stowedMax = str;
    let readiedTotal = 0;
    let stowedTotal = 0;

    const rows = document.querySelectorAll('#items-body tr');
    rows.forEach(row => {
        const locEl = row.querySelector('.item-loc');
        const weightEl = row.querySelector('.item-weight');
        const loc = locEl ? locEl.value : '';
        const weight = weightEl ? parseFloat(weightEl.value) || 0 : 0;
        if (loc === 'Pronto') readiedTotal += weight;
        else if (loc === 'Guardado') stowedTotal += weight;
    });

    const elReadVal = document.getElementById('enc-readied-val'); if (elReadVal) elReadVal.innerText = readiedTotal;
    const elReadMax = document.getElementById('enc-readied-max'); if (elReadMax) elReadMax.innerText = readiedMax;
    const elStowVal = document.getElementById('enc-stowed-val'); if (elStowVal) elStowVal.innerText = stowedTotal;
    const elStowMax = document.getElementById('enc-stowed-max'); if (elStowMax) elStowMax.innerText = stowedMax;

    const bar = document.getElementById('enc-bar');
    if (bar) {
        const totalPercent = Math.min(100, ((readiedTotal + stowedTotal) / (readiedMax + stowedMax)) * 100);
        bar.style.width = totalPercent + '%';
    }
}

function addWeaponRow(data = {}) {
    const tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.className = 'weapon-row';
    tr.innerHTML = `
        <td class="cell-weapon-name">
            <input type="text" class="weapon-name" value="${data.name || ''}" placeholder="Ex: Rifle Laser">
        </td>
        <td class="cell-weapon-attr">
            <select class="weapon-attr">
                <option value="dex" ${data.attr === 'dex' ? 'selected' : ''}>DES</option>
                <option value="str" ${data.attr === 'str' ? 'selected' : ''}>FOR</option>
                <option value="int" ${data.attr === 'int' ? 'selected' : ''}>INT</option>
                <option value="wis" ${data.attr === 'wis' ? 'selected' : ''}>SAB</option>
                <option value="cha" ${data.attr === 'cha' ? 'selected' : ''}>CAR</option>
            </select>
        </td>
        <td class="cell-weapon-skill">
            <select class="weapon-skill">
                <option value="shoot" ${data.skill === 'shoot' ? 'selected' : ''}>Pontaria</option>
                <option value="punch" ${data.skill === 'punch' ? 'selected' : ''}>Briga</option>
                <option value="stab" ${data.skill === 'stab' ? 'selected' : ''}>Armas Brancas</option>
                <option value="telekinesis" ${data.skill === 'telekinesis' ? 'selected' : ''}>Telecinese</option>
            </select>
        </td>
        <td class="cell-weapon-dmg">
            <input type="text" class="weapon-dmg" value="${data.dmg || '1d8'}" placeholder="1d8" style="width:60px;">
        </td>
        <td class="cell-weapon-range">
            <input type="text" class="weapon-range" value="${data.range || ''}" placeholder="100/300m" style="width:70px;">
        </td>
        <td class="cell-weapon-actions">
            <div class="weapon-action-btns">
                <button type="button" class="btn btn-action-roll" onclick="rollAttack(this)">Ataque</button>
                <button type="button" class="btn btn-action-roll" onclick="rollDamage(this)">Dano</button>
            </div>
        </td>
        <td class="cell-weapon-del" style="text-align: center;">
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function addFocusRow(data = {}) {
    const tbody = document.getElementById('foci-body');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="focus-name" value="${data.name || ''}" placeholder="Ex: Atirador de Elite"></td>
        <td><input type="text" class="focus-level" value="${data.level || 'Nível 1'}" placeholder="Nível 1" style="width:70px;"></td>
        <td><input type="text" class="focus-desc" value="${data.desc || ''}" placeholder="Efeito ou benefício"></td>
        <td><button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); saveSheet();">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function addItemRow(data = {}) {
    const tbody = document.getElementById('items-body');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="item-name" value="${data.name || ''}" placeholder="Ex: Pacote Lázaro"></td>
        <td>
            <select class="item-loc" onchange="calculateSheet(); saveSheet();">
                <option value="Pronto" ${data.loc === 'Pronto' ? 'selected' : ''}>Pronto</option>
                <option value="Guardado" ${data.loc === 'Guardado' ? 'selected' : ''}>Guardado</option>
                <option value="Veículo/Outro" ${data.loc === 'Veículo/Outro' ? 'selected' : ''}>Outro</option>
            </select>
        </td>
        <td><input type="number" class="item-weight" value="${data.weight !== undefined ? data.weight : 1}" min="0" step="0.5" style="width:60px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function rollSkill(skillName, skillId) {
    const skillObj = SKILLS_LIST.find(s => s.id === skillId);
    const attrKey = skillObj ? skillObj.defaultAttr : 'int';
    const attrScore = parseInt(document.getElementById(`attr-${attrKey}`)?.value) || 10;
    const attrMod = getModifier(attrScore);
    const skillLvl = parseInt(document.getElementById(`skill-lvl-${skillId}`)?.value) || -2;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const diceSum = d1 + d2;
    const total = diceSum + attrMod + skillLvl;

    showDiceResult(
        `Teste de ${skillName}: ${total}`,
        `Dados (2d6): [${d1}, ${d2}] = ${diceSum} | Mod ${attrKey.toUpperCase()}: ${attrMod >= 0 ? '+' : ''}${attrMod} | Perícia: ${skillLvl >= 0 ? '+' : ''}${skillLvl}`
    );
}

function rollSave(saveName, targetValueStr) {
    const target = parseInt(targetValueStr) || 15;
    const d20 = Math.floor(Math.random() * 20) + 1;
    const success = d20 >= target;

    showDiceResult(
        `Salvaguarda de ${saveName}: ${d20}`,
        `Rolagem 1d20: [${d20}] vs Alvo: ${target}+ → ${success ? '✅ SUCESSO!' : '❌ FALHA!'}`
    );
}

function rollAttack(buttonEl) {
    const row = buttonEl.closest('tr');
    const name = row.querySelector('.weapon-name').value || 'Arma';
    const attrKey = row.querySelector('.weapon-attr').value;
    const skillId = row.querySelector('.weapon-skill').value;

    const attrScore = parseInt(document.getElementById(`attr-${attrKey}`)?.value) || 10;
    const attrMod = getModifier(attrScore);
    const skillLvl = Math.max(0, parseInt(document.getElementById(`skill-lvl-${skillId}`)?.value) || 0);
    const bab = parseInt(document.getElementById('bab-val')?.value) || 0;

    const d20 = Math.floor(Math.random() * 20) + 1;
    const totalAtk = d20 + bab + attrMod + skillLvl;

    showDiceResult(
        `Ataque com ${name}: ${totalAtk}`,
        `Dado: [${d20}] | BBA: +${bab} | Mod ${attrKey.toUpperCase()}: ${attrMod >= 0 ? '+' : ''}${attrMod} | Perícia: +${skillLvl}`
    );
}

function rollDamage(buttonEl) {
    const row = buttonEl.closest('tr');
    const name = row.querySelector('.weapon-name').value || 'Arma';
    const dmgFormula = row.querySelector('.weapon-dmg').value || '1d6';

    const regex = /(\d+)?d(\d+)(?:\s*([+-])\s*(\d+))?/i;
    const match = dmgFormula.match(regex);
    if (!match) {
        showDiceResult(`Dano de ${name}`, `Fórmula: ${dmgFormula}`);
        return;
    }

    const numDice = parseInt(match[1]) || 1;
    const diceSides = parseInt(match[2]) || 6;
    const sign = match[3];
    const modVal = match[4] ? parseInt(match[4]) : 0;
    let formulaMod = 0;
    if (sign === '+') formulaMod = modVal;
    if (sign === '-') formulaMod = -modVal;

    let rolls = [];
    let diceSum = 0;
    for (let i = 0; i < numDice; i++) {
        const r = Math.floor(Math.random() * diceSides) + 1;
        rolls.push(r);
        diceSum += r;
    }

    const totalDmg = Math.max(0, diceSum + formulaMod);
    showDiceResult(
        `Dano com ${name}: ${totalDmg}`,
        `Dados (${numDice}d${diceSides}): [${rolls.join(', ')}] = ${diceSum} ${formulaMod !== 0 ? `| Modificador: ${formulaMod >= 0 ? '+' : ''}${formulaMod}` : ''}`
    );
}

function showDiceResult(titleText, detailText) {
    const titleEl = document.getElementById('dice-result-text');
    const detailEl = document.getElementById('dice-details');
    const overlay = document.getElementById('dice-modal-overlay');
    if (titleEl) titleEl.innerText = titleText;
    if (detailEl) detailEl.innerText = detailText;
    if (overlay) overlay.classList.add('active');
}

function closeDiceModal() {
    const overlay = document.getElementById('dice-modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

function toggleCondition(badgeElement) {
    badgeElement.classList.toggle('active');
    saveSheet();
}

function openQuickDiceModal() {
    const overlay = document.getElementById('quick-dice-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeQuickDiceModal() {
    const overlay = document.getElementById('quick-dice-overlay');
    if (overlay) overlay.classList.remove('active');
}

function rollFreeDice(sides, force2d6 = false) {
    let count = parseInt(document.getElementById('quick-dice-count')?.value) || 1;
    const mod = parseInt(document.getElementById('quick-dice-mod')?.value) || 0;
    if (force2d6) count = 2;

    let rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * sides) + 1;
        rolls.push(r);
        sum += r;
    }
    const total = sum + mod;
    closeQuickDiceModal();

    showDiceResult(
        `Rolagem ${count}d${sides}${mod !== 0 ? (mod >= 0 ? '+' + mod : mod) : ''}: ${total}`,
        `Dados: [${rolls.join(', ')}] = ${sum} ${mod !== 0 ? `| Modificador: ${mod >= 0 ? '+' : ''}${mod}` : ''}`
    );
}

function switchNavTab(tabName, btnElement) {
    document.querySelectorAll('.quick-nav-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    document.querySelectorAll('.card[data-tab]').forEach(card => {
        if (tabName === 'all' || card.dataset.tab === tabName) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function saveSheet() {
    const form = document.getElementById('character-sheet');
    if (!form) return;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    data.skills = {};
    SKILLS_LIST.forEach(s => {
        const el = document.getElementById(`skill-lvl-${s.id}`);
        if (el) data.skills[s.id] = el.value;
    });

    data.weapons = [];
    document.querySelectorAll('#weapons-body tr').forEach(tr => {
        data.weapons.push({
            name: tr.querySelector('.weapon-name')?.value || '',
            attr: tr.querySelector('.weapon-attr')?.value || '',
            skill: tr.querySelector('.weapon-skill')?.value || '',
            dmg: tr.querySelector('.weapon-dmg')?.value || '',
            range: tr.querySelector('.weapon-range')?.value || ''
        });
    });

    data.foci = [];
    document.querySelectorAll('#foci-body tr').forEach(tr => {
        data.foci.push({
            name: tr.querySelector('.focus-name')?.value || '',
            level: tr.querySelector('.focus-level')?.value || '',
            desc: tr.querySelector('.focus-desc')?.value || ''
        });
    });

    data.items = [];
    document.querySelectorAll('#items-body tr').forEach(tr => {
        data.items.push({
            name: tr.querySelector('.item-name')?.value || '',
            loc: tr.querySelector('.item-loc')?.value || '',
            weight: tr.querySelector('.item-weight')?.value || ''
        });
    });

    data.conditions = [];
    document.querySelectorAll('.badge.active').forEach(b => {
        data.conditions.push(b.innerText);
    });

    localStorage.setItem('swn_character_sheet_ptbr', JSON.stringify(data));
}

function loadSheet() {
    const saved = localStorage.getItem('swn_character_sheet_ptbr');
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const el = document.getElementById(`char-${key}`) || document.getElementById(`attr-${key}`) || document.getElementsByName(key)[0];
            if (el && typeof data[key] !== 'object') el.value = data[key];
        });

        if (data.skills) {
            Object.keys(data.skills).forEach(id => {
                const sel = document.getElementById(`skill-lvl-${id}`);
                if (sel) sel.value = data.skills[id];
            });
        }

        const wb = document.getElementById('weapons-body');
        if (wb) {
            wb.innerHTML = '';
            if (data.weapons) data.weapons.forEach(w => addWeaponRow(w));
        }

        const fb = document.getElementById('foci-body');
        if (fb) {
            fb.innerHTML = '';
            if (data.foci) data.foci.forEach(f => addFocusRow(f));
        }

        const ib = document.getElementById('items-body');
        if (ib) {
            ib.innerHTML = '';
            if (data.items) data.items.forEach(i => addItemRow(i));
        }

        document.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
        if (data.conditions && Array.isArray(data.conditions)) {
            document.querySelectorAll('.badge').forEach(b => {
                if (data.conditions.includes(b.innerText)) b.classList.add('active');
            });
        }
    } catch (e) {
        console.error("Erro ao carregar a ficha:", e);
    }
}

function exportJSON() {
    saveSheet();
    const dataStr = localStorage.getItem('swn_character_sheet_ptbr');
    const charName = document.getElementById('char-name')?.value || 'personagem';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_swn_${charName.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('swn_character_sheet_ptbr', JSON.stringify(data));
            loadSheet();
            calculateSheet();
            alert("Ficha carregada com sucesso!");
        } catch (err) {
            alert("Erro ao ler o arquivo JSON fornecido.");
        }
    };
    reader.readAsText(file);
}

function resetSheet() {
    if (confirm("Tem certeza que deseja limpar toda a ficha?")) {
        localStorage.removeItem('swn_character_sheet_ptbr');
        document.getElementById('character-sheet')?.reset();
        document.getElementById('weapons-body').innerHTML = '';
        document.getElementById('foci-body').innerHTML = '';
        document.getElementById('items-body').innerHTML = '';
        document.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
        renderSkills();
        calculateSheet();
    }
}

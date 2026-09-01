/**
 * STARS WITHOUT NUMBER (Inúmeras Estrelas) — Motor Lógico da Ficha de Mech
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSheet();
    calculateSheet();
    const sheet = document.getElementById('mech-sheet');
    if (sheet) {
        sheet.addEventListener('input', () => {
            calculateSheet();
            saveSheet();
        });
    }
});

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function calculateSheet() {
    const hpMax = parseFloat(document.getElementById('hp-max-input')?.value) || 1;
    const pMax = parseFloat(document.getElementById('power-max-input')?.value) || 1;

    let hpUsed = 0;
    let pUsed = 0;

    document.querySelectorAll('#weapons-body tr').forEach(tr => {
        hpUsed += parseFloat(tr.querySelector('.weapon-hp')?.value) || 0;
        pUsed += parseFloat(tr.querySelector('.weapon-power')?.value) || 0;
    });

    document.querySelectorAll('#systems-body tr').forEach(tr => {
        hpUsed += parseFloat(tr.querySelector('.system-hp')?.value) || 0;
        pUsed += parseFloat(tr.querySelector('.system-power')?.value) || 0;
    });

    const elHpUsed = document.getElementById('hp-used'); if (elHpUsed) elHpUsed.innerText = hpUsed;
    const elHpMax = document.getElementById('hp-max-display'); if (elHpMax) elHpMax.innerText = hpMax;
    const elPUsed = document.getElementById('power-used'); if (elPUsed) elPUsed.innerText = pUsed;
    const elPMax = document.getElementById('power-max-display'); if (elPMax) elPMax.innerText = pMax;

    const hpBar = document.getElementById('hp-bar');
    const pBar = document.getElementById('power-bar');

    const hpPercent = Math.min(100, (hpUsed / hpMax) * 100);
    const pPercent = Math.min(100, (pUsed / pMax) * 100);

    if (hpBar) {
        hpBar.style.width = hpPercent + '%';
        if (hpUsed > hpMax) hpBar.classList.add('fill-overload'); else hpBar.classList.remove('fill-overload');
    }
    if (pBar) {
        pBar.style.width = pPercent + '%';
        if (pUsed > pMax) pBar.classList.add('fill-overload'); else pBar.classList.remove('fill-overload');
    }
}

function addWeaponRow(data = {}) {
    const tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="weapon-name" value="${data.name || ''}" placeholder="Ex: Canhão Plasma Pesado"></td>
        <td><input type="text" class="weapon-dmg" value="${data.dmg || '3d10'}" style="width:65px;"></td>
        <td><input type="text" class="weapon-range" value="${data.range || ''}" placeholder="500m" style="width:70px;"></td>
        <td><input type="number" class="weapon-hp" value="${data.hp !== undefined ? data.hp : 2}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="number" class="weapon-power" value="${data.power !== undefined ? data.power : 3}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="text" class="weapon-ammo" value="${data.ammo || ''}" placeholder="10 disparos"></td>
        <td>
            <button type="button" class="btn btn-action-roll" onclick="rollMechAttack(this)">🎲 Disparar</button>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function addSystemRow(data = {}) {
    const tbody = document.getElementById('systems-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="system-name" value="${data.name || ''}" placeholder="Ex: Campo de Matriz de Escudos"></td>
        <td><input type="number" class="system-hp" value="${data.hp !== undefined ? data.hp : 1}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="number" class="system-power" value="${data.power !== undefined ? data.power : 2}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="text" class="system-effect" value="${data.effect || ''}" placeholder="Absorve 10 pontos de dano"></td>
        <td>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function rollMechAttack(btn) {
    const tr = btn.closest('tr');
    const name = tr.querySelector('.weapon-name')?.value || 'Arma de Mech';
    const dmg = tr.querySelector('.weapon-dmg')?.value || '2d8';
    const d20 = Math.floor(Math.random() * 20) + 1;

    const titleEl = document.getElementById('dice-result-text');
    const detailEl = document.getElementById('dice-details');
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');

    if (titleEl) titleEl.innerText = `Ataque (${name}): d20 = ${d20}`;
    if (detailEl) detailEl.innerText = `Dano Pesado: ${dmg} | Adicione BBA + Modificador de Atributo do Piloto`;
    if (logEl) logEl.classList.add('active');
}

function closeDiceModal() {
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');
    if (logEl) logEl.classList.remove('active');
}

function saveSheet() {
    const form = document.getElementById('mech-sheet');
    if (!form) return;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((v, k) => data[k] = v);

    data.weapons = [];
    document.querySelectorAll('#weapons-body tr').forEach(tr => {
        data.weapons.push({
            name: tr.querySelector('.weapon-name')?.value || '',
            dmg: tr.querySelector('.weapon-dmg')?.value || '',
            range: tr.querySelector('.weapon-range')?.value || '',
            hp: tr.querySelector('.weapon-hp')?.value || '',
            power: tr.querySelector('.weapon-power')?.value || '',
            ammo: tr.querySelector('.weapon-ammo')?.value || ''
        });
    });

    data.systems = [];
    document.querySelectorAll('#systems-body tr').forEach(tr => {
        data.systems.push({
            name: tr.querySelector('.system-name')?.value || '',
            hp: tr.querySelector('.system-hp')?.value || '',
            power: tr.querySelector('.system-power')?.value || '',
            effect: tr.querySelector('.system-effect')?.value || ''
        });
    });

    localStorage.setItem('swn_mech_sheet_ptbr', JSON.stringify(data));
}

function loadSheet() {
    const saved = localStorage.getItem('swn_mech_sheet_ptbr');
    if (!saved) {
        addWeaponRow({ name: "Autocanhão Pesado", dmg: "2d10", range: "300m", hp: 2, power: 2, ammo: "20 projéteis" });
        addSystemRow({ name: "Interface Neural Direta", hp: 1, power: 1, effect: "+1 em rolagens de ataque e iniciativa" });
        return;
    }
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(k => {
            const el = document.getElementById(`mech-${k}`) || document.getElementsByName(k)[0];
            if (el && typeof data[k] !== 'object') el.value = data[k];
        });
        const wb = document.getElementById('weapons-body');
        if (wb) {
            wb.innerHTML = '';
            if (data.weapons) data.weapons.forEach(w => addWeaponRow(w));
        }
        const sb = document.getElementById('systems-body');
        if (sb) {
            sb.innerHTML = '';
            if (data.systems) data.systems.forEach(s => addSystemRow(s));
        }
    } catch (e) { console.error(e); }
}

function exportJSON() {
    saveSheet();
    const dataStr = localStorage.getItem('swn_mech_sheet_ptbr');
    const name = document.getElementById('mech-name')?.value || 'mech';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_mech_${name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            localStorage.setItem('swn_mech_sheet_ptbr', e.target.result);
            loadSheet();
            calculateSheet();
            alert("Ficha de Mech carregada!");
        } catch (err) { alert("Erro ao importar JSON."); }
    };
    reader.readAsText(file);
}

function resetSheet() {
    if (confirm("Limpar dados do Mech?")) {
        localStorage.removeItem('swn_mech_sheet_ptbr');
        document.getElementById('mech-sheet')?.reset();
        document.getElementById('weapons-body').innerHTML = '';
        document.getElementById('systems-body').innerHTML = '';
        calculateSheet();
    }
}

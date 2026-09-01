/**
 * STARS WITHOUT NUMBER (Inúmeras Estrelas) — Motor Lógico da Ficha de Nave Espacial
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSheet();
    calculateSheet();
    const sheet = document.getElementById('ship-sheet');
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
    const pMax = parseFloat(document.getElementById('power-max-input')?.value) || 1;
    const mMax = parseFloat(document.getElementById('mass-max-input')?.value) || 1;

    let pUsed = 0;
    let mUsed = 0;

    document.querySelectorAll('#weapons-body tr').forEach(tr => {
        pUsed += parseFloat(tr.querySelector('.weapon-power')?.value) || 0;
        mUsed += parseFloat(tr.querySelector('.weapon-mass')?.value) || 0;
    });

    document.querySelectorAll('#fittings-body tr').forEach(tr => {
        pUsed += parseFloat(tr.querySelector('.fitting-power')?.value) || 0;
        mUsed += parseFloat(tr.querySelector('.fitting-mass')?.value) || 0;
    });

    const elPUsed = document.getElementById('power-used'); if (elPUsed) elPUsed.innerText = pUsed;
    const elPMax = document.getElementById('power-max'); if (elPMax) elPMax.innerText = pMax;
    const elMUsed = document.getElementById('mass-used'); if (elMUsed) elMUsed.innerText = mUsed;
    const elMMax = document.getElementById('mass-max'); if (elMMax) elMMax.innerText = mMax;

    const pBar = document.getElementById('power-bar');
    const mBar = document.getElementById('mass-bar');

    const pPercent = Math.min(100, (pUsed / pMax) * 100);
    const mPercent = Math.min(100, (mUsed / mMax) * 100);

    if (pBar) {
        pBar.style.width = pPercent + '%';
        if (pUsed > pMax) pBar.classList.add('fill-overload'); else pBar.classList.remove('fill-overload');
    }
    if (mBar) {
        mBar.style.width = mPercent + '%';
        if (mUsed > mMax) mBar.classList.add('fill-overload'); else mBar.classList.remove('fill-overload');
    }
}

function addWeaponRow(data = {}) {
    const tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="weapon-name" value="${data.name || ''}" placeholder="Ex: Laser Multifluxo"></td>
        <td><input type="text" class="weapon-dmg" value="${data.dmg || '2d6'}" style="width:60px;"></td>
        <td><input type="text" class="weapon-range" value="${data.range || ''}" placeholder="100.000km" style="width:80px;"></td>
        <td><input type="number" class="weapon-power" value="${data.power !== undefined ? data.power : 1}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="number" class="weapon-mass" value="${data.mass !== undefined ? data.mass : 1}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="text" class="weapon-notes" value="${data.notes || ''}" placeholder="AP 10, Cl-Fragata"></td>
        <td>
            <button type="button" class="btn btn-action-roll" onclick="rollShipWeapon(this)">🎲 Disparar</button>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function addFittingRow(data = {}) {
    const tbody = document.getElementById('fittings-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="fitting-name" value="${data.name || ''}" placeholder="Ex: Gerador de Escudo Leve"></td>
        <td><input type="number" class="fitting-power" value="${data.power !== undefined ? data.power : 1}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="number" class="fitting-mass" value="${data.mass !== undefined ? data.mass : 1}" style="width:50px;" onchange="calculateSheet(); saveSheet();"></td>
        <td><input type="text" class="fitting-effect" value="${data.effect || ''}" placeholder="Gera 5 PV de escudo por rodada"></td>
        <td>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); calculateSheet(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function rollShipWeapon(btn) {
    const tr = btn.closest('tr');
    const name = tr.querySelector('.weapon-name')?.value || 'Arma de Nave';
    const dmg = tr.querySelector('.weapon-dmg')?.value || '1d6';
    const d20 = Math.floor(Math.random() * 20) + 1;

    const titleEl = document.getElementById('dice-result-text');
    const detailEl = document.getElementById('dice-details');
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');

    if (titleEl) titleEl.innerText = `Ataque (${name}): d20 = ${d20}`;
    if (detailEl) detailEl.innerText = `Dano nominal: ${dmg} | Adicione o BBA do Artilheiro + Perícia Pontaria`;
    if (logEl) logEl.classList.add('active');
}

function closeDiceModal() {
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');
    if (logEl) logEl.classList.remove('active');
}

function saveSheet() {
    const form = document.getElementById('ship-sheet');
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
            power: tr.querySelector('.weapon-power')?.value || '',
            mass: tr.querySelector('.weapon-mass')?.value || '',
            notes: tr.querySelector('.weapon-notes')?.value || ''
        });
    });

    data.fittings = [];
    document.querySelectorAll('#fittings-body tr').forEach(tr => {
        data.fittings.push({
            name: tr.querySelector('.fitting-name')?.value || '',
            power: tr.querySelector('.fitting-power')?.value || '',
            mass: tr.querySelector('.fitting-mass')?.value || '',
            effect: tr.querySelector('.fitting-effect')?.value || ''
        });
    });

    localStorage.setItem('swn_ship_sheet_ptbr', JSON.stringify(data));
}

function loadSheet() {
    const saved = localStorage.getItem('swn_ship_sheet_ptbr');
    if (!saved) {
        addWeaponRow({ name: "Laser de Impacto", dmg: "2d6", range: "100.000km", power: 1, mass: 1, notes: "AP 5" });
        addFittingRow({ name: "Câmara de Carga Expandida", power: 0, mass: 2, effect: "Aumenta carga em 20T" });
        return;
    }
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(k => {
            const el = document.getElementById(`ship-${k}`) || document.getElementsByName(k)[0];
            if (el && typeof data[k] !== 'object') el.value = data[k];
        });
        const wb = document.getElementById('weapons-body');
        if (wb) {
            wb.innerHTML = '';
            if (data.weapons) data.weapons.forEach(w => addWeaponRow(w));
        }
        const fb = document.getElementById('fittings-body');
        if (fb) {
            fb.innerHTML = '';
            if (data.fittings) data.fittings.forEach(f => addFittingRow(f));
        }
    } catch (e) { console.error(e); }
}

function exportJSON() {
    saveSheet();
    const dataStr = localStorage.getItem('swn_ship_sheet_ptbr');
    const name = document.getElementById('ship-name')?.value || 'nave';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_nave_${name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            localStorage.setItem('swn_ship_sheet_ptbr', e.target.result);
            loadSheet();
            calculateSheet();
            alert("Ficha de Nave carregada!");
        } catch (err) { alert("Erro ao importar JSON."); }
    };
    reader.readAsText(file);
}

function resetSheet() {
    if (confirm("Limpar dados da nave?")) {
        localStorage.removeItem('swn_ship_sheet_ptbr');
        document.getElementById('ship-sheet')?.reset();
        document.getElementById('weapons-body').innerHTML = '';
        document.getElementById('fittings-body').innerHTML = '';
        calculateSheet();
    }
}

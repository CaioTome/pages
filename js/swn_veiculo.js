/**
 * STARS WITHOUT NUMBER (Inúmeras Estrelas) — Motor Lógico da Ficha de Veículo / Drone
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSheet();
    const sheet = document.getElementById('vehicle-sheet');
    if (sheet) {
        sheet.addEventListener('input', saveSheet);
    }
});

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

function addWeaponRow(data = {}) {
    const tbody = document.getElementById('weapons-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="weapon-name" value="${data.name || ''}" placeholder="Ex: Metralhadora Pesada 12.7mm"></td>
        <td><input type="text" class="weapon-dmg" value="${data.dmg || '2d8'}" style="width:70px;"></td>
        <td><input type="text" class="weapon-range" value="${data.range || ''}" placeholder="200m" style="width:80px;"></td>
        <td><input type="text" class="weapon-ammo" value="${data.ammo || ''}" placeholder="500 projéteis"></td>
        <td>
            <button type="button" class="btn btn-action-roll" onclick="rollVehAttack(this)">🎲 Disparar</button>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function addFittingRow(data = {}) {
    const tbody = document.getElementById('fittings-body');
    if (!tbody) return;
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" class="fitting-name" value="${data.name || ''}" placeholder="Ex: Sensores Táticos de Varredura"></td>
        <td><input type="text" class="fitting-effect" value="${data.effect || ''}" placeholder="+1 em testes de Percepção / Detecção"></td>
        <td>
            <button type="button" class="btn btn-danger" style="padding:2px 6px;" onclick="this.closest('tr').remove(); saveSheet();">✕</button>
        </td>
    `;
    tbody.appendChild(tr);
}

function rollVehAttack(btn) {
    const tr = btn.closest('tr');
    const name = tr.querySelector('.weapon-name')?.value || 'Arma de Veículo';
    const dmg = tr.querySelector('.weapon-dmg')?.value || '2d6';
    const d20 = Math.floor(Math.random() * 20) + 1;

    const titleEl = document.getElementById('dice-result-text');
    const detailEl = document.getElementById('dice-details');
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');

    if (titleEl) titleEl.innerText = `Ataque (${name}): d20 = ${d20}`;
    if (detailEl) detailEl.innerText = `Dano nominal: ${dmg} | Adicione BBA + Modificador do Piloto`;
    if (logEl) logEl.classList.add('active');
}

function closeDiceModal() {
    const logEl = document.getElementById('dice-log') || document.getElementById('dice-modal-overlay');
    if (logEl) logEl.classList.remove('active');
}

function saveSheet() {
    const form = document.getElementById('vehicle-sheet');
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
            ammo: tr.querySelector('.weapon-ammo')?.value || ''
        });
    });

    data.fittings = [];
    document.querySelectorAll('#fittings-body tr').forEach(tr => {
        data.fittings.push({
            name: tr.querySelector('.fitting-name')?.value || '',
            effect: tr.querySelector('.fitting-effect')?.value || ''
        });
    });

    localStorage.setItem('swn_vehicle_sheet_ptbr', JSON.stringify(data));
}

function loadSheet() {
    const saved = localStorage.getItem('swn_vehicle_sheet_ptbr');
    if (!saved) {
        addWeaponRow({ name: "Canhão Automático de Suporte", dmg: "2d8", range: "250m", ammo: "200 projéteis" });
        addFittingRow({ name: "Sistema de Pilotagem Automática TL4", effect: "Permite navegação autônoma em rotas programadas" });
        return;
    }
    try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(k => {
            const el = document.getElementById(`veh-${k}`) || document.getElementsByName(k)[0];
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
    const dataStr = localStorage.getItem('swn_vehicle_sheet_ptbr');
    const name = document.getElementById('veh-name')?.value || 'veiculo';
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_veiculo_${name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            localStorage.setItem('swn_vehicle_sheet_ptbr', e.target.result);
            loadSheet();
            alert("Ficha de Veículo carregada!");
        } catch (err) { alert("Erro ao importar JSON."); }
    };
    reader.readAsText(file);
}

function resetSheet() {
    if (confirm("Limpar dados do veículo/drone?")) {
        localStorage.removeItem('swn_vehicle_sheet_ptbr');
        document.getElementById('vehicle-sheet')?.reset();
        document.getElementById('weapons-body').innerHTML = '';
        document.getElementById('fittings-body').innerHTML = '';
    }
}

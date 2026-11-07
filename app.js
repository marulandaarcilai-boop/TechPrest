// Base de datos simulada inicial de equipos
let inventory = [
    { id: 'EQ-01', name: 'Laptop HP ProBook', category: 'Laptops', status: 'Disponible' },
    { id: 'EQ-02', name: 'Laptop Lenovo ThinkPad', category: 'Laptops', status: 'Disponible' },
    { id: 'EQ-03', name: 'Proyector Epson X49', category: 'Proyectores', status: 'Disponible' },
    { id: 'EQ-04', name: 'Cámara Sony Alpha', category: 'Cámaras', status: 'Disponible' },
    { id: 'EQ-05', name: 'Micrófono Inalámbrico Shure', category: 'Audio', status: 'Disponible' }
];

let activeLoans = [];

// Elementos del DOM
const inventoryList = document.getElementById('inventory-list');
const equipmentSelect = document.getElementById('equipment-select');
const loanForm = document.getElementById('loan-form');
const loansTableBody = document.getElementById('loans-table-body');

const statTotal = document.getElementById('stat-total');
const statDisponibles = document.getElementById('stat-disponibles');
const statPrestados = document.getElementById('stat-prestados');

function initApp() {
    renderInventory();
    renderMetrics();
    renderLoans();
}

function renderInventory() {
    inventoryList.innerHTML = '';
    equipmentSelect.innerHTML = '<option value="">-- Seleccione un equipo --</option>';

    inventory.forEach(item => {
        // Renderizar en la cuadrícula de inventario
        const div = document.createElement('div');
        div.className = `item-box ${item.status === 'Disponible' ? 'available' : 'loaned'}`;
        div.innerHTML = `<strong>${item.id}</strong><br>${item.name}<br><span style="font-size:0.75rem; color:${item.status === 'Disponible' ? 'green':'red'}">${item.status}</span>`;
        inventoryList.appendChild(div);

        // Llenar el selector solo con equipos disponibles (Regla de negocio: evitar préstamos dobles)
        if (item.status === 'Disponible') {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.id} - ${item.name}`;
            equipmentSelect.appendChild(option);
        }
    });
}

function renderMetrics() {
    const total = inventory.length;
    const disponibles = inventory.filter(i => i.status === 'Disponible').length;
    const prestados = total - disponibles;

    statTotal.textContent = total;
    statDisponibles.textContent = disponibles;
    statPrestados.textContent = prestados;
}

function renderLoans() {
    loansTableBody.innerHTML = '';
    if (activeLoans.length === 0) {
        loansTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b;">No hay préstamos activos registrados.</td></tr>`;
        return;
    }

    activeLoans.forEach((loan, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${loan.id}</td>
            <td>${loan.user}</td>
            <td>${loan.equipmentName}</td>
            <td>${loan.loanDate}</td>
            <td>${loan.returnDate}</td>
            <td><span class="badge ${loan.status === 'Activo' ? 'active' : 'returned'}">${loan.status}</span></td>
            <td>${loan.status === 'Activo' ? `<button class="btn-action" onclick="returnEquipment(${index})">Devolver</button>` : 'Completado'}</td>
        `;
        loansTableBody.appendChild(tr);
    });
}

// Manejar el envío del formulario de préstamo
loanForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userName = document.getElementById('user-name').value;
    const equipmentId = equipmentSelect.value;
    const returnDate = document.getElementById('return-date').value;

    const equipment = inventory.find(i => i.id === equipmentId);
    if (!equipment || equipment.status !== 'Disponible') {
        alert('Error: El equipo seleccionado no está disponible.');
        return;
    }

    // Cambiar estado del equipo
    equipment.status = 'Prestado';

    // Registrar préstamo
    const newLoan = {
        id: 'PR-' + Math.floor(1000 + Math.random() * 9000),
        user: userName,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        loanDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate,
        status: 'Activo'
    };

    activeLoans.push(newLoan);
    loanForm.reset();
    initApp();
});

// Registrar devolución
window.returnEquipment = function(index) {
    const loan = activeLoans[index];
    const equipment = inventory.find(i => i.id === loan.equipmentId);

    if (equipment) {
        equipment.status = 'Disponible';
    }
    loan.status = 'Devuelto';
    initApp();
}

// Inicializar al cargar
initApp();
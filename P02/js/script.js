let selectedOption = '';

// 1. EVENTO DE SELECCIÓN DE OPCIONES
document.querySelectorAll('.options img').forEach(img => {
    img.addEventListener('click', () => {
        selectedOption = img.getAttribute('data-option'); // Guarda la opción seleccionada
        document.getElementById('choice1').innerText = selectedOption; // Actualiza el texto visible
    });
});

// 2. FUNCIÓN PARA CONFIRMAR ELECCIÓN
document.getElementById('confirm-button').addEventListener('click', confirmChoice);

function confirmChoice() {
    if (!selectedOption) {
        alert('Por favor, selecciona una opción.');
        return;
    }

    const storyText = document.querySelector('.story p:nth-of-type(2)');
    const storyImage = document.getElementById('story-image');

    switch (selectedOption) {
        case 'inspeccionar el portal':
            storyText.innerText = 'Ekko decide acercarse al portal. Una ráfaga de energía lo empuja hacia atrás. Powder grita que el portal parece inestable.';
            storyImage.src = '../img/portal_unstable.jpg';
            break;
        case 'desactivar la máquina':
            storyText.innerText = 'Ekko intenta desactivar la máquina, pero Powder lo detiene. "¡Podemos usarla para cambiarlo todo!", grita ella.';
            storyImage.src = '../img/machine_control.jpg';
            break;
        case 'pedir ayuda a Powder':
            storyText.innerText = 'Ekko le pide a Powder que revise la máquina. Juntos encuentran un error en el núcleo de energía, pero no están seguros de cómo resolverlo.';
            storyImage.src = '../img/powder_help.jpg';
            break;
    }

    // Mostrar siguiente sección después de 2 segundos
    setTimeout(showPuzzleSection, 2000);
}

// 3. MOSTRAR SECCIÓN DEL PUZZLE
function showPuzzleSection() {
    document.getElementById('puzzle-section').style.display = 'block';
    document.getElementById('drag-items').style.display = 'flex';
    document.querySelector('.drop-zone-container').style.display = 'flex';
    document.querySelector('.confirm-button').style.display = 'none';
}

// ---------------- DRAG AND DROP LOGIC ----------------
const correctMapping = {
    reactor: 'núcleo',
    panelControl: 'panel',
    stabilizer: 'engranaje'
};

const placedItems = {};

document.querySelectorAll('#drag-items img').forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.getAttribute('data-item'));
        e.dataTransfer.setData('id', item.id);
    });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const itemType = e.dataTransfer.getData('text/plain');
        const zoneId = e.target.id;

        if (correctMapping[zoneId] === itemType) {
            const img = document.createElement('img');
            img.src = getImagePath(itemType);
            img.alt = itemType;
            img.style.width = '80px';
            img.style.height = '80px';

            e.target.innerHTML = '';
            e.target.appendChild(img);

            const originalImg = document.querySelector(`[data-item="${itemType}"]`);
            originalImg.style.display = 'none';

            placedItems[zoneId] = itemType;
        } else {
            alert('Objeto incorrecto. Intenta de nuevo.');
        }

        checkCompletion();
    });
});

function getImagePath(type) {
    switch (type) {
        case 'núcleo': return '../img/energy_core.png';
        case 'panel': return '../img/panel.png';
        case 'engranaje': return '../img/gear.png';
        default: return '';
    }
}

// Verificar si todas las zonas están completas
function checkCompletion() {
    if (Object.keys(placedItems).length === Object.keys(correctMapping).length) {
        document.querySelector('.story p').textContent = '¡El portal está estabilizado!';

        // Mostrar opciones finales después de completar el puzzle
        setTimeout(showFinalDecision, 2000);
    }
}

// 4. MOSTRAR DECISIONES FINALES DESPUÉS DE COMPLETAR EL PUZZLE
function showFinalDecision() {
    const storyText = document.querySelector('.story p:nth-of-type(2)');
    storyText.innerText = 'El portal está estabilizado, pero ahora Ekko debe tomar una decisión final: ¿quedarse en este mundo con Powder o regresar a su universo?';

    // Cambiar las opciones de decisión final
    document.querySelector('.options').innerHTML = `
        <img src="../img/quedarse.png" alt="Quedarse en el nuevo universo" data-option="quedarse en este universo" onclick="selectOption('quedarse en este universo')">
        <img src="../img/volver.png" alt="Volver a su universo" data-option="volver a su universo" onclick="selectOption('volver a su universo')">
    `;
}

// Función para manejar la selección final de la opción
function selectOption(option) {
    selectedOption = option;
    document.getElementById('choice1').innerText = selectedOption; // Actualiza el texto visible

    // Decidir el desenlace según la opción seleccionada
    if (selectedOption === 'quedarse en este universo') {
        document.querySelector('.story p:nth-of-type(2)').innerText = 'Ekko decide quedarse en este nuevo mundo con Powder. Juntos comienzan una nueva vida, donde pueden reconstruir el futuro que siempre soñaron.';
        document.getElementById('story-image').src = '../img/happy_together.jpg';
    } else if (selectedOption === 'volver a su universo') {
        document.querySelector('.story p:nth-of-type(2)').innerText = 'Ekko decide regresar a su universo, dejando atrás a Powder. Aunque el portal se cierra, siempre llevará su recuerdo consigo, con la esperanza de que algún día se reencuentren.';
        document.getElementById('story-image').src = '../img/solo_ekko.jpg';
    }
}

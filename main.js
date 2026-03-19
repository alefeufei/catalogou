async function loadModels() {
    const grid = document.getElementById('catalogGrid');
    try {
        const response = await fetch('models.json');
        const models = await response.json();
        
        grid.innerHTML = ''; // Limpa o loading state
        
        models.forEach(model => {
            const article = document.createElement('article');
            article.className = 'card';
            article.innerHTML = `
                <div class="card-image" onclick="openImage('${model.image}')">
                    <img src="${model.image}" alt="${model.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <h2 class="card-title">${model.title}</h2>
                    <p class="card-description">${model.description}</p>
                    
                    <div class="card-quantity">
                        <span class="quantity-label">Quantidade</span>
                        <input type="number" class="quantity-input" value="1" min="1" max="99">
                    </div>

                    <div class="card-sizes">
                        <span class="size-label">Escolha o Tamanho</span>
                        <div class="size-list">
                            <span class="size-item" onclick="selectSize(this)">P</span>
                            <span class="size-item" onclick="selectSize(this)">M</span>
                            <span class="size-item" onclick="selectSize(this)">G</span>
                            <span class="size-item" onclick="selectSize(this)">GG</span>
                        </div>
                    </div>
                    <button class="btn-order" onclick="prepareOrder(this, '${model.title}', '${model.image}')">
                        <svg class="whatsapp-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Encomendar agora
                    </button>
                </div>
            `;
            grid.appendChild(article);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ef4444;">Erro ao carregar o catálogo. Por favor, tente novamente mais tarde.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadModels);

// Modal de Zoom
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('imgFull');
const closeBtn = document.querySelector('.close-modal');

function openImage(src) {
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    modalImg.src = src;
    document.body.style.overflow = "hidden"; // Desativa scroll do body
}

function closeImage() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
        modalImg.src = "";
    }, 300);
    document.body.style.overflow = "auto";
}

closeBtn.onclick = closeImage;
modal.onclick = (e) => {
    if (e.target === modal) closeImage();
};

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && modal.classList.contains('show')) {
        closeImage();
    }
});

function selectSize(element) {
    const parent = element.parentElement;
    parent.querySelectorAll('.size-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
}

function prepareOrder(button, title, image) {
    const card = button.closest('.card');
    const selectedSize = card.querySelector('.size-item.selected')?.textContent;
    const quantity = card.querySelector('.quantity-input').value;

    if (!selectedSize) {
        alert('Por favor, selecione um tamanho!');
        return;
    }

    sendWhatsApp(title, image, selectedSize, quantity);
}

function sendWhatsApp(productName, imageUrl, size, quantity) {
    const phoneNumber = "5521972406574";
    const baseUrl = window.location.origin;
    const fullImageUrl = `${baseUrl}/${imageUrl}`;
    
    const message = `Olá! Quero encomendar:\n\n` +
                    `*Produto:* ${productName}\n` +
                    `*Tamanho:* ${size}\n` +
                    `*Quantidade:* ${quantity}\n\n` +
                    `*Foto:* ${fullImageUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

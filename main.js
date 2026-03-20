let allModels = [];
let currentPage = 1;
const cardsPerPage = 25;

async function loadModels() {
    const grid = document.getElementById('catalogGrid');
    try {
        const response = await fetch('models.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allModels = await response.json();
        
        if (!Array.isArray(allModels)) {
            throw new Error('Formato de dados inválido: o arquivo JSON não é uma lista.');
        }
        
        renderPage(1);

    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 20px;">
                <p>Erro ao carregar o catálogo.</p>
                <p style="font-size: 0.8rem; margin-top: 10px; color: var(--text-secondary);">
                    Detalhes: ${error.message}<br>
                    Verifique se o arquivo models.json está na mesma pasta ou se está usando um servidor local (Live Server).
                </p>
            </div>
        `;
    }
}

function renderPage(page) {
    const grid = document.getElementById('catalogGrid');
    currentPage = page;
    grid.innerHTML = '';
    
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const pageModels = allModels.slice(startIndex, endIndex);
    
    pageModels.forEach(model => {
        const article = document.createElement('article');
        article.className = 'card';
        article.innerHTML = `
            <div class="card-image" onclick="openImage('${model.image}')">
                <img src="${model.image}" alt="${model.title}" loading="lazy">
            </div>
            <div class="card-content">
                <h2 class="card-title">${model.title}</h2>
                <p class="card-description">${model.description}</p>
                
                <div class="card-sizes">
                    <span class="size-label">Escolha o Tamanho</span>
                    <div class="size-list">
                        <span class="size-item" onclick="selectSize(this, 'P')">P</span>
                        <span class="size-item" onclick="selectSize(this, 'M')">M</span>
                        <span class="size-item" onclick="selectSize(this, 'G')">G</span>
                        <span class="size-item" onclick="selectSize(this, 'GG')">GG</span>
                    </div>
                    <div class="size-quantities">
                        <!-- Quantidades por tamanho aparecerão aqui -->
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

    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(allModels.length / cardsPerPage);
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-pagination';
    prevBtn.innerHTML = '&laquo;';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => renderPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);

    // Números das Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `btn-pagination ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => renderPage(i);
            paginationContainer.appendChild(pageBtn);
        } else if (
            (i === currentPage - 2 && i > 1) || 
            (i === currentPage + 2 && i < totalPages)
        ) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.margin = '0 5px';
            paginationContainer.appendChild(dots);
        }
    }

    // Botão Próximo
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-pagination';
    nextBtn.innerHTML = '&raquo;';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => renderPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
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

function selectSize(element, size) {
    console.log(`Selecionando tamanho: ${size}`);
    element.classList.toggle('selected');
    const card = element.closest('.card');
    if (!card) {
        console.error('Card não encontrado');
        return;
    }
    const quantityContainer = card.querySelector('.size-quantities');
    if (!quantityContainer) {
        console.error('Container de quantidades não encontrado');
        return;
    }
    
    if (element.classList.contains('selected')) {
        console.log(`Adicionando input para tamanho: ${size}`);
        // Criar item de quantidade para este tamanho
        const sizeQtyItem = document.createElement('div');
        sizeQtyItem.className = 'size-quantity-item';
        sizeQtyItem.setAttribute('data-size', size);
        sizeQtyItem.innerHTML = `
            <span class="size-name">${size}:</span>
            <input type="number" class="size-qty-input" value="1" min="1" max="99" />
        `;
        quantityContainer.appendChild(sizeQtyItem);
    } else {
        console.log(`Removendo input para tamanho: ${size}`);
        // Remover item de quantidade para este tamanho
        const itemToRemove = quantityContainer.querySelector(`.size-quantity-item[data-size="${size}"]`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    }
}

function prepareOrder(button, title, image) {
    const card = button.closest('.card');
    const quantityItems = card.querySelectorAll('.size-quantity-item');
    
    if (quantityItems.length === 0) {
        alert('Por favor, selecione pelo menos um tamanho!');
        return;
    }

    const selections = [];
    quantityItems.forEach(item => {
        const size = item.getAttribute('data-size');
        const quantity = item.querySelector('.size-qty-input').value;
        selections.push({ size, quantity });
    });

    sendWhatsApp(title, image, selections);
}

function sendWhatsApp(productName, imageUrl, selections) {
    const phoneNumber = "5521959435523";
    const baseUrl = window.location.origin;
    const fullImageUrl = `${baseUrl}/${imageUrl}`;
    
    let sizesText = selections.map(s => `- ${s.size}: ${s.quantity}`).join('\n');
    
    const message = `Olá! Quero encomendar:\n\n` +
                    `*Produto:* ${productName}\n` +
                    `*Tamanhos e Quantidades:*\n${sizesText}\n\n` +
                    `*Foto:* ${fullImageUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

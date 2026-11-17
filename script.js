/**
 * LIVRARIA VIRTUAL - SCRIPT PRINCIPAL
 * Funcionalidades:
 * - Busca dinâmica em tempo real (título, autor, categoria e ordenação)
 * - Integração de checkout seguro simulado via Stripe (pronto para API Key)
 * - Gerenciamento de navegação responsiva
 * - Suporte dinâmico para página de detalhes (book_info.html)
 * - Sem emojis - Interface profissional
 */

// ==========================================================================
// CONFIGURAÇÃO DO GATEWAY STRIPE
// ==========================================================================
const STRIPE_CONFIG = {
    // Insira sua Chave Pública (Publishable Key ex: pk_test_... ou pk_live_...) quando desejar conectar cobranças reais:
    publishableKey: '',
    isSimulation: true // Mantém a simulação ativa com validação completa e recibo
};

// ==========================================================================
// BASE DE DADOS DOS LIVROS (CATÁLOGO)
// ==========================================================================
const BOOKS_DATABASE = [
    {
        id: 1,
        title: "O Jantar Secreto",
        author: "Raphael Montes",
        category: "Literatura Brasileira",
        subCategory: "Suspense",
        price: 41.29,
        condition: "Seminovo",
        image: "https://m.media-amazon.com/images/I/71AeB1+8dZL._SY466_.jpg",
        pages: 368,
        publisher: "Companhia das Letras",
        year: 2016,
        rating: 5,
        description: "Um grupo de quatro amigos deixa uma pequena cidade do Paraná para viver no Rio de Janeiro e cursar a faculdade. Diante de dívidas crescentes de aluguel e desespero financeiro, eles decidem promover jantares secretos exclusivos para a alta sociedade carioca, adentrando uma espiral psicológica de suspense, escolhas extremas e consequências imprevisíveis."
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        category: "Literatura Internacional",
        subCategory: "Ficção Científica",
        price: 39.90,
        condition: "Novo",
        image: "https://m.media-amazon.com/images/I/61t0bwt1s3L._SY385_.jpg",
        pages: 336,
        publisher: "Companhia das Letras",
        year: 1949,
        rating: 5,
        description: "Winston Smith vive sob a constante vigilância dos teletelas e da figura opressora do Grande Irmão na Oceania totalitária. Um dos maiores clássicos do século XX, que examina com profundidade os mecanismos de vigilância em massa, manipulação da verdade histórica e a resistência da consciência individual."
    },
    {
        id: 3,
        title: "O Massacre da Família Hope",
        author: "Riley Sager",
        category: "Suspense e Mistério",
        subCategory: "Thriller",
        price: 49.78,
        condition: "Novo",
        image: "https://m.media-amazon.com/images/I/815bfY-u6-L._SY385_.jpg",
        pages: 400,
        publisher: "Intrínseca",
        year: 2023,
        rating: 5,
        description: "Em 1929, um homicídio estarrecedor chocou a alta sociedade americana. Décadas após o mistério sem solução, uma jovem cuidadora é designada para assistir Lenora Hope, a única sobrevivente. Comunicando-se apenas por uma máquina de escrever, Lenora decide finalmente contar o que realmente aconteceu naquela noite."
    },
    {
        id: 4,
        title: "Nem te Conto",
        author: "Emily Henry",
        category: "Romance",
        subCategory: "Comédia Romântica",
        price: 39.53,
        condition: "Seminovo",
        image: "https://m.media-amazon.com/images/I/41oZEOsAjTL._SY445_SX342_ML2_.jpg",
        pages: 384,
        publisher: "Verus",
        year: 2022,
        rating: 4,
        description: "Nora Stephens é uma agente literária implacável cuja vida gira em torno de livros e metas. Durante um retiro temporário de verão com a irmã em uma bucólica cidadezinha da Carolina do Norte, ela esbarra seguidamente em Charlie Lastra, um editor nova-iorquino crítico e brilhante. Uma comédia romântica perspicaz e calorosa."
    },
    {
        id: 5,
        title: "Divergente",
        author: "Veronica Roth",
        category: "Ficção e Fantasia",
        subCategory: "Distopia",
        price: 47.67,
        condition: "Usado",
        image: "https://m.media-amazon.com/images/I/61M5CI0TS2L._SY342_.jpg",
        pages: 504,
        publisher: "Rocco",
        year: 2012,
        rating: 4,
        description: "Numa Chicago pós-apocalíptica, a sociedade é dividida em cinco facções dedicadas a uma virtude: Abnegação, Amizade, Audácia, Franqueza e Erudição. Aos dezesseis anos, Beatrice Prior descobre que possui aptidões múltiplas — é divergente — e não pode ser controlada, colocando-a no centro de uma conspiração que ameaça toda a paz civil."
    },
    {
        id: 6,
        title: "A Metamorfose",
        author: "Franz Kafka",
        category: "Literatura Internacional",
        subCategory: "Clássicos",
        price: 10.90,
        condition: "Usado",
        image: "https://m.media-amazon.com/images/I/51H+90dUjzL._SY445_SX342_ML2_.jpg",
        pages: 96,
        publisher: "Antofágica",
        year: 1915,
        rating: 5,
        description: "Gregor Samsa desperta uma manhã após sonhos intranquilos para descobrir-se transformado em um inseto monstruoso. Obra fundamental do modernismo literário mundial, que disseca com precisão cirúrgica a alienação humana, o peso da subsistência econômica e as dinâmicas implacáveis das relações familiares."
    },
    {
        id: 7,
        title: "De Férias com Você",
        author: "Emily Henry",
        category: "Romance",
        subCategory: "Comédia Romântica",
        price: 38.64,
        condition: "Seminovo",
        image: "https://m.media-amazon.com/images/I/71PHtFqzj9L._SY425_.jpg",
        pages: 368,
        publisher: "Verus",
        year: 2021,
        rating: 4,
        description: "Poppy e Alex não têm absolutamente nada em comum, mas se tornaram melhores amigos na universidade e mantinham a tradição de passar uma semana inteira de férias de verão juntos. Após dois anos de silêncio provocados por um mal-entendido, eles decidem fazer uma última viagem compartilhada para tentar resgatar o vínculo."
    },
    {
        id: 8,
        title: "Crime e Castigo",
        author: "Fiódor Dostoiévski",
        category: "Literatura Internacional",
        subCategory: "Clássicos",
        price: 15.90,
        condition: "Usado",
        image: "https://m.media-amazon.com/images/I/71Gmavgu3ZL._SY425_.jpg",
        pages: 592,
        publisher: "Editora 34",
        year: 1866,
        rating: 5,
        description: "Em São Petersburgo, Rodion Raskólnikov, um ex-estudante empobrecido e isolado, arquiteta o assassinato de uma velha agiota acreditando pertencer a uma categoria de homens superiores autorizados a violar normas morais. O romance acompanha o tormento psicológico, a investigação policial e o longo caminho em direção à redenção."
    },
    {
        id: 9,
        title: "Suicidas",
        author: "Raphael Montes",
        category: "Literatura Brasileira",
        subCategory: "Suspense",
        price: 43.56,
        condition: "Novo",
        image: "https://m.media-amazon.com/images/I/81XqiNjr5OL._SY466_.jpg",
        pages: 480,
        publisher: "Companhia das Letras",
        year: 2012,
        rating: 5,
        description: "Um suspense de tirar o fôlego que marcou a estreia triunfal de Raphael Montes. Um grupo de nove jovens da elite é encontrado morto no porão de uma casa de campo, vítimas de um jogo letal de roleta-russa. Anos depois, as gravações em áudio e relatos escritos das últimas horas são confrontados em busca da verdade por trás da tragédia."
    }
];

// Auxiliar para formatação de moeda brasileira (R$)
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Auxiliar para normalização de texto (remove acentos e pontuações)
function normalizeString(text) {
    return (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// ==========================================================================
// INICIALIZAÇÃO AO CARREGAR O DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCatalogSearch();
    initStripeModal();
    initSellForm();
    initBookDetailsPage();
});

// ==========================================================================
// 1. NAVEGAÇÃO E MENU RESPONSIVO
// ==========================================================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// ==========================================================================
// 2. BUSCA, FILTROS E ORDENAÇÃO DINÂMICA DO CATÁLOGO
// ==========================================================================
function initCatalogSearch() {
    const searchInput = document.getElementById('busca');
    const categorySelect = document.getElementById('categoria');
    const sortSelect = document.getElementById('ordenar');
    const searchForm = document.querySelector('.search-row');
    const booksGrid = document.querySelector('.books-grid');
    const resultsCounter = document.getElementById('results-counter');
    const btnResetFilters = document.getElementById('btn-reset-filters');
    const noResultsBox = document.getElementById('no-results-state');

    // Se a página atual não possui catálogo (ex: book_info isolado), encerra
    if (!booksGrid || !searchInput) return;

    function applyFilterAndSort() {
        const query = normalizeString(searchInput.value);
        const selectedCategory = categorySelect ? categorySelect.value : 'Todas';
        const selectedSort = sortSelect ? sortSelect.value : 'relevancia';

        const cards = Array.from(booksGrid.querySelectorAll('.book-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const title = normalizeString(card.getAttribute('data-title'));
            const author = normalizeString(card.getAttribute('data-author'));
            const category = card.getAttribute('data-category');

            const matchesText = !query || title.includes(query) || author.includes(query);
            const matchesCategory = selectedCategory === 'Todas' || category === selectedCategory;

            if (matchesText && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Ordenação dos cards visíveis
        const sortedCards = cards.sort((a, b) => {
            if (selectedSort === 'menor-preco') {
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            } else if (selectedSort === 'maior-preco') {
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            } else if (selectedSort === 'titulo') {
                return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
            } else {
                // Relevância / ID original
                return parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id'));
            }
        });

        // Reinsere na ordem ordenada
        sortedCards.forEach(card => booksGrid.appendChild(card));

        // Atualização dos indicadores de contagem e botão de limpeza
        if (resultsCounter) {
            resultsCounter.textContent = `${visibleCount} ${visibleCount === 1 ? 'livro encontrado' : 'livros encontrados'}`;
        }

        const isFiltered = query.length > 0 || (selectedCategory && selectedCategory !== 'Todas') || selectedSort !== 'relevancia';
        if (btnResetFilters) {
            if (isFiltered) {
                btnResetFilters.classList.add('active');
            } else {
                btnResetFilters.classList.remove('active');
            }
        }

        // Estado de "Nenhum resultado"
        if (noResultsBox) {
            noResultsBox.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Ouvintes com resposta instantânea
    searchInput.addEventListener('input', applyFilterAndSort);
    if (categorySelect) categorySelect.addEventListener('change', applyFilterAndSort);
    if (sortSelect) sortSelect.addEventListener('change', applyFilterAndSort);

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilterAndSort();
            const catalogoSection = document.getElementById('catalogo');
            if (catalogoSection) {
                catalogoSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', function() {
            searchInput.value = '';
            if (categorySelect) categorySelect.value = 'Todas';
            if (sortSelect) sortSelect.value = 'relevancia';
            applyFilterAndSort();
        });
    }

    // Executa uma primeira verificação para registrar o contador inicial
    applyFilterAndSort();
}

// ==========================================================================
// 3. INTEGRAÇÃO DE COMPRA COM CHECKOUT STRIPE (SIMULAÇÃO PROFISSIONAL)
// ==========================================================================
let currentSelectedBook = null;

function initStripeModal() {
    const modalOverlay = document.getElementById('stripe-modal');
    if (!modalOverlay) return;

    const modalCloseBtn = document.getElementById('modal-close-btn');
    const autofillTestBtn = document.getElementById('btn-autofill-test');
    const paymentForm = document.getElementById('stripe-payment-form');
    const btnPay = document.getElementById('btn-stripe-pay');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpInput = document.getElementById('card-exp');
    const cardCvcInput = document.getElementById('card-cvc');
    const cardCpfInput = document.getElementById('customer-cpf');
    const brandIndicator = document.getElementById('card-brand-indicator');
    const btnFinishSuccess = document.getElementById('btn-finish-success');

    // Fechamento do modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        resetModalViews();
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    if (btnFinishSuccess) {
        btnFinishSuccess.addEventListener('click', closeModal);
    }

    // Delegação de cliques em botões "Comprar"
    document.addEventListener('click', function(e) {
        const buyButton = e.target.closest('.buy-btn') || e.target.closest('[data-buy-id]');
        if (buyButton) {
            e.preventDefault();
            const bookId = parseInt(buyButton.getAttribute('data-buy-id') || buyButton.closest('.book-card')?.getAttribute('data-id') || '1');
            openCheckoutForBook(bookId);
        }
    });

    // Detecção e formatação de cartão
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted;

            // Identificação de bandeira
            let brand = 'Cartão';
            if (/^4/.test(val)) brand = 'VISA';
            else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) brand = 'MASTERCARD';
            else if (/^3[47]/.test(val)) brand = 'AMEX';
            else if (/^(4011|5067|4576|5041)/.test(val)) brand = 'ELO';

            if (brandIndicator) {
                brandIndicator.innerHTML = `<span class="card-brand-tag">${brand}</span>`;
            }
        });
    }

    // Formatação de validade MM/AA
    if (cardExpInput) {
        cardExpInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 3) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2);
            } else {
                e.target.value = val;
            }
        });
    }

    // Formatação de CVC
    if (cardCvcInput) {
        cardCvcInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Formatação de CPF
    if (cardCpfInput) {
        cardCpfInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (val.length > 9) {
                e.target.value = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            } else if (val.length > 6) {
                e.target.value = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (val.length > 3) {
                e.target.value = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            } else {
                e.target.value = val;
            }
        });
    }

    // Preenchimento de dados de teste Stripe (1 clique)
    if (autofillTestBtn) {
        autofillTestBtn.addEventListener('click', function() {
            document.getElementById('customer-name').value = 'Gabriel Henrique';
            document.getElementById('customer-email').value = 'cliente.teste@exemplo.com';
            if (cardCpfInput) cardCpfInput.value = '123.456.789-00';
            if (cardNumberInput) {
                cardNumberInput.value = '4242 4242 4242 4242';
                if (brandIndicator) brandIndicator.innerHTML = '<span class="card-brand-tag">VISA TEST</span>';
            }
            if (cardExpInput) cardExpInput.value = '12/28';
            if (cardCvcInput) cardCvcInput.value = '123';
        });
    }

    // Processamento do pagamento simulado via Stripe
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formView = document.getElementById('checkout-form-view');
            const processingView = document.getElementById('checkout-processing-view');
            const successView = document.getElementById('checkout-success-view');

            if (formView) formView.classList.add('hidden');
            if (processingView) processingView.classList.remove('hidden');

            // Simula latência realista do gateway Stripe (1.2 segundos)
            setTimeout(() => {
                const randomStripeId = 'ch_' + Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
                const customerEmail = document.getElementById('customer-email').value || 'cliente@exemplo.com';
                const cardDigits = (cardNumberInput.value.replace(/\s/g, '').slice(-4)) || '4242';

                // Atualiza o recibo
                const receiptIdEl = document.getElementById('receipt-transaction-id');
                const receiptBookEl = document.getElementById('receipt-book-title');
                const receiptPriceEl = document.getElementById('receipt-total-price');
                const receiptCardEl = document.getElementById('receipt-card-brand');
                const receiptEmailEl = document.getElementById('receipt-email-target');

                if (receiptIdEl) receiptIdEl.textContent = randomStripeId;
                if (receiptBookEl && currentSelectedBook) receiptBookEl.textContent = currentSelectedBook.title;
                if (receiptPriceEl && currentSelectedBook) receiptPriceEl.textContent = formatCurrency(currentSelectedBook.price);
                if (receiptCardEl) receiptCardEl.textContent = `Cartão final ${cardDigits}`;
                if (receiptEmailEl) receiptEmailEl.textContent = customerEmail;

                if (processingView) processingView.classList.add('hidden');
                if (successView) successView.classList.remove('hidden');
            }, 1200);
        });
    }
}

// Abre o modal carregando os dados do livro correspondente
function openCheckoutForBook(bookId) {
    const modalOverlay = document.getElementById('stripe-modal');
    if (!modalOverlay) return;

    const book = BOOKS_DATABASE.find(b => b.id === bookId) || BOOKS_DATABASE[0];
    currentSelectedBook = book;

    // Preenche as informações no resumo do pedido
    const modalImg = document.getElementById('modal-book-img');
    const modalTitle = document.getElementById('modal-book-title');
    const modalAuthor = document.getElementById('modal-book-author');
    const modalCond = document.getElementById('modal-book-cond');
    const subtotalEl = document.getElementById('modal-order-subtotal');
    const totalEl = document.getElementById('modal-order-total');
    const btnPayText = document.getElementById('btn-pay-amount');

    if (modalImg) modalImg.src = book.image;
    if (modalImg) modalImg.alt = book.title;
    if (modalTitle) modalTitle.textContent = book.title;
    if (modalAuthor) modalAuthor.textContent = book.author;
    if (modalCond) modalCond.textContent = book.condition;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(book.price);
    if (totalEl) totalEl.textContent = formatCurrency(book.price);
    if (btnPayText) btnPayText.textContent = `Pagar ${formatCurrency(book.price)}`;

    resetModalViews();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function resetModalViews() {
    const formView = document.getElementById('checkout-form-view');
    const processingView = document.getElementById('checkout-processing-view');
    const successView = document.getElementById('checkout-success-view');

    if (formView) formView.classList.remove('hidden');
    if (processingView) processingView.classList.add('hidden');
    if (successView) successView.classList.add('hidden');
}

// ==========================================================================
// 4. FORMULÁRIO "QUERO VENDER" COM FEEDBACK PROFISSIONAL
// ==========================================================================
function initSellForm() {
    const sellForm = document.getElementById('vender-form');
    const sellAlert = document.getElementById('vender-success-alert');

    if (sellForm) {
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (sellAlert) {
                sellAlert.classList.add('success');
                sellAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            sellForm.reset();

            setTimeout(() => {
                if (sellAlert) sellAlert.classList.remove('success');
            }, 6000);
        });
    }
}

// ==========================================================================
// 5. PÁGINA DE DETALHES DO LIVRO (book_info.html)
// ==========================================================================
function initBookDetailsPage() {
    const detailsRoot = document.getElementById('book-details-root');
    if (!detailsRoot) return;

    // Obtém o parâmetro id da URL (ex: book_info.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id') || '1');
    const book = BOOKS_DATABASE.find(b => b.id === bookId) || BOOKS_DATABASE[0];

    // Atualiza o título da aba do navegador
    document.title = `${book.title} - Livraria Virtual`;

    // Atualiza os campos de detalhes
    const breadcrumbTitle = document.getElementById('details-breadcrumb-title');
    const coverImg = document.getElementById('details-cover-img');
    const titleEl = document.getElementById('details-title');
    const authorEl = document.getElementById('details-author');
    const categoryTag = document.getElementById('details-category-tag');
    const conditionTag = document.getElementById('details-condition-tag');
    const priceEl = document.getElementById('details-price');
    const descEl = document.getElementById('details-description');
    const buyBtn = document.getElementById('details-buy-btn');

    // Metadados da tabela
    const specPublisher = document.getElementById('spec-publisher');
    const specPages = document.getElementById('spec-pages');
    const specYear = document.getElementById('spec-year');
    const specCond = document.getElementById('spec-condition');

    if (breadcrumbTitle) breadcrumbTitle.textContent = book.title;
    if (coverImg) {
        coverImg.src = book.image;
        coverImg.alt = `Capa do livro ${book.title}`;
    }
    if (titleEl) titleEl.textContent = book.title;
    if (authorEl) authorEl.textContent = `Por ${book.author}`;
    if (categoryTag) categoryTag.textContent = book.category;
    if (conditionTag) conditionTag.textContent = book.condition;
    if (priceEl) priceEl.textContent = formatCurrency(book.price);
    if (descEl) descEl.textContent = book.description;

    if (specPublisher) specPublisher.textContent = book.publisher;
    if (specPages) specPages.textContent = `${book.pages} páginas`;
    if (specYear) specYear.textContent = book.year;
    if (specCond) specCond.textContent = book.condition;

    if (buyBtn) {
        buyBtn.setAttribute('data-buy-id', book.id);
        buyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCheckoutForBook(book.id);
        });
    }
}
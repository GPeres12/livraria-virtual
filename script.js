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

    // Close on link click
    document.querySelectorAll('.nav-menu a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Handle book purchase buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get book information from the card
            const bookCard = this.closest('.book-card');
            const title = bookCard.querySelector('h3').textContent.trim();
            
            // Extract author (everything before "R$")
            const pElement = bookCard.querySelector('p');
            const fullText = pElement.textContent;
            const author = fullText.split('R$')[0].trim();
            
            // Get book cover image
            const imgElement = bookCard.querySelector('.book-img img');
            const coverImage = imgElement ? imgElement.src : '';
            
            console.log('Livro clicado:');
            console.log('  Titulo:', title);
            console.log('  Autor:', author);
            console.log('  Capa:', coverImage);
            
            // Store in localStorage
            localStorage.setItem('selectedBook', JSON.stringify({
                title: title,
                author: author,
                coverImage: coverImage
            }));
            
            // Redirect to book info page
            window.location.href = 'book_info.html';
        });
    });
});

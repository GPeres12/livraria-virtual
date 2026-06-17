// 2 to be more precise.
// Open Library
const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';
// Google Books
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Capa da tela principal para usar como fallback caso as APIs não retornem capa.
let fallbackCoverImage = '';

document.addEventListener('DOMContentLoaded', function() {
    const selectedBook = localStorage.getItem('selectedBook');

    if (!selectedBook) {
        showError();
        return;
    }

    try {
        const bookData = JSON.parse(selectedBook);
        console.log('Procurando livro:', bookData);
        
        // Store fallback cover image
        fallbackCoverImage = bookData.coverImage || '';
        console.log('Capa de fallback:', fallbackCoverImage);
        
        // Show what we're searching for
        document.getElementById('loading').innerHTML = `<p>Procurando: <strong>${bookData.title}</strong> por <strong>${bookData.author}</strong></p><p>Conectando com base de dados...</p>`;
        
        searchBookInOpenLibrary(bookData.title, bookData.author);
    } catch (error) {
        console.error('Erro ao fazer parse do localStorage:', error);
        showError();
    }
});

// Open Library - MELHOR PARA PORTUGUÊS
async function searchBookInOpenLibrary(title, author) {
    try {
        const query = `${title} ${author}`;
        const url = `${OPEN_LIBRARY_API}?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=10`;

        console.log('=== BUSCA 1: OPEN LIBRARY (COM AUTOR) ===');
        console.log('Titulo:', title);
        console.log('Autor:', author);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta - Total de resultados:', data.docs ? data.docs.length : 0);

        if (data.docs && data.docs.length > 0) {
            // Find best match
            for (let i = 0; i < data.docs.length; i++) {
                const book = data.docs[i];
                console.log(`\nValidando resultado ${i + 1}/${data.docs.length}:`);
                
                if (validateBookMatch(book, title, author)) {
                    console.log('✅ Livro correspondente encontrado!');
                    displayBookInfoOpenLibrary(book);
                    return;
                }
            }
            
            console.log('❌ Nenhum resultado correspondente. Tentando sem acentos...');
            searchByTitleNoAccents(title, author);
        } else {
            console.log('❌ Nenhum resultado. Tentando sem acentos...');
            searchByTitleNoAccents(title, author);
        }
    } catch (error) {
        console.error('Erro ao buscar em Open Library:', error);
        console.log('Tentando Google Books como fallback...');
        searchBookInGoogleBooks(title, author);
    }
}

async function searchByTitleNoAccents(title, author) {
    try {
        // Remove accents
        const titleNoAccents = removeAccents(title);
        const authorNoAccents = removeAccents(author);
        
        const url = `${OPEN_LIBRARY_API}?title=${encodeURIComponent(titleNoAccents)}&author=${encodeURIComponent(authorNoAccents)}&limit=10`;
        
        console.log('=== BUSCA 2: OPEN LIBRARY (SEM ACENTOS) ===');
        console.log('Titulo:', titleNoAccents);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta - Total de resultados:', data.docs ? data.docs.length : 0);

        if (data.docs && data.docs.length > 0) {
            // Find best match
            for (let i = 0; i < data.docs.length; i++) {
                const book = data.docs[i];
                console.log(`\nValidando resultado ${i + 1}/${data.docs.length}:`);
                
                if (validateBookMatch(book, title, author)) {
                    console.log('✅ Livro correspondente encontrado!');
                    displayBookInfoOpenLibrary(book);
                    return;
                }
            }
            
            console.log('❌ Nenhum resultado correspondente. Tentando primeira palavra...');
            searchByFirstWord(title, author);
        } else {
            console.log('❌ Nenhum resultado. Tentando primeira palavra...');
            searchByFirstWord(title, author);
        }
    } catch (error) {
        console.error('Erro ao buscar sem acentos:', error);
        searchByFirstWord(title, author);
    }
}

async function searchByFirstWord(title, author) {
    try {
        const firstWord = title.split(' ')[0];
        const url = `${OPEN_LIBRARY_API}?title=${encodeURIComponent(firstWord)}&limit=10`;
        
        console.log('=== BUSCA 3: OPEN LIBRARY (PRIMEIRA PALAVRA) ===');
        console.log('Primeira palavra:', firstWord);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta - Total de resultados:', data.docs ? data.docs.length : 0);

        if (data.docs && data.docs.length > 0) {
            // Find best match
            for (let i = 0; i < data.docs.length; i++) {
                const book = data.docs[i];
                console.log(`\nValidando resultado ${i + 1}/${data.docs.length}:`);
                
                if (validateBookMatch(book, title, author)) {
                    console.log('✅ Livro correspondente encontrado!');
                    displayBookInfoOpenLibrary(book);
                    return;
                }
            }
            
            console.log('❌ Nenhum resultado correspondente. Tentando Google Books...');
            searchBookInGoogleBooks(title, author);
        } else {
            console.log('❌ Nenhum resultado. Tentando Google Books...');
            searchBookInGoogleBooks(title, author);
        }
    } catch (error) {
        console.error('Erro ao buscar primeira palavra:', error);
        searchBookInGoogleBooks(title, author);
    }
}

// Google Books - FALLBACK
async function searchBookInGoogleBooks(title, author) {
    try {
        const query = `${title} ${author}`;
        const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5&langRestrict=pt`;

        console.log('=== BUSCA 4: GOOGLE BOOKS (FALLBACK) ===');
        console.log('Query:', query);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta - Total de resultados:', data.items ? data.items.length : 0);

        if (data.items && data.items.length > 0) {
            // Find best match
            for (let i = 0; i < data.items.length; i++) {
                const bookInfo = data.items[i].volumeInfo;
                console.log(`\nValidando resultado ${i + 1}/${data.items.length}:`);
                
                const foundTitle = bookInfo.title || '';
                const foundAuthors = bookInfo.authors ? bookInfo.authors[0] : '';
                
                const titleSim = calculateSimilarity(foundTitle, title);
                const authorSim = calculateSimilarity(foundAuthors, author);
                
                console.log(`  "${foundTitle}" (${(titleSim * 100).toFixed(0)}%)`);
                console.log(`  Autor: "${foundAuthors}" (${(authorSim * 100).toFixed(0)}%)`);
                
                if (titleSim >= 0.6 && (author === '' || authorSim >= 0.4)) {
                    console.log('✅ Livro correspondente encontrado!');
                    displayBookInfoGoogle(bookInfo);
                    return;
                }
            }
            
            console.log('❌ Nenhum resultado correspondente. Tentando título simples...');
            searchGoogleByTitleOnly(title);
        } else {
            console.log('❌ Nenhum resultado. Exibindo dados minimos...');
            displayMinimalInfo(title, author);
        }
    } catch (error) {
        console.error('Erro ao buscar no Google Books:', error);
        console.log('Exibindo dados minimos...');
        displayMinimalInfo(title, author);
    }
}

// Google Books - Search by title only
async function searchGoogleByTitleOnly(title) {
    try {
        const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(title)}&maxResults=5`;

        console.log('=== BUSCA 5: GOOGLE BOOKS (APENAS TITULO) ===');
        console.log('Query:', title);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta - Total de resultados:', data.items ? data.items.length : 0);

        if (data.items && data.items.length > 0) {
            const bookInfo = data.items[0].volumeInfo;
            console.log('✅ Primeiro resultado encontrado');
            displayBookInfoGoogle(bookInfo);
        } else {
            console.log('❌ Nenhum resultado. Exibindo dados minimos...');
            displayMinimalInfo(title, '');
        }
    } catch (error) {
        console.error('Erro ao buscar titulo no Google Books:', error);
        displayMinimalInfo(title, '');
    }
}

// Remove accents from string
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Calculate similarity between two strings (0 to 1)
function calculateSimilarity(str1, str2) {
    const s1 = removeAccents(str1.toLowerCase().trim());
    const s2 = removeAccents(str2.toLowerCase().trim());
    
    // If one contains the other, it's a good match
    if (s1.includes(s2) || s2.includes(s1)) {
        return 0.9;
    }
    
    // Levenshtein distance (simple similarity)
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance algorithm
function levenshteinDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

// Validate if found book matches the searched book
function validateBookMatch(foundBook, searchTitle, searchAuthor) {
    const foundTitle = foundBook.title || '';
    const foundAuthors = foundBook.author_name ? foundBook.author_name[0] : '';
    
    const titleSimilarity = calculateSimilarity(foundTitle, searchTitle);
    const authorSimilarity = searchAuthor ? calculateSimilarity(foundAuthors, searchAuthor) : 0.7;
    
    console.log(`  Validando: "${foundTitle}" vs "${searchTitle}" (${(titleSimilarity * 100).toFixed(0)}%)`);
    console.log(`  Autor: "${foundAuthors}" vs "${searchAuthor}" (${(authorSimilarity * 100).toFixed(0)}%)`);
    
    // Need at least 60% title similarity and 50% author similarity (if author provided)
    const titleOk = titleSimilarity >= 0.6;
    const authorOk = !searchAuthor || authorSimilarity >= 0.5;
    
    return titleOk && authorOk;
}

// Display minimal info when no API returns data
function displayMinimalInfo(title, author) {
    document.getElementById('loading').style.display = 'none';

    // Set book title
    document.getElementById('book-title').textContent = title || 'Título não disponível';

    // Set book author
    document.getElementById('book-author').textContent = author ? `por ${author}` : '';

    // Hide unavailable sections
    document.getElementById('book-publisher').style.display = 'none';
    document.getElementById('book-published').style.display = 'none';
    document.getElementById('book-pages').style.display = 'none';
    document.getElementById('book-rating').textContent = 'Dados não disponíveis';
    document.getElementById('description-section').style.display = 'none';

    // Show cover (use fallback if available)
    if (fallbackCoverImage) {
        document.getElementById('book-cover').src = fallbackCoverImage;
        console.log('✅ Usando capa do catálogo:', fallbackCoverImage);
    } else {
        document.getElementById('book-cover').src = 'https://via.placeholder.com/200x300?text=' + encodeURIComponent(title.substring(0, 10));
    }

    // Show book details
    document.getElementById('book-details').style.display = 'grid';

    // Add event listeners to buttons
    const btn = document.querySelector('.btn-buy');
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    if (btn && !btn.onclick) {
        btn.addEventListener('click', function() {
            alert(`Obrigado por comprar "${title}"!\n\nEste é um protótipo. Em um site real, você seria redirecionado para o pagamento.`);
        });
    }
    
    if (wishlistBtn && !wishlistBtn.onclick) {
        wishlistBtn.addEventListener('click', function() {
            alert(`"${title}" foi adicionado à sua wishlist!`);
        });
    }

    console.log('✅ Dados minimos exibidos para:', title);
}

// Exibir dados da Open Library
function displayBookInfoOpenLibrary(book) {
    // Hide loading
    document.getElementById('loading').style.display = 'none';

    // Set book title
    const title = book.title || 'Título não disponível';
    document.getElementById('book-title').textContent = title;

    // Set book author
    const authors = book.author_name ? book.author_name.join(', ') : 'Autor não disponível';
    document.getElementById('book-author').textContent = `por ${authors}`;

    // Set publisher
    if (book.publisher && book.publisher.length > 0) {
        document.getElementById('book-publisher').textContent = `Editora: ${book.publisher[0]}`;
    } else {
        document.getElementById('book-publisher').style.display = 'none';
    }

    // Set published date
    if (book.publish_date && book.publish_date.length > 0) {
        document.getElementById('book-published').textContent = `Publicado em: ${book.publish_date[0]}`;
    } else {
        document.getElementById('book-published').style.display = 'none';
    }

    // Set page count
    if (book.number_of_pages_median) {
        document.getElementById('book-pages').textContent = `Páginas: ${book.number_of_pages_median}`;
    } else {
        document.getElementById('book-pages').style.display = 'none';
    }

    // Set book cover
    if (book.cover_i) {
        const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        document.getElementById('book-cover').src = coverUrl;
        console.log('✅ Capa encontrada na API:', coverUrl);
    } else if (fallbackCoverImage) {
        document.getElementById('book-cover').src = fallbackCoverImage;
        console.log('✅ Usando capa do catálogo:', fallbackCoverImage);
    } else {
        document.getElementById('book-cover').src = 'https://via.placeholder.com/200x300?text=Sem+Capa';
        console.log('⚠️ Nenhuma capa disponível');
    }

    // Set rating
    if (book.ratings_average) {
        const stars = '⭐'.repeat(Math.round(book.ratings_average));
        const ratingCount = book.ratings_count ? book.ratings_count : 0;
        document.getElementById('book-rating').textContent = `${stars} ${book.ratings_average.toFixed(1)}/5 (${ratingCount} avaliações)`;
    } else {
        document.getElementById('book-rating').textContent = 'Sem avaliações';
    }

    // Set description (OpenLibrary não tem description direta, usar primeiro_publish_year como info)
    const description = book.key ? `<p>Primeiro publicado em ${book.first_publish_year}.</p><p>Categorias: ${book.subject ? book.subject.slice(0, 5).join(', ') : 'Não especificado'}</p>` : '';
    if (description) {
        document.getElementById('book-description').innerHTML = description;
        document.getElementById('description-section').style.display = 'block';
    } else {
        document.getElementById('description-section').style.display = 'none';
    }

    // Show book details
    document.getElementById('book-details').style.display = 'grid';

    // Add event listeners to buttons
    document.querySelector('.btn-buy').addEventListener('click', function() {
        alert(`Obrigado por comprar "${title}"!\n\nEste é um protótipo. Em um site real, você seria redirecionado para o pagamento.`);
    });

    document.querySelector('.btn-wishlist').addEventListener('click', function() {
        alert(`"${title}" foi adicionado à sua wishlist!`);
    });
}

// Exibir dados do Google Books
function displayBookInfoGoogle(book) {
    // Hide loading
    document.getElementById('loading').style.display = 'none';

    // Set book title
    const title = book.title || 'Título não disponível';
    document.getElementById('book-title').textContent = title;

    // Set book author
    const authors = book.authors ? book.authors.join(', ') : 'Autor não disponível';
    document.getElementById('book-author').textContent = `por ${authors}`;

    // Set publisher
    if (book.publisher) {
        document.getElementById('book-publisher').textContent = `Editora: ${book.publisher}`;
    } else {
        document.getElementById('book-publisher').style.display = 'none';
    }

    // Set published date
    if (book.publishedDate) {
        const date = new Date(book.publishedDate);
        const formattedDate = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('book-published').textContent = `Publicado em: ${formattedDate}`;
    } else {
        document.getElementById('book-published').style.display = 'none';
    }

    // Set page count
    if (book.pageCount) {
        document.getElementById('book-pages').textContent = `Páginas: ${book.pageCount}`;
    } else {
        document.getElementById('book-pages').style.display = 'none';
    }

    // Set book cover
    if (book.imageLinks && book.imageLinks.thumbnail) {
        const coverUrl = book.imageLinks.thumbnail.replace('http://', 'https://');
        document.getElementById('book-cover').src = coverUrl;
        console.log('✅ Capa encontrada no Google Books:', coverUrl);
    } else if (fallbackCoverImage) {
        document.getElementById('book-cover').src = fallbackCoverImage;
        console.log('✅ Usando capa do catálogo:', fallbackCoverImage);
    } else {
        document.getElementById('book-cover').src = 'https://via.placeholder.com/200x300?text=Sem+Capa';
        console.log('⚠️ Nenhuma capa disponível');
    }

    // Set rating
    if (book.averageRating) {
        const stars = '⭐'.repeat(Math.round(book.averageRating));
        document.getElementById('book-rating').textContent = `${stars} ${book.averageRating}/5 (${book.ratingsCount || 0} avaliações)`;
    } else {
        document.getElementById('book-rating').textContent = 'Sem avaliações';
    }

    // Set description
    if (book.description) {
        document.getElementById('book-description').innerHTML = book.description;
        document.getElementById('description-section').style.display = 'block';
    } else {
        document.getElementById('description-section').style.display = 'none';
    }

    // Show book details
    document.getElementById('book-details').style.display = 'grid';

    // Add event listeners to buttons
    document.querySelector('.btn-buy').addEventListener('click', function() {
        alert(`Obrigado por comprar "${title}"!\n\nEste é um protótipo. Em um site real, você seria redirecionado para o pagamento.`);
    });

    document.querySelector('.btn-wishlist').addEventListener('click', function() {
        alert(`"${title}" foi adicionado à sua wishlist!`);
    });
}

function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
}
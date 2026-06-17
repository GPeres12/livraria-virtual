document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close on resize desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
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

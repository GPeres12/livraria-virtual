# Livraria Virtual — Livros Novos e Seminovos

A **Livraria Virtual** é uma plataforma online desenvolvida para conectar leitores e incentivar o acesso à leitura e à economia circular por meio da comercialização de livros novos e seminovos em excelente estado de conservação.

---

## Funcionalidades Implementadas

* **Busca Dinâmica em Tempo Real:** Pesquisa instantânea por título e autor com tolerância a acentos gráficos.
* **Filtros por Categoria:** Navegação refinada entre Literatura Brasileira, Literatura Internacional, Romance, Ficção e Fantasia, e Suspense.
* **Ordenação Inteligente:** Classificação por relevância, menor preço, maior preço e ordem alfabética.
* **Checkout com Gateway Stripe (Simulação Segura):**
  - Modal integrado com resumo de pedido, frete e dados de cobrança.
  - Validação de cartão, máscara de preenchimento e detecção automática de bandeira (Visa, Mastercard, Elo, Amex).
  - Botão de auto-preenchimento com cartão de testes oficial da Stripe (4242...).
  - Tela de processamento com latência simulada e emissão de recibo com código de transação Stripe (`ch_...`).
  - Preparado para inserção de Chave Pública (`publishableKey`) para ativação de cobranças reais.
* **Página de Detalhes da Obra (`book_info.html`):** Visualização completa com sinopse, especificações técnicas (páginas, editora, ano, condição) e gatilho direto para checkout.
* **Módulo 'Quero Vender':** Formulário para novos anúncios com validação e feedback visual ao usuário.
* **Design Harmonioso e Profissional:** Tipografia refinada (Playfair Display e Plus Jakarta Sans), paleta terracota e creme original preservada, sombras suaves e efeito 3D de lombada para livros.

---

## Como Configurar a API Real da Stripe

Para transicionar do modo de simulação fictícia para o modo de cobrança em produção:

1. Acesse o painel da Stripe em [dashboard.stripe.com](https://dashboard.stripe.com).
2. Obtenha sua chave pública (`Publishable key`), que inicia com `pk_test_...` (ambiente de testes) ou `pk_live_...` (produção).
3. No arquivo `script.js`, insira sua chave na constante `STRIPE_CONFIG`:
   ```javascript
   const STRIPE_CONFIG = {
       publishableKey: 'SUA_CHAVE_PUBLICA_AQUI',
       isSimulation: false
   };
   ```

---

## Tecnologias Utilizadas

* **Frontend:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Flexbox, Grid), JavaScript (ES6+).
* **Gateway de Pagamento:** Stripe Checkout / Elements (Modo de simulação seguro com arquitetura pronta para API oficial).

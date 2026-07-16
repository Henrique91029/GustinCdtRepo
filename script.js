const firebaseConfig = {
  apiKey: "AIzaSyAcGdHraoyiIlSh3_Z3n7ho7o_jtTaMI2g",
  authDomain: "gustincdt-b179b.firebaseapp.com",
  projectId: "gustincdt-b179b",
  storageBucket: "gustincdt-b179b.firebasestorage.app",
  messagingSenderId: "281963712110",
  appId: "1:281963712110:web:e1b7c2a11d6e9c6a32e07f",
  measurementId: "G-DX452KY288"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    const pegarElemento = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn(`Aviso: O elemento com ID '${id}' não foi encontrado no HTML.`);
        return el;
    };

    // Elements de Abertura / Fechamento dos Modais corrigidos
    const openGarageBtn = pegarElemento('open-garage-btn');
    const closeGarageBtn = pegarElemento('close-garage-btn');
    const modalGarage = pegarElemento('modal-garage');

    const openShopBtn = pegarElemento('open-shop-btn');
    const closeShopBtn = pegarElemento('close-shop-btn');
    const modalShop = pegarElemento('modal-shop');
    const shopItemsContainer = pegarElemento('shop-items-container');

    const adminTriggerBtn = pegarElemento('admin-trigger-btn');
    const closeAdminBtn = pegarElemento('close-admin-btn');
    const modalAdmin = pegarElemento('modal-admin');
    const adminItemForm = pegarElemento('admin-item-form');
    const adminItemsList = pegarElemento('admin-items-list');

    const modalLogin = pegarElemento('modal-login');
    const closeLoginBtn = pegarElemento('close-login-btn');
    const loginForm = pegarElemento('login-form');
    const loginSubmitBtn = pegarElemento('login-submit-btn');

    const fade = pegarElemento('fade');
    const garageForm = pegarElemento('garage-form');
    const submitBtn = pegarElemento('submit-btn');
    const successAlert = pegarElemento('success-alert');
    const successFade = pegarElemento('success-fade');
    const closeSuccessBtn = pegarElemento('close-success-btn');

    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1524573817052332033/Vmb0eD-_Uy2cmbdKeAZZpzKw8DZbojq1FXsT_000CA9oSeQGAtqTQKluAOUhxGbVH09r";

    // Realtime Database Sync
    database.ref('produtos').on('value', (snapshot) => {
        const dados = snapshot.val();
        let listaProdutos = [];
        if (dados) {
            listaProdutos = Object.keys(dados).map(key => ({ id: key, ...dados[key] }));
        }
        renderizarLoja(listaProdutos);
        renderizarListaAdmin(listaProdutos);
    });

    function renderizarLoja(produtos) {
        if (!shopItemsContainer) return;
        shopItemsContainer.innerHTML = "";

        if (!produtos || produtos.length === 0) {
            shopItemsContainer.innerHTML = `
                <div class="empty-shop-message">
                    <span class="icon">📦</span>
                    <p><strong>Nenhum item disponível no momento!</strong><br>
                    Fique atento aos nossos canais oficiais para novidades.</p>
                </div>`;
            return;
        }

        // Filtra os produtos por categoria
        const tokens = produtos.filter(p => p.tipo === 'token');
        const carros = produtos.filter(p => p.tipo === 'carro');

        // Renderiza seção de TOKENS
        if (tokens.length > 0) {
            const tituloTokens = document.createElement('h3');
            tituloTokens.className = 'shop-section-title';
            tituloTokens.innerHTML = "🪙 TOKENS & MOEDAS";
            shopItemsContainer.appendChild(tituloTokens);

            tokens.forEach(item => {
                const card = document.createElement('div');
                card.className = 'shop-card';
                card.innerHTML = `
                    <h3>${item.nome}</h3>
                    <p class="price">${item.preco}</p>
                    <a href="${item.link}" target="_blank" class="buy-btn">🛒 Comprar Direct</a>`;
                shopItemsContainer.appendChild(card);
            });
        }

        // Renderiza seção de CARROS
        if (carros.length > 0) {
            const tituloCarros = document.createElement('h3');
            tituloCarros.className = 'shop-section-title';
            tituloCarros.innerHTML = "🚗 VEÍCULOS EXCLUSIVOS";
            shopItemsContainer.appendChild(tituloCarros);

            carros.forEach(item => {
                const card = document.createElement('div');
                card.className = 'shop-card';
                card.innerHTML = `
                    <h3>${item.nome}</h3>
                    <p class="price">${item.preco}</p>
                    <a href="${item.link}" target="_blank" class="buy-btn">🛒 Comprar Direct</a>`;
                shopItemsContainer.appendChild(card);
            });
        }
    }

    function renderizarListaAdmin(produtos) {
        if (!adminItemsList) return;
        adminItemsList.innerHTML = "";
        if (!produtos || produtos.length === 0) {
            adminItemsList.innerHTML = `<p style="color: #64748b; font-size: 0.85rem;">Nenhum produto cadastrado.</p>`;
        } else {
            produtos.forEach(item => {
                const tipoEmoji = item.tipo === 'token' ? '🪙' : '🚗';
                const row = document.createElement('div');
                row.className = 'admin-card-row';
                row.innerHTML = `
                    <span>${tipoEmoji} <strong>${item.nome}</strong> - ${item.preco}</span>
                    <button class="del-btn" data-id="${item.id}">Remover</button>`;
                adminItemsList.appendChild(row);
            });
        }

        document.querySelectorAll('.del-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const firebaseId = e.target.getAttribute('data-id');
                database.ref('produtos/' + firebaseId).remove();
            });
        });
    }

    if (adminItemForm) {
        adminItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tipo = document.getElementById('admin-item-type').value;
            const nome = document.getElementById('admin-item-name').value;
            const preco = document.getElementById('admin-item-price').value;
            const link = document.getElementById('admin-item-link').value;

            // Agora salva com a propriedade 'tipo'
            database.ref('produtos').push({ tipo, nome, preco, link });
            adminItemForm.reset();
        });
    }

    // Controle Unificado dos Modais
    const fecharTodosModais = () => {
        if (modalGarage) modalGarage.classList.add('hide');
        if (modalShop) modalShop.classList.add('hide');
        if (modalAdmin) modalAdmin.classList.add('hide');
        if (modalLogin) modalLogin.classList.add('hide');
        if (fade) fade.classList.add('hide');
    };

    if (openGarageBtn && modalGarage && fade) openGarageBtn.addEventListener('click', () => { fecharTodosModais(); modalGarage.classList.remove('hide'); fade.classList.remove('hide'); });
    if (closeGarageBtn) closeGarageBtn.addEventListener('click', fecharTodosModais);

    if (openShopBtn && modalShop && fade) openShopBtn.addEventListener('click', () => { fecharTodosModais(); modalShop.classList.remove('hide'); fade.classList.remove('hide'); });
    if (closeShopBtn) closeShopBtn.addEventListener('click', fecharTodosModais);

    if (adminTriggerBtn && modalLogin && fade) {
        adminTriggerBtn.addEventListener('click', () => {
            fecharTodosModais();
            modalLogin.classList.remove('hide');
            fade.classList.remove('hide');
        });
    }
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', fecharTodosModais);
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', fecharTodosModais);

    if (fade) fade.addEventListener('click', fecharTodosModais);

    if (closeSuccessBtn && successAlert && successFade) {
        closeSuccessBtn.addEventListener('click', () => {
            successAlert.classList.add('hide');
            successFade.classList.add('hide');
        });
    }

    // Login Auth
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (loginSubmitBtn) loginSubmitBtn.innerText = "Autenticando...";

            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, senha)
                .then((userCredential) => {
                    loginForm.reset();
                    fecharTodosModais();
                    if (modalAdmin && fade) {
                        modalAdmin.classList.remove('hide');
                        fade.classList.remove('hide');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Erro no Login: Verifique se o e-mail e senha estão corretos no Firebase.");
                })
                .finally(() => {
                    if (loginSubmitBtn) loginSubmitBtn.innerText = "Entrar no Painel";
                });
        });
    }

    // Webhook Discord
    if (garageForm) {
        garageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn) { submitBtn.innerText = "Enviando..."; submitBtn.disabled = true; }

            const nick = document.getElementById('player-name').value;
            const meioContato = document.getElementById('contact-method').value;
            const contatoInfo = document.getElementById('player-contact').value;
            const modelo = document.getElementById('car-model').value;
            const quantidade = document.getElementById('car-quantity').value;
            const valor = document.getElementById('car-price').value;
            const mensagem = document.getElementById('car-notes').value || "Nenhuma mensagem enviada.";
            const fotoInput = document.getElementById('car-photo');

            const formData = new FormData();
            const conteudoDiscord = `\n🏎️ **NOVO ANÚNCIO DE DESPEDIDA!** 🏎️\n━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 **Jogador:** ${nick}\n📱 **Meio de Contato:** Preferência por **${meioContato}**\n📞 **Contato Direct:** ${contatoInfo}\n🚗 **Modelo do Carro:** ${modelo}\n📦 **Quantidade:** ${quantidade}\n💰 **Valor:** ${valor}\n📝 **Mensagem:** ${mensagem}\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💬 *Entre em contato com o anunciante usando a rede preferida dele mencionada acima.*`;

            formData.append("content", conteudoDiscord);
            if (fotoInput && fotoInput.files.length > 0) { formData.append("file", fotoInput.files[0]); }

            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, { method: "POST", body: formData });
                if (response.ok) {
                    garageForm.reset();
                    fecharTodosModais();
                    if (successAlert && successFade) { successAlert.classList.remove('hide'); successFade.classList.remove('hide'); }
                } else { alert("Houve um erro ao enviar para o Discord."); }
            } catch (error) {
                console.error(error);
                alert("Erro de conexão ao tentar enviar.");
            } finally {
                if (submitBtn) { submitBtn.innerText = "Anunciar Despedida"; submitBtn.disabled = false; }
            }
        });
    }
});
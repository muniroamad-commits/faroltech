# Farol Tech — site único (GitHub Pages) + Firebase como motor

Um único projecto, um único site, um único domínio: **faroltechmz.com**.

- O que o visitante vê (página inicial, serviços, sobre nós, clientes, contactos,
  e o portal do cliente depois de login) é tudo a mesma aplicação, publicada no
  **GitHub Pages**.
- O **Firebase** não é "outro site" — é o motor invisível por trás: login,
  base de dados dos tickets/facturas, e o pagamento. O visitante nunca o vê
  directamente, é só uma API que a aplicação chama.

## Estrutura de páginas

```
/               → página inicial
/sobre          → missão, visão, valores
/clientes       → nossos clientes
/contactos      → formulário de contacto
/servicos/:slug → detalhe de cada serviço (sites, apps, design, suporte, consultoria)
/entrar         → login
/registar       → criar conta
/portal         → dashboard do cliente (exige login)
/portal/tickets, /portal/facturas, /portal/recibo/:id
/portal/admin/tickets, /portal/admin/facturas, /portal/admin/clientes  (só admin)
```

---

## 1. Criar o projecto Firebase (o motor)

1. https://console.firebase.google.com → criar projecto
2. **Authentication** → activar Email/Palavra-passe
3. **Firestore Database** → criar (modo produção)
4. **Definições do projecto → Aplicações Web** → criar app, copiar as chaves
5. `cp .env.example .env` e preencher

## 2. Correr localmente

```
npm install
npm run dev
```

## 3. Tornar-se administrador

1. Registe a sua própria conta pelo site (`/registar`)
2. Consola Firebase → Firestore → colecção `clients` → o seu documento → mude `role` para `"admin"`
3. Recarregue — a secção "Administração" aparece no portal

Depois disso, promove outros administradores directamente pela aba **Clientes** do painel.

## 4. Publicar as regras de segurança e as funções

```
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

Para os pagamentos (PaySuite):
```
firebase functions:secrets:set PAYSUITE_SECRET_KEY
cd functions && npm install && cd ..
firebase deploy --only functions
```

## 5. Configurar o EmailJS (email automático ao criar ticket)

1. Conta gratuita em https://www.emailjs.com, ligue o seu Gmail/Outlook
2. Crie um template com: `client_name`, `client_email`, `subject`, `message`, `priority`, `to_email`
3. Copie Service ID, Template ID e Public Key para o `.env`

Sem isto, o ticket é guardado na mesma — só o email não sai.

---

## 6. Publicar no GitHub Pages (o site)

```
npm run build
```

Isto gera a pasta `dist/` com o site completo, já pronto para publicar. O
comando também copia `index.html` para `404.html` — é o truque que permite
que rotas como `/sobre` ou `/portal` funcionem correctamente no GitHub Pages
mesmo com acesso directo pelo endereço (sem isso, o GitHub mostraria erro 404
em qualquer página que não seja a inicial).

**Passos no GitHub:**

1. Crie um repositório (ex: `farol-tech-site`)
2. Publique o conteúdo da pasta `dist/` na branch `gh-pages` — a forma mais simples
   é instalar o pacote `gh-pages` e correr:
   ```
   npm install -D gh-pages
   npx gh-pages -d dist
   ```
3. Em **Settings → Pages**, escolha a branch `gh-pages` como origem
4. O ficheiro `public/CNAME` (já incluído, com `faroltechmz.com`) diz ao GitHub
   qual o domínio próprio a usar — é copiado automaticamente para `dist/` no build
5. No painel onde geriu o domínio, aponte:
   - um registo **A** para os IPs do GitHub Pages (185.199.108.153,
     185.199.109.153, 185.199.110.153, 185.199.111.153), ou
   - um registo **CNAME** de `www` para `seuutilizador.github.io`, consoante
     use o domínio raiz ou o subdomínio `www`

Depois do primeiro deploy, sempre que quiser actualizar o site basta correr
`npm run build` seguido de `npx gh-pages -d dist` outra vez.

---

## Estrutura do código

```
src/
  firebase.js                    → configuração (via .env)
  context/AuthContext.jsx        → login, registo, papel (client/admin)
  components/
    PublicLayout.jsx             → nav pública com menus suspensos + rodapé
    ProtectedRoute.jsx           → exige sessão iniciada
    AdminRoute.jsx               → exige role === "admin"
    Nav.jsx                      → barra lateral do portal (admin vê secção extra)
  pages/
    public/Home.jsx, Sobre.jsx, Clientes.jsx, Contactos.jsx, ServiceDetail.jsx
    Login.jsx, Signup.jsx
    Dashboard.jsx, Tickets.jsx, Invoices.jsx, Receipt.jsx
    AdminTickets.jsx, AdminInvoices.jsx, AdminClients.jsx
  lib/paysuite.js                → chama a Cloud Function de pagamento
functions/index.js                → lógica de pagamento (chave secreta só aqui)
firestore.rules                   → cada cliente só vê os seus dados; admin vê tudo
public/CNAME                      → domínio próprio para o GitHub Pages
```

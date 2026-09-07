# Farol Tech — site e portal (versão simplificada)

Um único site, um único domínio: **faroltechmz.com**. Publicado no GitHub Pages,
com o Firebase só como motor invisível por trás (login, tickets, facturas).

Removemos a ligação automática à PaySuite (exigia o plano Blaze do Firebase,
que precisa de cartão associado por causa do Cloud Functions/Cloud Build). Os
pagamentos ficam, por agora, com **confirmação manual** — o cliente paga por
M-Pesa/e-Mola/transferência e envia o comprovativo; o admin marca a factura
como paga no painel. Simples, sem custos, sem depender de mais nenhuma conta.

## O que funciona

- Registo e login de clientes
- Tickets de suporte, com email automático à equipa (EmailJS, corre no navegador)
- Facturas: o cliente vê o que deve, o admin cria e marca como pagas
- Recibo imprimível depois de confirmado o pagamento
- Painel de administrador (tickets, facturas, clientes) por perfil (`role: admin` no Firestore)

## 1. Criar o projecto Firebase

1. https://console.firebase.google.com → criar projecto
2. **Authentication** → activar Email/Palavra-passe
3. **Firestore Database** → criar (modo produção) — fica no plano gratuito, sem Blaze
4. **Definições do projecto → Aplicações Web** → copiar as chaves
5. `cp .env.example .env` e preencher

## 2. Correr localmente

```
npm install
npm run dev
```

## 3. Tornar-se administrador

Registe a sua conta pelo site, depois na consola Firebase → Firestore →
colecção `clients` → o seu documento → mude `role` para `"admin"`.

## 4. Publicar as regras de segurança

```
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

Isto **não** pede Blaze — só o Cloud Functions pedia, e já não existe no projecto.

## 5. EmailJS (email automático ao criar ticket)

Conta gratuita em https://www.emailjs.com, ligue o seu Gmail/Outlook, crie um
template com `client_name`, `client_email`, `subject`, `message`, `priority`,
`to_email`, e copie os 3 códigos para o `.env`.

## 6. Publicar no GitHub Pages

```
npm run build
npm install -D gh-pages
npx gh-pages -d dist
```

Em **Settings → Pages** do repositório, escolha a branch `gh-pages`. O
ficheiro `public/CNAME` já tem `faroltechmz.com` — aponte o domínio para o
GitHub Pages conforme as instruções que aparecem lá.

## Quando quiser automatizar os pagamentos

Isso volta a precisar de Cloud Functions e do plano Blaze — que tem nível
gratuito generoso, só pede cartão associado. Quando fizer sentido, é só
recriar a função de pagamento; o resto do projecto não muda.

## Estrutura

```
src/
  firebase.js                    → configuração (via .env)
  context/AuthContext.jsx        → login, registo, papel (client/admin)
  components/PublicLayout.jsx    → nav pública + rodapé
  pages/public/                  → Home, Sobre, Clientes, Contactos, ServiceDetail
  pages/                         → Login, Signup, Dashboard, Tickets, Invoices, Receipt
  pages/Admin*.jsx               → tickets, facturas e clientes (só admin)
firestore.rules                  → cada cliente só vê os seus dados; admin vê tudo
public/CNAME                     → domínio próprio para o GitHub Pages
```

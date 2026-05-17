# Migracao do login Google no frontend

## Onde estava o fluxo antigo

O fluxo antigo estava centralizado em [React/src/services/login.js](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/services/login.js), na funcao `loginWithGoogle`, que aceitava a credencial retornada pelo Google e enviava `{ idToken }` para `POST /api/v1/auth/google`.

Os pontos de entrada da interface que usavam esse fluxo eram:

- [React/src/components/molecules/Diacono/FormsLogin.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/molecules/Diacono/FormsLogin.jsx)
- [React/src/components/pages/Diacono/Cadastro/Cadastro1.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/pages/Diacono/Cadastro/Cadastro1.jsx)
- [React/src/components/molecules/Diacono/FormsCadastro2.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/molecules/Diacono/FormsCadastro2.jsx)
- [React/src/components/molecules/Diacono/FormsCadastro3.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/molecules/Diacono/FormsCadastro3.jsx)
- [React/src/components/molecules/Diacono/FormsCadastro4.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/molecules/Diacono/FormsCadastro4.jsx)

Antes, todas essas telas usavam `GoogleLogin` de `@react-oauth/google`, liam `credentialResponse.credential` e chamavam `loginWithGoogle(idToken)`.

## O que foi alterado

### Contrato com o backend

`loginWithGoogle` em [React/src/services/login.js](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/services/login.js) deixou de enviar `idToken` e passou a enviar:

```json
{
  "authorizationCode": "code_recebido_do_google",
  "redirectUri": "uri_de_callback_do_frontend",
  "codeVerifier": "opcional_quando_pkce_ativo"
}
```

Tambem foi ajustado o tratamento de erro do frontend para diferenciar melhor os cenarios `401`, `404` e `502` retornados pelo backend.

### Novo fluxo OAuth no frontend

Foi criado [React/src/services/googleAuth.js](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/services/googleAuth.js), que agora:

- inicia o fluxo Google por `authorization code`
- monta a URL de autorizacao do Google
- persiste `state`, `redirectUri`, rota de retorno e `codeVerifier` no `sessionStorage`
- conclui o callback do Google e chama o backend com o novo payload

### Callback dedicado

Foi adicionada a rota `/auth/google/callback` em [React/src/routes/routes.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/routes/routes.jsx), renderizando [React/src/components/pages/Auth/GoogleCallback.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/components/pages/Auth/GoogleCallback.jsx).

Esse callback:

- valida o `state`
- le o `authorization code`
- envia `authorizationCode`, `redirectUri` e `codeVerifier` ao backend
- salva o JWT interno da aplicacao
- redireciona o usuario de volta para a rota que iniciou o login Google

### Atualizacao das telas

As telas que antes usavam `GoogleLogin` agora apenas iniciam o redirecionamento OAuth:

- login redireciona com retorno de sucesso para `/eventos`
- cadastro etapa 1 retorna para `/cadastro/etapa2`
- cadastro etapa 2 retorna para `/cadastro/etapa3`
- cadastro etapa 3 retorna para `/cadastro/etapa4`
- cadastro etapa 4 retorna para `/login`

Tambem foram removidos:

- o `GoogleOAuthProvider` de [React/src/App.jsx](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/src/App.jsx)
- o script `https://accounts.google.com/gsi/client` de [React/index.html](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/index.html)
- o uso de `VITE_GOOGLE_CLIENT_SECRET` no frontend

## Pontos que ainda dependem de configuracao

### Redirect URI

Por padrao, o frontend agora usa:

`{origin}/auth/google/callback`

Exemplo local:

`http://localhost:5173/auth/google/callback`

Se necessario, esse valor pode ser sobrescrito por `VITE_GOOGLE_REDIRECT_URI` em [React/.env](/home/fabiam/Desktop/Faculdade/Projeto/DiaconoFrontEnd/React/.env).

Essa URI precisa existir exatamente igual na configuracao do client OAuth do Google.

### PKCE

PKCE foi habilitado por padrao com:

`VITE_GOOGLE_USE_PKCE=true`

Quando ativo, o frontend:

- gera `codeVerifier`
- envia `code_challenge` para o Google
- envia `codeVerifier` para o backend no callback

Se o ambiente precisar operar sem PKCE, o flag pode ser alterado para `false`.

### Google Console e refresh token

Para o backend continuar tendo chance de receber `refresh_token`, o fluxo do Google depende da configuracao correta do client OAuth e do consentimento correspondente. O frontend agora apenas solicita o `authorization code`; a troca por `id_token`, `access_token` e eventual `refresh_token` fica integralmente no backend.

### Scope para Google Calendar

Como o worker de calendario precisa criar eventos no Google Calendar do usuario autenticado, o frontend deve solicitar tambem o scope:

`https://www.googleapis.com/auth/calendar.events`

Com isso, o escopo efetivo do fluxo passa a incluir:

`openid email profile https://www.googleapis.com/auth/calendar.events`

Observacao importante:
- tokens antigos emitidos sem esse scope continuam insuficientes
- depois da mudanca, o usuario precisa refazer o login Google e conceder novamente o consentimento
- o novo `refresh_token` salvo no backend deve substituir o antigo

## Observacoes

- Nao foram encontrados testes automatizados proprios do frontend para esse fluxo.
- O mapeamento atual das paginas de cadastro ja vinha invertido em parte das rotas (`Cadastro3` renderiza `FormsCadastro4` e `Cadastro4` renderiza `FormsCadastro3`). Esse comportamento foi preservado.

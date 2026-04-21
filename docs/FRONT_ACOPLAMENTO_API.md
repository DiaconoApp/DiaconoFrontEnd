- endpoint: "/api/v1/auth/login"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsLogin.jsx"
  dependencias_diretas:
    - "estrutura_response: response.data.acessToken|response.data.accessToken (token JWT)"
    - "status_http: err.response?.status e err.response?.data?.message"
  transformacao_response:
    - onde: "src/services/login.js:getTokenFromResponse"
      tipo: "fallback de chave acessToken/accessToken"
    - onde: "src/services/login.js:jwtDecode(token)"
      tipo: "parsing JWT para payload.scope/nome/fk_igreja/sub"
  tratamento_erro:
    - onde: "src/services/login.js:catch"
      tipo: "throw new Error com prioridade para err.response.data.message"

- endpoint: "/api/v1/auth/google"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsLogin.jsx"
    - tipo: "component"
      nome: "src/components/pages/Diacono/Cadastro/Cadastro1.jsx"
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsCadastro2.jsx"
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsCadastro3.jsx"
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsCadastro4.jsx"
  dependencias_diretas:
    - "estrutura_response: response.data.acessToken|response.data.accessToken"
    - "status_http: err.response?.status e err.response?.data?.message"
  transformacao_response:
    - onde: "src/services/login.js:loginWithGoogle"
      tipo: "normalização de credential/access_token/code para idToken"
    - onde: "src/services/login.js:jwtDecode(token)"
      tipo: "parsing JWT"
  tratamento_erro:
    - onde: "src/services/login.js:catch"
      tipo: "erro propagado por throw new Error"

- endpoint: "/register"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/Diacono/Cadastro/Cadastro1.jsx"
    - tipo: "component"
      nome: "src/components/molecules/Diacono/FormsCadastro3.jsx"
  dependencias_diretas:
    - "estrutura_response: GET retorna lista de igrejas com idExterno/nome"
    - "status_http: falha tratada apenas por catch genérico"
  transformacao_response:
    - onde: "src/components/pages/Diacono/Cadastro/Cadastro1.jsx"
      tipo: "response.data -> opcoesIgrejas {value:idExterno,label:nome}"
  tratamento_erro:
    - onde: "src/components/pages/Diacono/Cadastro/Cadastro1.jsx"
      tipo: "catch com log sem fallback de contrato"
    - onde: "src/components/molecules/Diacono/FormsCadastro3.jsx"
      tipo: "catch com AlertModal de erro"

- endpoint: "/api/v1/eventos"
  chamado_por:
    - tipo: "component"
      nome: "src/components/templates/ICF/Calendario.jsx"
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
  dependencias_diretas:
    - "estrutura_response: GET depende de res.eventosMes[] com idExterno/nome/dataHoraInicio/dataHoraFim"
    - "status_http: erros de GET não são normalizados em buscarEventos"
  transformacao_response:
    - onde: "src/components/templates/ICF/Calendario.jsx"
      tipo: "res.eventosMes.map -> events do FullCalendar"
    - onde: "src/services/eventos.js:criarEvento"
      tipo: "montagem manual do body com recorrencia/endereco/custo Number(...)"
  tratamento_erro:
    - onde: "src/services/eventos.js:buscarEventos"
      tipo: "catch com console.error sem throw"
    - onde: "src/services/eventos.js:criarEvento"
      tipo: "catch com throw error"

- endpoint: "/api/v1/eventos/{id}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/templates/ICF/Calendario.jsx"
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
  dependencias_diretas:
    - "estrutura_response: nome/descricao/dataHoraInicio/dataHoraFim/enderecoEvento/organizador/publicoAlvo/ministerios"
    - "status_http: erro tratado via throw em buscarEventoPorId"
  transformacao_response:
    - onde: "src/components/templates/ICF/Calendario.jsx:eventClick"
      tipo: "mapping para eventoSelecionado com hora/local/custo"
    - onde: "src/components/pages/ICF/Escalas.jsx:handleVerDetalhes"
      tipo: "mapping para ModalVisualizarEvento"
  tratamento_erro:
    - onde: "src/services/eventos.js:buscarEventoPorId"
      tipo: "catch com throw"
    - onde: "src/components/templates/ICF/Calendario.jsx"
      tipo: "if (!eventoCompleto) abre AlertModal"

- endpoint: "/api/v1/eventos/{id} (PATCH)"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
  dependencias_diretas:
    - "estrutura_response: aceita payload com fkMinisterios/endereco/nome/descricao/publicoAlvo/dataHoraInicio/dataHoraFim/custo"
    - "status_http: erro de PATCH propagado"
  transformacao_response:
    - onde: "src/services/eventos.js:editarEvento"
      tipo: "montagem manual de body e cast Number(form.custo)"
  tratamento_erro:
    - onde: "src/services/eventos.js:editarEvento"
      tipo: "catch com throw"

- endpoint: "/api/v1/eventos/unico/{id}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
  dependencias_diretas:
    - "estrutura_response: retorno ignorado; função retorna true"
    - "status_http: falha gera throw"
  transformacao_response:
    - onde: "src/services/eventos.js:deletarEventoUnico"
      tipo: "descarta response.data e normaliza para true"
  tratamento_erro:
    - onde: "src/services/eventos.js:deletarEventoUnico"
      tipo: "catch com throw"

- endpoint: "/api/v1/eventos/multiplos/{id}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
  dependencias_diretas:
    - "estrutura_response: retorno ignorado; função retorna true"
    - "status_http: falha gera throw"
  transformacao_response:
    - onde: "src/services/eventos.js:deletarEventoMultiplos"
      tipo: "descarta response.data e normaliza para true"
  tratamento_erro:
    - onde: "src/services/eventos.js:deletarEventoMultiplos"
      tipo: "catch com throw"

- endpoint: "/api/v1/escalas-evento/governo?mes={mes}&ano={ano}&status={status}&ministerioId={ministerioId}&nomeEvento={nomeEvento}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
  dependencias_diretas:
    - "estrutura_response: array com idExternoEvento/nomeReuniao/dataHoraInicio/dataHoraFim/ministeriosEscalados/ministeriosEscaladosConfirmados/status"
    - "status_http: falha convertida para []"
  transformacao_response:
    - onde: "src/services/escalas.js:buscarEscalasGoverno"
      tipo: "query manual com filtros condicionais e encodeURIComponent"
    - onde: "src/components/pages/ICF/Escalas.jsx:mapearEscalaGoverno"
      tipo: "mapping para contrato de CardEscala"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarEscalasGoverno"
      tipo: "catch retorna []"

- endpoint: "/api/v1/eventos-ministerios/evento-ministerio/{idMinisterio}?mes={mes}&ano={ano}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
  dependencias_diretas:
    - "estrutura_response: usado por buscarEscalas com expectativa de resposta compatível com lista de escalas"
    - "status_http: falha convertida para {content:[]}"
  transformacao_response:
    - onde: "src/services/escalas.js:buscarEscalas"
      tipo: "switch de URL por presença de idMinisterio"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarEscalas"
      tipo: "catch retorna fallback {content:[]}"

- endpoint: "/api/v1/escalas-ministerio/lider-ministerio?mes={mes}&ano={ano}&status={status}&ministerioId={ministerioId}&nomeEvento={nomeEvento}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
  dependencias_diretas:
    - "estrutura_response: array com idEvento/idExternoEscalaEvento/nomeReuniao/nomeMinisterio/membrosEscalados/membrosEscaladosConfirmados/status"
    - "status_http: falha convertida para []"
  transformacao_response:
    - onde: "src/components/pages/ICF/Escalas.jsx:mapearEscalaLider"
      tipo: "mapping para contrato de CardEscala"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarEscalasLider"
      tipo: "catch retorna []"

- endpoint: "/api/v1/escalas-ministerio/membro?mes={mes}&ano={ano}&status={status}&ministerioId={ministerioId}&nomeEvento={nomeEvento}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
  dependencias_diretas:
    - "estrutura_response: array com status/idEvento|idExternoEvento/idExternoEscalaMinisterio/nomeReuniao/nomeMinisterio"
    - "status_http: falha convertida para []"
  transformacao_response:
    - onde: "src/components/pages/ICF/Escalas.jsx:mapearEscalaMembro"
      tipo: "mapping com conversão de status para confirmado 1/0"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarEscalasMembro"
      tipo: "catch retorna []"

- endpoint: "/api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  dependencias_diretas:
    - "estrutura_response: array com membroMinisterioId/status/isMembroOcupado/nomeMembro"
    - "status_http: validação local de id antes da chamada"
  transformacao_response:
    - onde: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
      tipo: "reduce para pré-seleção de membros CONFIRMADO"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarMembrosEscalaLider"
      tipo: "retorna [] quando erro ou id ausente"

- endpoint: "/api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento} (PATCH)"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  dependencias_diretas:
    - "estrutura_response: backend aceita array [{idExternoMembroMinisterio,status}]"
    - "status_http: falha propagada para toast de erro"
  transformacao_response:
    - onde: "src/services/escalas.js:atualizarEscalaMembroLider"
      tipo: "Object.entries/filter/map para membrosPayload"
  tratamento_erro:
    - onde: "src/services/escalas.js:atualizarEscalaMembroLider"
      tipo: "throw após validação de id"

- endpoint: "/api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}/{tamanhoEquipe}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  dependencias_diretas:
    - "estrutura_response: esperado array; alternativa objeto com status='BAD_REQUEST' e message"
    - "status_http: tratamento baseado em payload de erro, não só código HTTP"
  transformacao_response:
    - onde: "src/services/escalas.js:gerarEscalaAleatoriaLider"
      tipo: "branch por formato da resposta (array vs objeto de erro)"
  tratamento_erro:
    - onde: "src/services/escalas.js:gerarEscalaAleatoriaLider"
      tipo: "throw com apiMessage"

- endpoint: "/api/v1/escalas-ministerio/lider-ministerio/{idExternoEscalaEvento}/revisar-randomizacao/{idExternoMembroMinisterio}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalGerenciarEscala.jsx"
  dependencias_diretas:
    - "estrutura_response: pode retornar array completo ou objeto único de membro"
    - "status_http: erros propagados para toast"
  transformacao_response:
    - onde: "src/components/molecules/ICF/ModalGerenciarEscala.jsx:handleTrocarMembroSorteado"
      tipo: "branch por tipo de resposta e remapeamento de membrosSelecionados"
  tratamento_erro:
    - onde: "src/services/escalas.js:revisarRandomizacaoMembroLider"
      tipo: "throw quando ids obrigatórios ausentes e em falha HTTP"

- endpoint: "/api/v1/escalas-evento/governo/{eventoId}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalEscalarMinisterios.jsx"
  dependencias_diretas:
    - "estrutura_response: GET aceita array direto ou objeto com content"
    - "status_http: erro no PATCH aborta confirmação"
  transformacao_response:
    - onde: "src/services/escalas.js:buscarMinisteriosEvento"
      tipo: "normalização Array.isArray(res.data) ? res.data : res.data?.content || res.data || []"
  tratamento_erro:
    - onde: "src/services/escalas.js:buscarMinisteriosEvento"
      tipo: "catch retorna []"
    - onde: "src/services/escalas.js:atualizarMinisteriosEvento"
      tipo: "catch com throw"

- endpoint: "/api/v1/membros?page={pagina}&size={tamanho}&sort=nome,asc&buscaGeral={busca}&status={status}&fkMinisterio={fkMinisterio}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMembros.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalMembroMinisterio.jsx"
  dependencias_diretas:
    - "estrutura_response: objeto paginado com content[] e totalPages"
    - "status_http: erro convertido para fallback {content:[],totalPages:1}"
  transformacao_response:
    - onde: "src/services/membros.js:buscarMembros"
      tipo: "montagem manual de query com trim/toUpperCase/encodeURIComponent"
  tratamento_erro:
    - onde: "src/services/membros.js:buscarMembros"
      tipo: "catch retorna fallback paginado"

- endpoint: "/api/v1/membros"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: criação depende de contrato com enderecoMembroDTO e idExternoMinisterios[]"
    - "status_http: erro propagado para AlertModal"
  transformacao_response:
    - onde: "src/services/membros.js:cadastrarMembro"
      tipo: "filter/map de ministerios e formatação dataNascimento/email"
  tratamento_erro:
    - onde: "src/services/membros.js:cadastrarMembro"
      tipo: "catch com throw"

- endpoint: "/api/v1/membros/{idExterno}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEditarMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: membro com membroEnderecoDTO e ministerios[]"
    - "status_http: GET/PATCH com throw em erro"
  transformacao_response:
    - onde: "src/components/molecules/ICF/FormEditarMembro.jsx"
      tipo: "mapping de response para dadosMembro e montagem de payload parcial"
  tratamento_erro:
    - onde: "src/services/membros.js:buscarMembroPorId"
      tipo: "catch com throw"
    - onde: "src/services/membros.js:atualizarMembro"
      tipo: "catch com throw"

- endpoint: "/api/v1/ministerios"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEventos.jsx"
    - tipo: "component"
      nome: "src/components/atoms/ICF/GraficoEvolucaoMembrosMinisterios.jsx"
  dependencias_diretas:
    - "estrutura_response: em alguns pontos esperado array; em outros aceito data.content"
    - "status_http: fallback para {content:[],totalPages:1} em buscarTodosMinisterios"
  transformacao_response:
    - onde: "src/components/pages/ICF/Escalas.jsx"
      tipo: "Array.isArray(data) ? data : data?.content || []"
  tratamento_erro:
    - onde: "src/services/ministerios.js:buscarTodosMinisterios"
      tipo: "catch retorna fallback"

- endpoint: "/api/v1/ministerios/governo?page={pagina}&size={tamanho}&buscaGeral={busca}&status={status}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMinisterios.jsx"
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMembros.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalCadastrar2.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormMembro.jsx"
    - tipo: "component"
      nome: "src/components/molecules/ICF/FormEditarMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: objeto paginado com content[]/totalPages"
    - "status_http: fallback para {content:[],totalPages:1}"
  transformacao_response:
    - onde: "src/services/ministerios.js:buscarMinisterios"
      tipo: "query manual com trim/toUpperCase/encodeURIComponent"
  tratamento_erro:
    - onde: "src/services/ministerios.js:buscarMinisterios"
      tipo: "catch retorna fallback"

- endpoint: "/api/v1/ministerios/lider-ministerio"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMinisterioLider.jsx"
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMinisterioMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: array de ministérios do líder"
    - "status_http: erro sem fallback estruturado em buscarMinisteriosQueLidero"
  transformacao_response:
    - onde: "src/components/templates/ICF/ListaMinisterioLider.jsx"
      tipo: "seleção automática do primeiro ministério"
  tratamento_erro:
    - onde: "src/services/ministerios.js:buscarMinisteriosQueLidero"
      tipo: "catch apenas log"

- endpoint: "/api/v1/ministerios/lider-ministerio/{idMinisterio}?page={pagina}&size={tamanho}&buscaGeral={busca}&status={status}&sort={sort}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMinisterioLider.jsx"
    - tipo: "component"
      nome: "src/components/templates/ICF/ListaMinisterioMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: objeto paginado content[]/totalPages"
    - "status_http: erro convertido para fallback paginado"
  transformacao_response:
    - onde: "src/services/ministerios.js:buscarMembrosMinisterios"
      tipo: "query dinâmica com encodeURIComponent e sort serializado"
  tratamento_erro:
    - onde: "src/services/ministerios.js:buscarMembrosMinisterios"
      tipo: "catch retorna fallback"

- endpoint: "/api/v1/ministerios/membro"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Escalas.jsx"
  dependencias_diretas:
    - "estrutura_response: array de ministérios do membro"
    - "status_http: erro convertido para []"
  transformacao_response:
    - onde: "src/components/pages/ICF/Escalas.jsx"
      tipo: "Array.isArray(data) ? data : []"
  tratamento_erro:
    - onde: "src/services/ministerios.js:buscarMinisteriosMembro"
      tipo: "catch retorna []"

- endpoint: "/api/v1/ministerios/lider-ministerio/{idMinisterio}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalMembroMinisterio.jsx"
  dependencias_diretas:
    - "estrutura_response: PATCH usa payload {idExterno}; retorno consumido sem parsing"
    - "status_http: idMinisterio obrigatório validado localmente"
  transformacao_response:
    - onde: "src/services/ministerios.js:adicionarMembroMinisterio"
      tipo: "mapping de dados.idMembro -> payload.idExterno"
  tratamento_erro:
    - onde: "src/services/ministerios.js:adicionarMembroMinisterio"
      tipo: "throw em id ausente e em falha HTTP"

- endpoint: "/api/v1/ministerios/lider-ministerio/{idMinisterio}/{idMembro}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/LinhaMinisterioMembro.jsx"
  dependencias_diretas:
    - "estrutura_response: retorno não utilizado"
    - "status_http: falha exibida em AlertModal"
  transformacao_response:
    - onde: "src/services/ministerios.js:removerMembroMinisterio"
      tipo: "sem transformação de resposta"
  tratamento_erro:
    - onde: "src/services/ministerios.js:removerMembroMinisterio"
      tipo: "catch apenas log (sem throw)"

- endpoint: "/api/v1/ministerios/governo"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalMinisterio.jsx"
  dependencias_diretas:
    - "estrutura_response: POST espera criação com idLider/nome; PATCH espera idMinisterio e status em uppercase"
    - "status_http: erro propagado ao modal"
  transformacao_response:
    - onde: "src/services/ministerios.js:cadastrarMinisterio"
      tipo: "payload manual {idLider,nome}"
    - onde: "src/services/ministerios.js:atualizarMinisterio"
      tipo: "payload manual com status.toUpperCase()"
  tratamento_erro:
    - onde: "src/services/ministerios.js:cadastrarMinisterio"
      tipo: "catch com throw"
    - onde: "src/services/ministerios.js:atualizarMinisterio"
      tipo: "throw em id ausente e em falha HTTP"

- endpoint: "/api/v1/ministerios/governo/{idMinisterio}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalMinisterio.jsx"
  dependencias_diretas:
    - "estrutura_response: PATCH depende de status no payload e idMinisterio válido"
    - "status_http: erro propagado para AlertModal"
  transformacao_response:
    - onde: "src/services/ministerios.js:atualizarMinisterio"
      tipo: "normalização status.toUpperCase() antes do PATCH"
  tratamento_erro:
    - onde: "src/services/ministerios.js:atualizarMinisterio"
      tipo: "throw em id ausente e em falha HTTP"

- endpoint: "/membros?page={page}&size=50&sort=nome"
  chamado_por:
    - tipo: "component"
      nome: "src/components/molecules/ICF/ModalMinisterio.jsx"
  dependencias_diretas:
    - "estrutura_response: res.data.content e res.data.totalPages para paginação incremental"
    - "status_http: erro zera listaMembros"
  transformacao_response:
    - onde: "src/components/molecules/ICF/ModalMinisterio.jsx"
      tipo: "loop while acumulando páginas"
  tratamento_erro:
    - onde: "src/components/molecules/ICF/ModalMinisterio.jsx"
      tipo: "catch com fallback []"

- endpoint: "/api/v1/dashboards/membros/kpis"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Dashboard.jsx"
  dependencias_diretas:
    - "estrutura_response: membrosAtivos/membrosNovos/retencao"
    - "status_http: erro apenas logado"
  transformacao_response:
    - onde: "src/components/pages/ICF/Dashboard.jsx"
      tipo: "mapeamento de campos para estado kpis"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getKpisMembros"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/ministerios/kpis"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Dashboard.jsx"
  dependencias_diretas:
    - "estrutura_response: ministerioKpisResponseDTO ministeriosAtivos/mediaMembrosMinisterio e eventoKpiDTO.nomeMinisterio"
    - "status_http: erro apenas logado"
  transformacao_response:
    - onde: "src/components/pages/ICF/Dashboard.jsx"
      tipo: "safe navigation res?.ministerioKpisResponseDTO / res?.eventoKpiDTO"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getKpisMinisterios"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/membros/evolucao"
  chamado_por:
    - tipo: "component"
      nome: "src/components/atoms/ICF/GraficoEvolucaoMembros.jsx"
  dependencias_diretas:
    - "estrutura_response: array [{data,quantidade}]"
    - "status_http: falha interrompe render de série"
  transformacao_response:
    - onde: "src/components/atoms/ICF/GraficoEvolucaoMembros.jsx:transformarParaMultiLinha"
      tipo: "agregação mensal por ano"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getEvolucaoMembros"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/membros/genero"
  chamado_por: []
  dependencias_diretas:
    - "estrutura_response: função getGeneroMembros depende de contrato de distribuição por gênero"
    - "status_http: erro propagado por throw"
  transformacao_response:
    - onde: "src/services/dashboards.js:getGeneroMembros"
      tipo: "sem parsing/manual mapping"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getGeneroMembros"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/membros/faixa-etaria"
  chamado_por: []
  dependencias_diretas:
    - "estrutura_response: função getFaixaEtariaMembros depende de contrato de distribuição por faixa"
    - "status_http: erro propagado por throw"
  transformacao_response:
    - onde: "src/services/dashboards.js:getFaixaEtariaMembros"
      tipo: "sem parsing/manual mapping"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getFaixaEtariaMembros"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/ministerios/quantidade-membros"
  chamado_por:
    - tipo: "component"
      nome: "src/components/atoms/ICF/GraficoMembrosPorMinisterios.jsx"
  dependencias_diretas:
    - "estrutura_response: array com name/quantidadeMembros"
    - "status_http: falha apenas logada no componente"
  transformacao_response:
    - onde: "src/components/atoms/ICF/GraficoMembrosPorMinisterios.jsx"
      tipo: "res.map -> {nome:item.name,qtd:item.quantidadeMembros}"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getQtdMembrosMinisterios"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/ministerios/quantidade-eventos"
  chamado_por:
    - tipo: "component"
      nome: "src/components/atoms/ICF/GraficoEventosPorMinisterios.jsx"
  dependencias_diretas:
    - "estrutura_response: array com nomeMinisterio/quantidadeEventos"
    - "status_http: falha apenas logada no componente"
  transformacao_response:
    - onde: "src/components/atoms/ICF/GraficoEventosPorMinisterios.jsx"
      tipo: "res.map -> {nome:item.nomeMinisterio,qtd:item.quantidadeEventos}"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getQtdEventosMinisterios"
      tipo: "catch com throw"

- endpoint: "/api/v1/dashboards/ministerios/evolucao/{idMinisterio}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/atoms/ICF/GraficoEvolucaoMembrosMinisterios.jsx"
  dependencias_diretas:
    - "estrutura_response: array com data/quantidadeMembros"
    - "status_http: falha apenas logada no componente"
  transformacao_response:
    - onde: "src/components/atoms/ICF/GraficoEvolucaoMembrosMinisterios.jsx"
      tipo: "normalização por mês e preenchimento de anos faltantes com 0"
  tratamento_erro:
    - onde: "src/services/dashboards.js:getEvolucaoMinisterio"
      tipo: "catch com throw"

- endpoint: "/perfil"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Perfil.jsx"
  dependencias_diretas:
    - "estrutura_response: membro com campos simples e membroEnderecoDTO"
    - "status_http: fallback interno para /perfil/{idUsuario} quando GET /perfil falha"
  transformacao_response:
    - onde: "src/components/pages/ICF/Perfil.jsx:montarPayloadAlterado"
      tipo: "diff entre estado original e edição para PATCH parcial"
  tratamento_erro:
    - onde: "src/services/perfil.js:buscarPerfilLogado"
      tipo: "nested try/catch com fallback de endpoint"

- endpoint: "/perfil/{idUsuario}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Perfil.jsx"
  dependencias_diretas:
    - "estrutura_response: mesmo contrato de /perfil"
    - "status_http: usado como fallback explícito"
  transformacao_response:
    - onde: "src/services/perfil.js:buscarPerfilLogado"
      tipo: "seleção de endpoint por erro no primário"
  tratamento_erro:
    - onde: "src/services/perfil.js:buscarPerfilLogado"
      tipo: "fallbackErr relançado"

- endpoint: "/perfil (PATCH)"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Perfil.jsx"
  dependencias_diretas:
    - "estrutura_response: aceita payload parcial com membroEnderecoDTO opcional"
    - "status_http: falha exibe feedback de erro"
  transformacao_response:
    - onde: "src/components/pages/ICF/Perfil.jsx"
      tipo: "envio apenas de campos alterados"
  tratamento_erro:
    - onde: "src/services/perfil.js:atualizarPerfilLogado"
      tipo: "catch com throw"

- endpoint: "/igrejas/{fkIgreja}"
  chamado_por:
    - tipo: "component"
      nome: "src/components/pages/ICF/Configuracoes.jsx"
  dependencias_diretas:
    - "estrutura_response: GET depende de nome/cnpj/endereco/telefone"
    - "status_http: GET engole erro; PUT apenas loga"
  transformacao_response:
    - onde: "src/components/pages/ICF/Configuracoes.jsx:carregarDadosIgreja"
      tipo: "normalização de campos com fallback para string vazia"
  tratamento_erro:
    - onde: "src/components/pages/ICF/Configuracoes.jsx:carregarDadosIgreja"
      tipo: "catch silencioso"
    - onde: "src/components/pages/ICF/Configuracoes.jsx:handleSalvarIgreja"
      tipo: "catch com console.error"

- endpoint: "https://viacep.com.br/ws/{cep}/json/"
  chamado_por:
    - tipo: "hook"
      nome: "src/hooks/useValidacaoCadastro.js"
    - tipo: "component"
      nome: "src/components/pages/ICF/Perfil.jsx"
  dependencias_diretas:
    - "estrutura_response: logradouro/bairro/localidade/uf e possível data.erro"
    - "status_http: falha retorna null"
  transformacao_response:
    - onde: "src/hooks/useValidacaoCadastro.js:buscarEnderecoPorCep"
      tipo: "mapping para {rua,bairro,cidade,uf}"
    - onde: "src/services/perfil.js:buscarEnderecoPorCep"
      tipo: "sanitização de cep e validação regex antes da chamada"
  tratamento_erro:
    - onde: "src/utils/Utils.js:validationCEP"
      tipo: "catch retorna null"
    - onde: "src/services/perfil.js:buscarEnderecoPorCep"
      tipo: "catch retorna null"

- endpoint: "https://www.receitaws.com.br/v1/cnpj/{cnpj}"
  chamado_por:
    - tipo: "util"
      nome: "src/utils/Utils.js:validationCNPJ"
  dependencias_diretas:
    - "estrutura_response: payload JSON retornado pela ReceitAWS (consumido sem mapeamento de campos)"
    - "status_http: validação explícita de resp.ok antes do parse"
  transformacao_response:
    - onde: "src/utils/Utils.js:validationCNPJ"
      tipo: "sem parsing de contrato; retorna json bruto"
  tratamento_erro:
    - onde: "src/utils/Utils.js:validationCNPJ"
      tipo: "catch retorna null"
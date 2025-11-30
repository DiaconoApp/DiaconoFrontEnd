import api from "../provider/api";

export async function buscarEventos(mes, ano) {
  try {
    const res = await api.get('api/v1/eventos', {
      params: { mes, ano }
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error('Erro ao buscar eventos AQUI:', error);
  }
}

export async function buscarEventoPorId(id) {
  try {
    const res = await api.get(`/api/v1/eventos/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar evento por ID:", error);
    throw error;
  }
}


export async function criarEvento(form) {
  try {
    const body = {
      fkIgreja: "550e8400-e29b-41d4-a716-446655440000", // PEGAR DO CONTEXTO DEPOIS
      fkOrganizador: localStorage.getItem("idUsuario"),
      fkMinisterios: form.fkMinisterios,

      nome: form.nome,
      descricao: form.descricao,
      publicoAlvo: form.publicoAlvo,

      dataHoraInicio: form.dataHoraInicio,
      dataHoraFim: form.dataHoraFim,

      custo: Number(form.custo) || 0,

      recorrencia: {
        tipoRecorrencia: form.recorrencia.tipoRecorrencia,
        dataInicioRecorrencia: form.recorrencia.dataInicioRecorrencia,
        dataTerminoRecorrencia: form.recorrencia.dataTerminoRecorrencia
      },

      // diasSemana: null,
      // horarioRecorrencia: null,
      // intervaloRecorrencia: 0,

      endereco: {
        idExterno: null,
        apelido: form.endereco?.apelido,
        cep: form.endereco?.cep,
        rua: form.endereco?.rua,
        numero: form.endereco?.numero,
        cidade: form.endereco?.cidade,
        estado: form.endereco?.estado || "São Paulo",
        bairro: form.endereco?.bairro,
        complemento: form.endereco?.complemento
      }
    };

    const res = await api.post("/api/v1/eventos", body);
    return res.data;

  } catch (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }
}

export async function editarEvento(id, form) {
  try {
    const body = {
      // recorrencia: {
      //   tipoRecorrencia: form.recorrencia.tipoRecorrencia,
      //   dataInicioRecorrencia: form.recorrencia.dataInicioRecorrencia,
      //   dataTerminoRecorrencia: form.recorrencia.dataTerminoRecorrencia
      // },

      fkMinisterios: form.fkMinisterios,
      endereco: {
        idExterno:  null,
        cep: form.endereco?.cep,
        estado: form.endereco?.estado || "São Paulo",
        cidade: form.endereco?.cidade,
        bairro: form.endereco?.bairro,
        rua: form.endereco?.rua,
        complemento: form.endereco?.complemento,
        numero: form.endereco?.numero,
        apelido: form.endereco?.apelido
      },
      nome: form.nome,
      descricao: form.descricao,
      publicoAlvo: form.publicoAlvo,
      dataHoraInicio: form.dataHoraInicio,
      dataHoraFim: form.dataHoraFim,
      custo: Number(form.custo)

    };

    const res = await api.patch(`/api/v1/eventos/${id}`, body);
    return res.data;

  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }
}

export async function deletarEventoUnico(id) {
  try {
    const response = await api.delete(`/api/v1/eventos/unico/${id}`);
    // return response.data;
    return true
  } catch (error) {
    console.error("Erro ao deletar evento único:", error);
    throw error;
  }
}

export async function deletarEventoMultiplos(id) {
  try {
    const response = await api.delete(`/api/v1/eventos/multiplos/${id}`);
    // return response.data;
    return true
  } catch (error) {
    console.error("Erro ao deletar eventos múltiplos:", error);
    throw error;
  }
}





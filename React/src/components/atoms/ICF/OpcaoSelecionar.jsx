import React from 'react';

export function OpcaoSelecionar({ id, nome, tituloBotao, onClick, jaNoMinisterio  }) {
  return (
    <div className='border border-icf-primary-200 rounded flex justify-between p-2'>
      <div className='flex items-center gap-2'>
        <img src="logoICF.png" alt="foto do membro" className='w-10 h-10 rounded-full' />
        <span className='text-icf-primary-400'>{nome}</span>
      </div>
      <button
        onClick={() => onClick(id)}
        className={`border rounded-lg p-2 ${
          jaNoMinisterio
            ? "border-icf-primary-200 bg-icf-primary-400 text-icf-primary-50 cursor-not-allowed"
            : "border-icf-primary-200 border rounded-lg bg-icf-primary-50 text-icf-primary-200 p-2"
        }`}
        disabled={jaNoMinisterio} // desabilita se já estiver adicionado
      >

        {tituloBotao}
      </button>
    </div>
  );
}
import React from 'react'

export function OpcaoSelecionar({nome, tituloBotao}) {
    return (
        <div className='border border-icf-primary-200 rounded flex justify-between p-2'>
            <div className='flex items-center gap-2'>
                <img src="logoICF.png" alt="foto do membro" className='w-10 h-10 rounded-full' />
                <span className='text-icf-primary-400'>{nome}</span>
            </div>
            <button className='border-icf-primary-200 border rounded-lg bg-icf-primary-50 text-icf-primary-200 p-2'>{tituloBotao}</button>
        </div>
    )
}

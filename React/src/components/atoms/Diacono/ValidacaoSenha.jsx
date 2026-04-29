import { Check, X } from "lucide-react";

export function ValidacaoSenha({ senha = "" }) {
  const validacoes = [
    { label: "Pelo menos 8 caracteres", valido: senha.length >= 8 },
    { label: "Pelo menos 1 número", valido: /\d/.test(senha) },
    { label: "Pelo menos 1 letra minúscula", valido: /[a-z]/.test(senha) },
    { label: "Pelo menos 1 letra maiúscula", valido: /[A-Z]/.test(senha) },
    { label: "Pelo menos 1 caractere especial", valido: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(senha) },
  ];

  const validosCount = validacoes.filter((v) => v.valido).length;
  const porcentagem = (validosCount / validacoes.length) * 100;

  const getForca = () => {
    if (validosCount <= 1) return { texto: "Senha fraca", cor: "bg-red-500" };
    if (validosCount <= 3) return { texto: "Senha média", cor: "bg-amber-500" };
    if (validosCount === 4) return { texto: "Senha boa", cor: "bg-lime-500" };
    return { texto: "Senha forte", cor: "bg-green-500" };
  };

  const forca = getForca();

  if (!senha) {
    return (
      <div className="flex flex-col gap-3 mt-4 opacity-0 pointer-events-none">
        {/* Barra de progresso placeholder */}
        <div className="w-full h-1.5 bg-diacono-blue-50 rounded-full overflow-hidden">
          <div className="h-full bg-gray-300" style={{ width: '0%' }} />
        </div>
        {/* Força da senha placeholder */}
        <p className="text-diacono-blue-400 font-semibold">
          Senha fraca. <span className="font-normal text-diacono-blue-300">Deve conter:</span>
        </p>
        {/* Lista de validações placeholder */}
        <ul className="flex flex-col gap-1.5">
          {validacoes.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <X className="w-4 h-4 text-diacono-blue-200" />
              <span className="text-sm text-diacono-blue-200">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Barra de progresso */}
      <div className="w-full h-1.5 bg-diacono-blue-50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${forca.cor}`}
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      {/* Força da senha */}
      <p className="text-diacono-blue-400 font-semibold">
        {forca.texto}. <span className="font-normal text-diacono-blue-300">Deve conter:</span>
      </p>

      {/* Lista de validações */}
      <ul className="flex flex-col gap-1.5">
        {validacoes.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.valido ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-diacono-blue-200" />
            )}
            <span
              className={`text-sm ${
                item.valido ? "text-green-600" : "text-diacono-blue-200"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

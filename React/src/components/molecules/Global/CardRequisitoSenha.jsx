import { getRequisitoSenha } from "../../../utils/Utils";

export function CardRequisitoSenha({ senha }) {
  const requisitos = getRequisitoSenha(senha);

  const renderItem = (label, valido) => (
    <li className={`text-sm ${valido ? "text-green-600" : "text-red-500"}`}>
      {valido ? "✔️" : "❌"} {label}
    </li>
  );

  return (
    <div className="p-1 rounded">
      <ul className="space-y-1">
        {renderItem("Mínimo de 8 caracteres", requisitos.tamanhoMinimo)}
        {renderItem("Letra maiúscula", requisitos.letraMaiuscula)}
        {renderItem("Letra minúscula", requisitos.letraMinuscula)}
        {renderItem("Número", requisitos.numero)}
        {renderItem("Caractere especial", requisitos.caractereEspecial)}
      </ul>
    </div>
  );
}
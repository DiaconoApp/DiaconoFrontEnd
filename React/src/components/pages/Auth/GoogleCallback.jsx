import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { BotaoDiacono } from "../../atoms/Diacono/BotaoDiacono";
import { completeGoogleAuthorization } from "../../../services/googleAuth";
import { useAuth } from "../../../routes/AuthContext";

export function GoogleCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [returnPath, setReturnPath] = useState("/login");

  useEffect(() => {
    let active = true;

    const finishGoogleLogin = async () => {
      try {
        const { user, successPath } = await completeGoogleAuthorization();

        if (!active) {
          return;
        }

        setUser(user);
        navigate(successPath, { replace: true });
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(error.message || "Erro ao concluir login com Google.");
        setReturnPath(error.fallbackPath || "/login");
      }
    };

    finishGoogleLogin();

    return () => {
      active = false;
    };
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        {errorMessage ? (
          <>
            <h1 className="text-2xl font-bold text-diacono-blue-400">Falha no login Google</h1>
            <p className="mt-4 text-sm text-icf-primary-300">{errorMessage}</p>
            <div className="mt-6">
              <BotaoDiacono onClick={() => navigate(returnPath, { replace: true })}>
                Voltar
              </BotaoDiacono>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <FaSpinner className="h-8 w-8 animate-spin text-diacono-blue-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-diacono-blue-400">
              Concluindo autenticação
            </h1>
            <p className="mt-4 text-sm text-icf-primary-300">
              Aguarde enquanto validamos seu login com o Google.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

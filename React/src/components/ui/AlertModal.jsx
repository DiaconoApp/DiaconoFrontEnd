import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

/**
 * Modal genérico e reutilizável para alertas
 * 
 * Tipos suportados: 'success', 'error', 'warning', 'info'
 * 
 * @example
 * const [modal, setModal] = useState(null);
 * 
 * setModal({
 *   type: 'error',
 *   title: 'Erro!',
 *   message: 'Algo deu errado.',
 *   buttons: [
 *     { label: 'OK', onClick: () => setModal(null), variant: 'primary' }
 *   ]
 * });
 * 
 * return (
 *   <>
 *     {modal && <AlertModal {...modal} onClose={() => setModal(null)} />}
 *   </>
 * );
 */
export function AlertModal({
  type = 'info',
  title,
  message,
  buttons,
  onClose,
  autoClose = 0, // 0 = não fecha automaticamente, > 0 = milissegundos
}) {
  // Fechar automaticamente se autoClose > 0
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  // Configuração visual por tipo
  const config = {
    success: {
      icon: CheckCircle,
    },
    error: {
      icon: XCircle,
    },
    warning: {
      icon: AlertCircle,
    },
    info: {
      icon: Info,
    },
  };

  const currentConfig = config[type] || config.info;
  const IconComponent = currentConfig.icon;

  // Botões padrão se não fornecidos
  const defaultButtons = [
    {
      label: "OK",
      onClick: onClose,
      variant: "primary",
    },
  ];

  const finalButtons = buttons || defaultButtons;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`bg-white shadow-menu-shadow rounded-lg max-w-sm w-full mx-4 overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`flex-shrink-0 mt-0.5`}>
              <IconComponent className={`w-6 h-6 text-icf-primary-300`} />
            </div>
            <div className="flex-1">
              {title && (
                <h3 className={`text-icf-primary-300 font-semibold text-lg`}>
                  {title}
                </h3>
              )}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`text-icf-primary-300 hover:opacity-70 transition-opacity flex-shrink-0 ml-2`}
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        {message && (
          <div className="px-6 py-3">
            <p className={`text-icf-primary-300 text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
        )}

        {/* Footer - Botões */}
        {finalButtons.length > 0 && (
          <div className="flex gap-3 p-6 pt-4 justify-end">
            {finalButtons.map((button, idx) => (
              <button
                key={idx}
                onClick={() => {
                  button.onClick?.();
                }}
                className={`
                  px-4 py-2 rounded font-medium text-sm transition-colors
                  ${
                    button.variant === "primary"
                      ? `bg-icf-primary-400 text-white`
                      : `bg-gray-200 hover:bg-gray-300 text-gray-900`
                  }
                `}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

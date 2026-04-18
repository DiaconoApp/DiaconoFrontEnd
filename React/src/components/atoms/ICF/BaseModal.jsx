import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * BaseModal - Componente de modal padronizado
 * 
 * @param {string} title - Título do modal
 * @param {function} onClose - Função para fechar o modal
 * @param {ReactNode} children - Conteúdo do modal
 * @param {ReactNode} footer - Footer customizado (botões)
 * @param {string} size - Tamanho: 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} allowOverflow - Permitir overflow visível (para dropdowns)
 * @param {boolean} showDivider - Mostrar divisor abaixo do título
 */
export function BaseModal({ 
    title, 
    onClose, 
    children, 
    footer,
    size = 'md',
    showDivider = true,
    allowOverflow = false,
    className
}) {
    const sizeClasses = {
        sm: 'w-[360px]',
        md: 'w-[480px]',
        lg: 'w-[600px]',
        xl: 'w-[720px]',
    };

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-xl max-w-[95vw] flex flex-col",
            allowOverflow ? "overflow-visible" : "max-h-[90vh] overflow-hidden",
            sizeClasses[size],
            className
        )}>
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between p-6",
                showDivider && "border-b border-icf-primary-50"
            )}>
                <h2 className="font-bold text-xl text-icf-primary-400">{title}</h2>
                <button 
                    onClick={onClose} 
                    className="p-1.5 hover:bg-icf-primary-50 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-icf-primary-300" />
                </button>
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 p-6 pt-4",
                allowOverflow ? "overflow-visible" : "overflow-y-auto"
            )}>
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="p-6 pt-0 flex justify-end gap-3">
                    {footer}
                </div>
            )}
        </div>
    );
}

/**
 * ModalOverlay - Wrapper para exibir modal com fundo escuro
 */
export function ModalOverlay({ children, onClose }) {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            {children}
        </div>
    );
}

/**
 * ConfirmModal - Modal de confirmação padronizado
 */
export function ConfirmModal({ 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger", // danger | warning | info
    confirmIcon = null // Icone opcional para o botao de confirmacao
}) {
    const variantClasses = {
        danger: "bg-red-500 hover:bg-red-600 text-white",
        warning: "bg-warning-500 hover:bg-warning-600 text-white",
        info: "bg-icf-primary-400 hover:bg-icf-primary-500 text-white",
    };

    return (
        <BaseModal
            title={title}
            onClose={onCancel}
            size="sm"
            footer={
                <div className="flex gap-3 w-full">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 border-icf-primary-200 text-icf-primary-400 hover:bg-icf-primary-50"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={cn("flex-1 gap-2", variantClasses[variant])}
                    >
                        {confirmIcon && confirmIcon}
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <p className="text-icf-primary-300 text-center">{message}</p>
        </BaseModal>
    );
}

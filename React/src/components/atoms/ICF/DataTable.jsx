import { cn } from "@/lib/utils";
import { ExternalLink, Users } from "lucide-react";

export function DataTable({ columns, data, onRowClick, emptyMessage = "Nenhum registro encontrado" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center text-icf-primary-200">
        <Users className="w-12 h-12 mb-4" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-icf-primary-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-6 py-4 text-left text-xs font-semibold text-icf-primary-300 uppercase tracking-wider",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
            {onRowClick && <th className="px-6 py-4 w-12"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-icf-primary-50">
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || row.idExterno || rowIndex}
              className="hover:bg-icf-primary-50/50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-6 py-4 text-sm",
                    col.cellClassName
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {onRowClick && (
                <td className="px-6 py-4">
                  <button
                    onClick={() => onRowClick(row)}
                    className="text-icf-primary-200 hover:text-icf-primary-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper para renderizar status badge
export function StatusBadge({ status }) {
  const isActive = status?.toLowerCase() === "ativo";
  
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 text-xs font-medium rounded-full",
        isActive
          ? "bg-success-100 text-success-600"
          : "bg-icf-primary-100 text-icf-primary-300"
      )}
    >
      {isActive ? "Ativo" : "Inativo"}
    </span>
  );
}

// Helper para renderizar ministério badge
export function MinisterioBadge({ nome, count }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-icf-primary-100 text-icf-primary-400">
        {nome}
      </span>
      {count > 0 && (
        <span className="text-xs text-icf-primary-200">+{count}</span>
      )}
    </div>
  );
}

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusToggle } from "./StatusToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterBar({ 
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  showStatus = true,
  statusOptions,
  children,
  selectOptions = [],
  selectValue,
  onSelectChange,
  selectPlaceholder = "Todos..."
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[250px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-icf-primary-200" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-icf-primary-100 focus:border-icf-primary-300 h-10"
        />
      </div>

      {/* Status Toggle */}
      {showStatus && (
        <StatusToggle 
          value={statusValue} 
          onChange={onStatusChange}
          options={statusOptions}
        />
      )}

      {/* Optional Select */}
      {selectOptions.length > 0 && (
        <Select value={selectValue || "__all__"} onValueChange={(val) => onSelectChange(val === "__all__" ? "" : val)}>
          <SelectTrigger className="w-[180px] bg-white border-icf-primary-100 h-10">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{selectPlaceholder}</SelectItem>
            {selectOptions.map((opt) => (
              <SelectItem key={opt.value || opt.idExterno} value={opt.value || opt.idExterno}>
                {opt.label || opt.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Additional custom filters */}
      {children}
    </div>
  );
}

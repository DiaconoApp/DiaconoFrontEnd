import { FiDollarSign, FiUsers, FiGlobe, FiTrendingUp } from "react-icons/fi";

export function MenuHeaderDashboards({ activeTab, onChangeTab }) {
    const tabs = [
    // { id: "financeiro", label: "Financeiro", icon: <FiDollarSign /> },
    { id: "membros", label: "Membros", icon: <FiUsers /> },
    { id: "ministerios", label: "Ministérios", icon: <FiGlobe /> },
    // { id: "engajamento", label: "Engajamento", icon: <FiTrendingUp /> },
  ];

  return (
    <div className="flex gap-4 mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
          className={`
            flex items-center gap-2 border-b-2 pb-1 transition-colors
            ${activeTab === tab.id 
              ? "border-white text-white" 
              : "border-transparent text-slate-400 hover:text-white"}
          `}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
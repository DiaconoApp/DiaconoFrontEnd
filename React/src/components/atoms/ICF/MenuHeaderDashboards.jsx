import { FiDollarSign, FiUsers, FiGlobe, FiTrendingUp } from "react-icons/fi";

export function MenuHeaderDashboards({ activeTab, onChangeTab }) {
    const tabs = [
    // { id: "financeiro", label: "Financeiro", icon: <FiDollarSign /> },
    { id: "membros", label: "Membros", icon: <FiUsers /> },
    { id: "ministerios", label: "Ministérios", icon: <FiGlobe /> },
    // { id: "engajamento", label: "Engajamento", icon: <FiTrendingUp /> },
  ];

  return (
    <div className="flex gap-4 mt-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
          className={`
            flex items-center gap-2 
            // transition-all duration-50
            ${activeTab === tab.id 
              ? "text-icf-primary-300 border-b-2 border-b-icf-primary-300" 
              : "text-icf-primary-200 hover:text-icf-primary-200"}
          `}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-base">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
import { DollarSign, TrendingDown, Wallet, Users, Church, BarChart3, UserPlus, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
    dollar: DollarSign,
    expense: TrendingDown,
    wallet: Wallet,
    users: Users,
    church: Church,
    chart: BarChart3,
    userPlus: UserPlus,
    trending: TrendingUp,
    award: Award,
};

const colorVariants = {
    green: {
        icon: 'text-emerald-600 bg-emerald-50',
        value: 'text-icf-primary-400',
    },
    red: {
        icon: 'text-red-500 bg-red-50',
        value: 'text-icf-primary-400',
    },
    yellow: {
        icon: 'text-amber-600 bg-amber-50',
        value: 'text-icf-primary-400',
    },
    cyan: {
        icon: 'text-cyan-600 bg-cyan-50',
        value: 'text-icf-primary-400',
    },
    pink: {
        icon: 'text-pink-600 bg-pink-50',
        value: 'text-icf-primary-400',
    },
    default: {
        icon: 'text-icf-primary-400 bg-icf-primary-50',
        value: 'text-icf-primary-400',
    },
};

export function Kpi({ icone, titulo, valor, variant = 'default', icon }) {
    const IconComponent = icon ? iconMap[icon] : null;
    const colors = colorVariants[variant] || colorVariants.default;

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm flex gap-4 items-start">
            {IconComponent ? (
                <div className={cn('p-2.5 rounded-lg', colors.icon)}>
                    <IconComponent className="h-5 w-5" />
                </div>
            ) : (
                <div className="p-3 bg-icf-primary-50 rounded-lg">
                    <img src={`./${icone}.svg`} alt="" className="h-5 w-5" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm text-icf-primary-200 font-medium">{titulo}</span>
                <span className={cn('font-bold text-xl', colors.value)}>{valor}</span>
            </div>
        </div>
    );
}
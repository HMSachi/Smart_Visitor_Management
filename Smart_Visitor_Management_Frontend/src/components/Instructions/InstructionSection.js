import React from 'react';

const InstructionSection = ({ title, items, type = 'info' }) => {
    const icons = {
        rules: "⚖️",
        safety: "🦺",
        allowed: "✅",
        warning: "⚠️"
    };

    return (
        <div className={`p-10 border transition-all duration-500 ${
            type === 'warning' ? 'bg-mas-red/5 border-mas-red/20' : 'bg-white/[0.02] border-white/5'
        }`}>
            <div className="flex items-center space-x-6 mb-10">
                <span className="text-2xl opacity-80">{icons[title.toLowerCase()] || "🔹"}</span>
                <h3 className={`text-sm font-black uppercase tracking-[0.4em] ${
                    type === 'warning' ? 'text-mas-red' : 'text-white'
                }`}>{title}</h3>
            </div>
            <ul className="space-y-6">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs font-light text-gray-300 leading-relaxed group">
                        <div className={`w-1 h-1 rounded-full mt-2 mr-6 transition-all group-hover:scale-150 ${
                            type === 'warning' ? 'bg-mas-red' : 'bg-white/40'
                        }`}></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InstructionSection;

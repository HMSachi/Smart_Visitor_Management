import React from 'react';
import { Filter, ChevronDown, Search, UserPlus } from 'lucide-react';

const InboxFilters = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-mas-border">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
                <div className="px-5 py-3 mas-glass border-mas-border flex flex-col md:flex-row items-center gap-4 md:gap-3 cursor-pointer hover:border-primary/40 transition-all group">
                    <Filter size={16} className="text-gray-300 group-hover:text-primary" />
                    <span className="uppercase">Advanced Filter</span>
                    <ChevronDown size={14} className="text-gray-300" />
                </div>
                <div className="h-8 w-px bg-mas-border hidden lg:block"></div>
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
                    <span className="text-gray-300 uppercase">Total Logged:</span>
                    <span className="text-primary">142</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH BY VISITOR OR ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mas-input w-full pl-12 pr-4 bg-white/[0.02] border-white/5 placeholder:"
                    />
                </div>
                <button className="px-6 py-4 bg-primary text-white uppercase flex flex-col md:flex-row items-center gap-4 md:gap-3 shadow-[0_0_20px_rgba(200,16,46,0.2)] hover:shadow-[0_0_30px_rgba(200,16,46,0.4)] transition-all transform active:scale-95 whitespace-nowrap">
                    <UserPlus size={16} />
                    Add Entry
                </button>
            </div>
        </div>
    );
};

export default InboxFilters;

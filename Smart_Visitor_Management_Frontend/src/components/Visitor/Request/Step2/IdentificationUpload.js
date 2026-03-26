import React from 'react';

const IdentificationUpload = ({ uploadedFile, progress, onUpload, onRemove }) => {
    return (
        <section className="bg-white/[0.02] border border-white/5 p-12">
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-8 h-[1px] bg-mas-red"></div>
                <h2 className="text-white uppercase">Identification</h2>
            </div>
            <div className="relative group/upload border-2 border-dashed border-white/10 p-12 text-center hover:border-mas-red/40 transition-all cursor-pointer">
                <input type="file" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-12 h-12 bg-white/10 mx-auto mb-6 flex items-center justify-center transition-transform group-hover/upload:scale-110">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="text-white uppercase">Drag & Drop ID Documents</p>
                <p className="text-gray-400 uppercase mt-2">PDF, JPG (MAX 5MB)</p>
                {uploadedFile && (
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between text-left">
                        <div className="flex-1 mr-4">
                            <p className="text-white uppercase truncate">{uploadedFile}</p>
                            <div className="w-full bg-white/10 h-[1px] mt-2">
                                <div className="bg-mas-red h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <span onClick={onRemove} className="text-mas-red uppercase cursor-pointer hover:underline">REMOVE</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default IdentificationUpload;

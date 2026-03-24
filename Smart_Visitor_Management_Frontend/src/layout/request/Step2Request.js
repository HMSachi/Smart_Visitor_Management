import React, { useState } from 'react';
import VisitorGroup from '../../components/Request/Step2/VisitorGroup';
import EquipmentDeclaration from '../../components/Request/Step2/EquipmentDeclaration';
import IdentificationUpload from '../../components/Request/Step2/IdentificationUpload';
import Phase1Summary from '../../components/Request/Step2/Phase1Summary';

const Step2Request = () => {
    const [visitors, setVisitors] = useState([{ id: Date.now(), fullName: '', nic: '', contact: '' }]);
    const [equipment, setEquipment] = useState([{ id: Date.now(), itemName: '', quantity: '', description: '' }]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [status, setStatus] = useState(null); // 'submitting', 'review', 'rejected', 'approved'
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);

    // Step 1 Summary Mock
    const step1Summary = {
        date: '2026-03-25',
        purpose: 'BUSINESS MEETING',
        visitors: 1,
        areas: ['MAIN RECEPTION', 'CORPORATE OFFICE']
    };

    const addVisitor = () => {
        setVisitors([...visitors, { id: Date.now(), fullName: '', nic: '', contact: '' }]);
    };

    const removeVisitor = (id) => {
        if (visitors.length > 1) {
            setVisitors(visitors.filter(v => v.id !== id));
        }
    };

    const addEquipment = () => {
        setEquipment([...equipment, { id: Date.now(), itemName: '', quantity: '', description: '' }]);
    };

    const removeEquipment = (id) => {
        setEquipment(equipment.filter(e => e.id !== id));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file.name);
            setUploadProgress(0);
            let p = 0;
            const interval = setInterval(() => {
                p += 10;
                setUploadProgress(p);
                if (p >= 100) clearInterval(interval);
            }, 100);
        }
    };

    const removeUploadedFile = () => {
        setUploadedFile(null);
        setUploadProgress(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => setStatus('review'), 2000);
    };

    if (status === 'review') {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6">
                <div className="max-w-xl w-full glass-panel p-16 text-center border-mas-red/20 shadow-[0_0_50px_rgba(200,16,46,0.1)] transition-all transform scale-100 opacity-100">
                    <div className="w-20 h-20 bg-mas-red/10 border border-mas-red/40 mx-auto mb-10 flex items-center justify-center animate-pulse">
                        <svg className="w-10 h-10 text-mas-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-display font-black uppercase tracking-tight text-white mb-6 underline-offset-8 decoration-mas-red">Under Final Review</h2>
                    <p className="text-gray-300 font-light text-sm uppercase tracking-[0.2em] leading-loose mb-12">
                        Your detailed documentation has been received. <br />
                        Clearance protocol is currently active. You will be notified via <span className="text-white font-bold">Encrypted Email</span> upon final authorization.
                    </p>
                    <div className="bg-white/5 border border-white/5 p-6 mb-12 text-left">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Node Priority</span>
                            <span className="text-[10px] text-mas-red font-black uppercase tracking-widest">High Clearance</span>
                        </div>
                        <div className="w-full bg-white/10 h-1">
                            <div className="bg-mas-red h-full w-2/3 animate-ping shadow-[0_0_10px_#C8102E]"></div>
                        </div>
                    </div>
                    <button onClick={() => window.location.href = '/qr'} className="w-full py-5 bg-mas-red text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#A60D26] shadow-[0_0_30px_rgba(200,16,46,0.2)] transition-all">Generate Digital Pass</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal-900 pt-32 pb-24 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-20">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-mas-red block mb-2">Detailed Clearance</span>
                            <h1 className="text-white font-display font-black text-3xl uppercase tracking-tighter">Verification Phase</h1>
                        </div>
                        <span className="text-[12px] uppercase tracking-[0.4em] font-black text-white/40">02 / 02</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/10 relative">
                        <div className="absolute top-0 left-0 h-full bg-mas-red w-full shadow-[0_0_15px_#C8102E]"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-24">
                    <VisitorGroup visitors={visitors} onAdd={addVisitor} onRemove={removeVisitor} />
                    <EquipmentDeclaration items={equipment} onAdd={addEquipment} onRemove={removeEquipment} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <IdentificationUpload 
                            uploadedFile={uploadedFile} 
                            progress={uploadProgress} 
                            onUpload={handleFileUpload}
                            onRemove={removeUploadedFile}
                        />
                        <Phase1Summary summary={step1Summary} />
                    </div>

                    {/* Confirmation */}
                    <div className="flex items-start space-x-6 p-8 bg-mas-red/5 border border-mas-red/10 animate-fade-in group">
                        <input 
                            type="checkbox" 
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-mas-red cursor-pointer" 
                        />
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-loose group-hover:text-gray-300 transition-colors">
                            I verify that all group details and declarations provided above are accurate as per the MAS Security Protocol. 
                            Unauthorized equipment or undisclosed personnel may result in immediate clearance revocation.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-12 text-center">
                        <button 
                            type="submit"
                            disabled={!isConfirmed || status === 'submitting'}
                            className="bg-mas-red text-white w-full py-8 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-[#A60D26] shadow-[0_0_50px_rgba(200,16,46,0.3)] disabled:opacity-20 transition-all transform hover:scale-[1.01] active:scale-100"
                        >
                            {status === 'submitting' ? 'SYNCHRONIZING SECURE DATA...' : 'Submit Detailed Information'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Step2Request;

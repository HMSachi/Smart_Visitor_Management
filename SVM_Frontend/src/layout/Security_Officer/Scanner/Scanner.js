import React from 'react';
import Sidebar from '../../../components/Security_Officer/Layout/Sidebar';
import Header from '../../../components/Security_Officer/Layout/Header';
import ScannerComponent from '../../../components/Security_Officer/Scanner/Scanner';

const Scanner = () => {
    return (
        <div className="flex bg-secondary overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] overflow-hidden">
                <Header title="Tactical QR Scanner" />
                <div className="flex-1 overflow-y-auto">
                    <ScannerComponent />
                </div>
            </div>
        </div>
    );
};

export default Scanner;

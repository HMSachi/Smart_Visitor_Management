import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { QrCode, Zap, RefreshCw } from 'lucide-react';

const LiveFeed = () => {
    const videoRef = useRef(null);
    const controlsRef = useRef(null);
    const scannerRef = useRef(null);
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success, error
    const [scanMessage, setScanMessage] = useState('Point the camera at a QR code to begin verification.');
    const [scanResult, setScanResult] = useState('');

    const stopScanner = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
            controlsRef.current = null;
        }
    };

    const startScanner = async () => {
        if (!videoRef.current) {
            return;
        }

        stopScanner();
        setScanResult('');
        setScanStatus('scanning');
        setScanMessage('Opening camera feed...');

        try {
            if (!scannerRef.current) {
                scannerRef.current = new BrowserMultiFormatReader();
            }

            controlsRef.current = await scannerRef.current.decodeFromVideoDevice(
                undefined,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        setScanResult(result.getText());
                        setScanStatus('success');
                        setScanMessage('Credential verified from live QR scan.');
                        stopScanner();
                        return;
                    }

                    // Many frames will produce NotFound-like errors while scanning — ignore those.
                    // Only surface unexpected errors (permissions, device lost, etc.).
                    if (error) {
                        const name = error.name || error.constructor?.name || '';
                        if (name === 'NotFoundException' || name === 'ChecksumException' || name === 'FormatException') {
                            // expected while no QR is present — ignore
                            return;
                        }

                        setScanStatus('error');
                        setScanMessage('Scan failed. Check camera permission and try again.');
                    }
                }
            );

            setScanMessage('Camera active. Hold QR code steady inside the frame.');
        } catch (error) {
            setScanStatus('error');
            setScanMessage('Unable to access camera. Allow camera permission and retry.');
        }
    };

    useEffect(() => {
        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="max-w-2xl w-full space-y-6 md:space-y-12 relative z-10 mx-auto">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <Zap size={14} className="text-primary animate-pulse" />
                    <span className="text-primary uppercase">Active Node 04</span>
                </div>
                <h1 className="uppercase">Scanning Protocol</h1>
            </div>

            {/* Scanner Frame */}
            <div className="relative aspect-square max-w-md mx-auto mas-glass border-primary/30 p-2 group">
                {/* Animated Corners */}
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-primary"></div>

                <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
                    {scanStatus === 'scanning' ? (
                        <div className="absolute inset-0 z-20">
                            <div className="w-full h-1 bg-primary/50 shadow-[0_0_20px_var(--color-primary)] animate-scan"></div>
                            <div className="w-full h-full bg-primary/5 animate-pulse"></div>
                        </div>
                    ) : scanStatus === 'success' ? (
                         <div className="absolute inset-0 z-30 bg-green-500/10 flex flex-col items-center justify-center animate-fade-in">
                             <div className="w-20 h-20 bg-green-500 rounded-none flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                                 <QrCode size={40} className="text-white" />
                             </div>
                             <p className="mt-6 text-green-500 uppercase">Credential Verified</p>
                         </div>
                    ) : scanStatus === 'error' ? (
                        <div className="absolute inset-0 z-30 bg-red-500/10 flex flex-col items-center justify-center animate-fade-in px-6 text-center">
                            <p className="text-red-400 uppercase text-sm tracking-wider">Camera Access Failed</p>
                            <p className="mt-3 text-red-200/80 text-xs uppercase tracking-widest">Allow permission and retry scan</p>
                        </div>
                    ) : null}

                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                    />
                    
                    {/* Overlay Grid */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <button 
                    onClick={startScanner}
                    disabled={scanStatus === 'scanning'}
                    className={`px-16 py-5 bg-primary text-white uppercase shadow-[0_0_40px_rgba(200,16,46,0.3)] transition-all flex items-center gap-4 ${scanStatus === 'scanning' ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95'}`}
                >
                    <RefreshCw size={16} className={scanStatus === 'scanning' ? 'animate-spin' : ''} />
                    {scanStatus === 'scanning' ? 'Scanning Live Feed...' : 'Restart QR Scan'}
                </button>

                <p className="text-gray-300/90 uppercase text-[11px] tracking-[0.22em] text-center max-w-2xl">{scanMessage}</p>
                {scanResult && (
                    <p className="text-green-400 uppercase text-[11px] tracking-[0.2em] break-all text-center max-w-2xl">Payload: {scanResult}</p>
                )}

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-gray-300 uppercase">Biometric Sync: Enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-gray-300 uppercase">Auto-Log: Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveFeed;

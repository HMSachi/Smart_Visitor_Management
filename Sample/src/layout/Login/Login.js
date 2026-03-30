import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../actions/LoginAction";

const DataFetcher = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.data);
    
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Data Fetching Template
            </h2>
            <p className="text-gray-600 mb-6">
                Example of GET request with loading and error handling
            </p>
            
            {loading && (
                <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-gray-600">Loading...</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                Error: {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {data && (  
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Fetched Data:
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataFetcher;
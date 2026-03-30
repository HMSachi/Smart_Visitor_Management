import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import Header from '../../../components/Contact_Person/Layout/Header';
import RequestReviewComponent from '../../../components/Contact_Person/RequestReview/RequestReview';

const RequestReview = () => {
    return (
        <div className="flex bg-mas-black overflow-hidden text-white h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] overflow-y-auto relative">
                <Header title="Request Review" />
                <RequestReviewComponent />
            </div>
        </div>
    );
};

export default RequestReview;

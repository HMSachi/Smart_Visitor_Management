import React from 'react';
import Sidebar from '../../../components/Contact_Person/Layout/Sidebar';
import RequestReviewComponent from '../../../components/Contact_Person/RequestReview/RequestReview';

const RequestReview = () => {
    return (
        <div className="contact-theme-root flex bg-[var(--color-bg-default)] overflow-hidden text-[var(--color-text-primary)] h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-default)] relative">
                <RequestReviewComponent />
            </div>
        </div>
    );
};

export default RequestReview;

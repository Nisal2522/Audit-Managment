import React from 'react';

const Notifications = () => {
    return (

        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Notifications</h1>
                <a className="text-blue-500 text-sm" href="#">
                    Mark all as read
                </a>
            </div>
            <div className="flex border-b mb-4">
                <a
                    className="text-blue-500 border-b-2 border-blue-500 pb-2 px-4"
                    href="#"
                >
                    All
                </a>
                <a className="text-gray-500 pb-2 px-4" href="#">
                    Unread
                </a>
                <a className="text-gray-500 pb-2 px-4" href="#">
                    @mention
                </a>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
                <img
                    alt="A yellow bell icon"
                    className="mb-4"
                    src="https://placehold.co/100x100?text=Bell"
                />
                <p className="text-lg font-semibold mb-2">No notification yet</p>
                <p className="text-gray-500">
                    You'll see notifications here when they are available
                </p>
            </div>
        </div>

    );
};

export default Notifications;
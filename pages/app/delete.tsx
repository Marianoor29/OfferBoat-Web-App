import React from "react";

const Delete = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-5 sm:px-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-blue-900 mb-8 text-center">
        Delete Your Account
      </h1>
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <p className="text-lg text-gray-700 mb-4">
          Please follow these steps to delete your account:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-800 text-base sm:text-lg">
          <li>Go to the <strong>Profile</strong> screen in the app.</li>
          <li>Navigate to the <strong>Account Settings</strong> screen.</li>
          <li>Find and open the <strong>Delete Account</strong> tab.</li>
          <li>
            Ensure you have no accepted bookings. If you have any accepted
            bookings, wait until they are completed before attempting to delete
            your account.
          </li>
          <li>
            Once eligible, click on the <strong>Delete Account</strong> button to
            permanently delete your account and all associated data.
          </li>
        </ul>
        <p className="text-sm text-gray-600 mt-6">
          Note: This action is irreversible. Make sure you have completed or
          canceled all bookings before proceeding.
        </p>
      </div>
    </div>
  );
};

export default Delete;

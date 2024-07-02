import React from 'react'

const page = () => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-12">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                {/* Heading */}
                <h1 className="text-3xl font-bold mb-4 text-center">Public Profile Link</h1>

                {/* Subheading and Text Area */}
                <div className="mb-6">
                    <p className="text-lg mb-2 text-center">Send anonymous message to @username</p>
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your anonymous message here"
                        rows={4}
                    ></textarea>
                    <button className="w-full mt-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400">
                        Send It
                    </button>
                </div>

                {/* Suggest Message Button */}
                <div className="mb-6">
                    <button className="w-full py-2 mb-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Suggest Messages
                    </button>
                    <p className="text-center mb-4">Click on any message below to select it.</p>
                    <div className="flex flex-col items-center space-y-2">
                        <button className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            What is something or someone that always manages to brighten your day?
                        </button>
                        <button className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            Tell us about a memorable travel experience you've had.
                        </button>
                        <button className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            If you could learn any skill instantly, what would it be?
                        </button>
                    </div>
                </div>

                {/* Footer Heading */}
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-semibold">Get started with your anonymous feedback</h2>
                </div>
            </div>
        </div>
    )
}



export default page
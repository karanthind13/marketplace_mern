import React from 'react'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-extrabold text-center text-indigo-900 mb-6">
          About EMIVilla
        </h1>
        
        <p className="text-lg leading-relaxed mb-6 text-gray-600">
          Welcome to <span className="font-semibold text-indigo-600">EMIVilla</span> – your ultimate destination to find the perfect property with ease. Whether you're looking to 
          <span className="font-medium text-gray-700"> buy</span>, <span className="font-medium text-gray-700">sell</span>, or <span className="font-medium text-gray-700">rent</span> a property, we simplify the entire process by connecting verified listings with genuine users.
        </p>
        
        <p className="text-lg leading-relaxed mb-6 text-gray-600">
          Our mission at EMIVilla is to make property transactions <span className="font-medium text-gray-700">transparent</span>, <span className="font-medium text-gray-700">secure</span>, and 
          <span className="font-medium text-gray-700"> accessible</span> for everyone. We aim to eliminate the hassle of house hunting by providing a smooth, efficient, and user-friendly experience.
        </p>

        {/* Team Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">Meet the Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member Cards */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-indigo-800">Karanpal Singh</h3>
              <p className="text-sm text-indigo-500">Founder & Full Stack Developer</p>
              <p className="text-gray-600 mt-2">Karanpal laid the foundation of EMIVilla with a vision to modernize property listings and streamline the buying and selling process.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-indigo-800">Yuvraj Singh</h3>
              <p className="text-sm text-indigo-500">Frontend Developer</p>
              <p className="text-gray-600 mt-2">Yuvraj crafted a smooth and intuitive user interface to enhance the user experience across all devices.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-indigo-800">Gurtirath Singh</h3>
              <p className="text-sm text-indigo-500">Backend & API Specialist</p>
              <p className="text-gray-600 mt-2">Gurtirath handled database integrations, backend architecture, and API development to ensure smooth operation of the platform.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold text-indigo-800">Sukhwinder Kaur</h3>
              <p className="text-sm text-indigo-500">UI/UX Designer & QA Lead</p>
              <p className="text-gray-600 mt-2">Sukhwinder focused on ensuring a seamless user journey and testing features to maintain a reliable and pleasant user experience.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="bg-gray-800 text-center text-sm text-gray-300 py-4 mt-12 border-t">
        <p className="mb-2">Contact us at: 
          <a href="mailto:karanpalthind990@gmail.com" className="text-indigo-400 hover:underline">
            karanpalthind990@gmail.com
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} EMIVilla. All rights reserved. Unauthorized duplication is a violation of applicable laws.</p>
      </footer>
    </div>
  )
}

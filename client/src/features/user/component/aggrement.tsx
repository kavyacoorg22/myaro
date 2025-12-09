



import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publicFrontendRoutes } from '../../../constants/frontendRoutes/publicFrontendRoutes';

import { Header } from '../../public';

export const BeauticianAgreementScreen: React.FC = () => {
  const navigate = useNavigate();
  const handleContinue = () => navigate(publicFrontendRoutes.profile,{replace:true});

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-md max-w-3xl w-full p-5 md:p-6">

        {/* Success Badge */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 rounded-full p-2">
            <Check className="w-8 h-8" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Take your business to the next level with Myaro.
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Enhance your visibility and connect with a wide customer base.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">

          {/* Illustration */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 border border-orange-200 flex justify-center">
            <svg viewBox="0 0 200 200" className="w-32 md:w-40">
              <circle cx="40" cy="40" r="15" fill="#FED7AA" opacity="0.5" />
              <circle cx="160" cy="50" r="20" fill="#FDBA74" opacity="0.5" />
              <circle cx="50" cy="160" r="18" fill="#FB923C" opacity="0.4" />

              <ellipse cx="100" cy="120" rx="28" ry="36" fill="#F97316" />
              <circle cx="100" cy="85" r="20" fill="#FDBA74" />

              <ellipse cx="70" cy="145" rx="18" ry="28" fill="#FB923C" />
              <circle cx="70" cy="120" r="14" fill="#FED7AA" />

              <ellipse cx="140" cy="135" rx="18" ry="30" fill="#EA580C" />
              <circle cx="140" cy="110" r="13" fill="#FFEDD5" />

              <text x="10" y="25" fontSize="14">💄</text>
              <text x="170" y="35" fontSize="14">✂️</text>
              <text x="30" y="180" fontSize="14">💅</text>
              <text x="165" y="175" fontSize="14">💇</text>
            </svg>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">

            {/* Note Header */}
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-gray-800">please note</h3>
              <AlertTriangle className="text-red-500 w-5 h-5" />
            </div>

            {/* Description List (UNCHANGED text) */}
            <div className="space-y-2 text-gray-700 text-sm">

              <div className="flex gap-2">
                <div>📅</div>
                <p>
                  A calendar feature will be available where you can mark your unavailable dates. This
                  calendar will be visible to customers, allowing them to see when you're not available for
                  services and preventing booking requests on those blocked dates
                </p>
              </div>

              <div className="flex gap-2">
                <div>📸</div>
                <p>
                  The platform will include a media upload feature for videos and images
                </p>
              </div>

              <div className="flex gap-2">
                <div>📍</div>
                <p>
                  Enter your complete address information and main business location so customers can
                  search and filter based on location. You can indicate all areas where you offer your services.
                </p>
              </div>

              <div className="flex gap-2">
                <div>🏠</div>
                <p>
                  <strong>Grow your business with home services</strong> - Reach customers who prefer beauty
                  services at their doorstep
                </p>
              </div>

              <div className="flex gap-2">
                <div>💰</div>
                <p>
                  Amount will be held by admin until you complete the service - ensuring secure and safe transactions
                </p>
              </div>

              <div className="flex gap-2">
                <div>✂️</div>
                <p>
                  You can mention all the services you're offering with custom pricing and packages
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-semibold py-2.5 px-10 rounded-lg shadow-md transition text-sm"
          >
            Agree & continue
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-3">
          Your profile is now under review. You'll be notified once approved! 🎉
        </p>

      </div>
    </div>
    </>
  );
};

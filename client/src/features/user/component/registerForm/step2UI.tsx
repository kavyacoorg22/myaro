import { FormProvider } from "react-hook-form";
import { FormField, FormMessage } from "../../../../components/ui/form";
import { ValidationAlert } from "../../../models/validatationAlert";

export function Step2UI({
  methods,
  hasShop,
  setHasShop,
  portfolioFiles,
  certificateFiles,
  shopPhotos,
  licenseFiles,
  handlePortfolioUpload,
  handleCertificateUpload,
  handleShopPhotoUpload,
  handleLicenseUpload,
  handleSubmit,
  onBack,
  validationAlert,
  closeValidationAlert
}: any) {
  const { register } = methods;
  
  return (
    <FormProvider {...methods}>
          <ValidationAlert
        isOpen={validationAlert.isOpen}
        onClose={closeValidationAlert}
        message={validationAlert.message}
        type={validationAlert.type}
      />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-2">Register as Beautician - Step 2 of 3</h2>
          <p className="text-sm text-center text-gray-600 mb-1">
            Show your work & prove your skills ✨ This helps customers trust and choose you.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
          <div className="h-1 w-16 bg-purple-500 rounded"></div>
          <div className="h-1 w-16 bg-gray-300 rounded"></div>
        </div>

        {/* Portfolio Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-500">🖼️</span>
            <h3 className="font-medium">Your Portfolio</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">Add photos of your work (minimum 3)</p>
          
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-8 cursor-pointer hover:bg-purple-50 transition">
            <span className="text-3xl mb-2">📤</span>
            <span className="text-sm text-purple-600 font-medium">+ Add photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePortfolioUpload}
            />
          </label>
          
          {portfolioFiles.length > 0 && (
            <div className={`border rounded-lg p-2 mt-2 flex items-center gap-2 ${
              portfolioFiles.length >= 3 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'
            }`}>
              <span className={portfolioFiles.length >= 3 ? 'text-green-600 text-lg' : 'text-orange-600 text-lg'}>
                {portfolioFiles.length >= 3 ? '✓' : '⚠'}
              </span>
              <span className={`text-xs ${portfolioFiles.length >= 3 ? 'text-green-700' : 'text-orange-700'}`}>
                {portfolioFiles.length} photo{portfolioFiles.length > 1 ? 's' : ''} uploaded {portfolioFiles.length < 3 ? `( ${3 - portfolioFiles.length} more needed)` : ''}
              </span>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Accepted: JPG, PNG | Max 5MB each
          </p>
          <p className="text-xs text-gray-500">💡 Tip: Upload before/after looks or bridal & makeup shots</p>
        </div>

        {/* Certificates Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-500">🎓</span>
            <h3 className="font-medium">Certificates</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Upload Beauty or makeup certificate (certificate can increase trust and booking!)
          </p>
          
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-8 cursor-pointer hover:bg-purple-50 transition">
            <span className="text-3xl mb-2">📤</span>
            <span className="text-sm text-purple-600 font-medium">+ Add photos</span>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleCertificateUpload}
            />
          </label>
          
          {certificateFiles.length > 0 && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-2 mt-2 flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <span className="text-xs text-green-700">
                {certificateFiles.length} certificate{certificateFiles.length > 1 ? 's' : ''} uploaded
              </span>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">PDF or image file accepted</p>
          
          <div className="bg-orange-50 border border-orange-200 rounded p-2 mt-3">
            <p className="text-xs text-orange-700">
              ⚠️ Verified beauticians get more bookings & better visibility
            </p>
          </div>
        </div>

        {/* Shop Details Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-600">🏪</span>
            <h3 className="font-medium">Shop Details</h3>
          </div>
          
          <label className="block text-sm text-gray-700 mb-3">
            📍 Do you have beauty shop/salon?
          </label>
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setHasShop(true)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                hasShop === true 
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasShop(false)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                hasShop === false 
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              No
            </button>
          </div>

          {hasShop === false && (
            <div className="border-2 border-pink-300 bg-pink-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-pink-700 text-center">
                📝 Don't worry ---- home beauticians are welcome too 🧡
              </p>
            </div>
          )}

          {hasShop === true && (
            <div className="space-y-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">📤</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">Upload shop photos (1-5)</p>
                    <p className="text-xs text-blue-700">
                      Show customers your beautiful salon space
                    </p>
                  </div>
                </div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-white rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition mt-3">
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-xs text-blue-600 font-medium">+ Add shop photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleShopPhotoUpload}
                  />
                </label>
                {shopPhotos.length > 0 && (
                  <div className={`border rounded-lg p-2 mt-2 flex items-center gap-2 ${
                    shopPhotos.length >= 3 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'
                  }`}>
                    <span className={shopPhotos.length >= 3 ? 'text-green-600 text-lg' : 'text-orange-600 text-lg'}>
                      {shopPhotos.length >= 3 ? '✓' : '⚠'}
                    </span>
                    <span className={`text-xs ${shopPhotos.length >= 3 ? 'text-green-700' : 'text-orange-700'}`}>
                      {shopPhotos.length} photo{shopPhotos.length > 1 ? 's' : ''} uploaded {shopPhotos.length < 3 ? `( ${3 - shopPhotos.length} more needed)` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-lg">📄</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cyan-900 mb-1">Upload shop license (optional)</p>
                    <p className="text-xs text-cyan-700">
                      Helps build trust with customers
                    </p>
                  </div>
                </div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-cyan-300 bg-white rounded-lg p-3 cursor-pointer hover:bg-cyan-50 transition">
                  <span className="text-xl mb-1">📑</span>
                  <span className="text-xs text-cyan-600 font-medium">+ Upload license</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleLicenseUpload}
                  />
                </label>
                {licenseFiles.length > 0 && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-2 mt-2 flex items-center gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-xs text-green-700">
                      {licenseFiles.length} license file{licenseFiles.length > 1 ? 's' : ''} uploaded
                    </span>
                  </div>
                )}
              </div>

              <FormField name="shop.shopName">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  placeholder="Eg: Beauty paradise salon"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                  {...register('shop.shopName')}
                />
                <FormMessage />
              </FormField>

              <FormField name="shop.address">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  placeholder="Street, Area, Landmark"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300 resize-none"
                  {...register('shop.address')}
                />
                <FormMessage />
              </FormField>

              <FormField name="shop.city">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                  {...register('shop.city')}
                />
                <FormMessage />
              </FormField>

              <FormField name="shop.pincode">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none transition focus:border-blue-500 focus:ring-blue-300"
                  {...register('shop.pincode')}
                />
                <FormMessage />
              </FormField>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-purple-300 hover:bg-purple-400 text-gray-800 font-medium py-3 rounded-lg transition"
          >
            Continue
          </button>
        </div>
      </div>
    </FormProvider>
  );
}
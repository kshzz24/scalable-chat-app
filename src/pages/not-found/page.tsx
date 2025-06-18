import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react";

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute -top-2 -right-6 w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30 backdrop-blur-sm">
              <Search className="w-12 h-12 text-blue-400 animate-pulse" />
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleGoHome}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
            
            <button 
              onClick={handleGoBack}
              className="w-full sm:w-auto bg-gray-800/50 border border-gray-600 text-gray-200 hover:bg-gray-700/70 hover:border-gray-500 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          <button 
            onClick={handleRefresh}
            className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-gray-700/50">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{" "}
            <a 
              href="/contact" 
              className="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-4 transition-colors duration-300"
            >
              contact support
            </a>
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
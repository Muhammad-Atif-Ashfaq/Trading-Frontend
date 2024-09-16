import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const errorMessage = error?.status === 404 ? '404 Page Not Found' : 'An unexpected error has occurred';

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-2xl text-gray-700 mb-4">{errorMessage}</p>
        <p className="text-gray-500">
          We're sorry, but the page you were looking for doesn't exist or an error occurred.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

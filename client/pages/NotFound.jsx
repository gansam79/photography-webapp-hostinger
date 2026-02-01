import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="font-playfair text-6xl font-bold text-charcoal-900 dark:text-white mb-4">
        404
      </h1>
      <h2 className="luxury-text-subtitle text-2xl mb-4">Page Not Found</h2>
      <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist. Let's get you back to
        managing your photography business.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors"
      >
        <Home className="w-5 h-5" />
        Back to Dashboard
      </Link>
    </div>
  );
}

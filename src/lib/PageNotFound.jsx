import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

// Map of legacy WordPress URLs → new React routes
const LEGACY_REDIRECTS = {
  // Old news paths
  '/ezpay-america-news': '/News',
  '/ezpay-america-news/': '/News',
  '/ezpay-america-news/page/1': '/News',
  '/ezpay-america-news/page/1/': '/News',
  '/ezpay-america-news/page/2': '/News',
  '/ezpay-america-news/page/2/': '/News',
  '/ezpay-news': '/News',
  '/ezpay-news/': '/News',
  '/news/the-state-of-small-business-ownership-in-2024': '/News',
  '/news/the-state-of-small-business-ownership-in-2024/': '/News',
  '/news/7-mistakes-restaurant-owners-make': '/News',
  '/news/7-mistakes-restaurant-owners-make/': '/News',
  '/news/payment-processing-in-todays-marketplace': '/News',
  '/news/payment-processing-in-todays-marketplace/': '/News',

  // Services / Merchants
  '/restaurant-merchants': '/RestaurantMerchants',
  '/restaurant-merchants/': '/RestaurantMerchants',
  '/point-of-sale': '/EzPayPOSHome',
  '/point-of-sale/': '/EzPayPOSHome',
  '/free-web-payment-pages': '/WebPaymentPages',
  '/free-web-payment-pages/': '/WebPaymentPages',
  '/merchant-cash-advance': '/MerchantCashAdvance',
  '/merchant-cash-advance/': '/MerchantCashAdvance',
  '/retail-payment-solutions': '/RetailPaymentSolutions',
  '/retail-payment-solutions/': '/RetailPaymentSolutions',

  // Contact variations
  '/contact-us': '/Contact',
  '/contact-us/': '/Contact',

  // Apply Online variations
  '/apply-online': '/ApplyOnline',
  '/apply-online/': '/ApplyOnline',

  // Brand pages → Shop or Services
  '/brand/authorize-net': '/Shop',
  '/brand/authorize-net/': '/Shop',
  '/brand/bbpos': '/Shop',
  '/brand/bbpos/': '/Shop',
  '/brand/charge-anywhere': '/Shop',
  '/brand/charge-anywhere/': '/Shop',
  '/brand/clover-go': '/Shop',
  '/brand/clover-go/': '/Shop',
  '/brand/clover': '/Shop',
  '/brand/clover/': '/Shop',
  '/brand/dejavoo': '/Shop',
  '/brand/dejavoo/': '/Shop',
  '/brand/linga': '/Shop',
  '/brand/linga/': '/Shop',
  '/brand/nmi-gateway': '/BrandedPaymentGateway',
  '/brand/nmi-gateway/': '/BrandedPaymentGateway',
  '/brand/page/2': '/Shop',
  '/brand/page/2/': '/Shop',
  '/brand/pax': '/Shop',
  '/brand/pax/': '/Shop',
  '/brand/payanywhere': '/Shop',
  '/brand/payanywhere/': '/Shop',
  '/brand/swipesimple': '/Shop',
  '/brand/swipesimple/': '/Shop',

  // Misc old paths
  '/get-ranked-on-google': '/',
  '/get-ranked-on-google/': '/',
  '/texting-privacy-policy': '/',
  '/texting-privacy-policy/': '/',
};

// Handle locale prefixes like /es-mx, /es-mx/services → strip and redirect
function resolveRedirect(pathname) {
  // Direct match
  if (LEGACY_REDIRECTS[pathname]) return LEGACY_REDIRECTS[pathname];

  // Strip trailing slash variant
  const noSlash = pathname.replace(/\/$/, '');
  if (LEGACY_REDIRECTS[noSlash]) return LEGACY_REDIRECTS[noSlash];

  // Strip locale prefix like /es-mx/...
  const localeStripped = pathname.replace(/^\/(es-mx|en-us|fr|de|pt)(\/|$)/, '/');
  if (localeStripped !== pathname) {
    if (LEGACY_REDIRECTS[localeStripped] || LEGACY_REDIRECTS[localeStripped.replace(/\/$/, '')]) {
      return LEGACY_REDIRECTS[localeStripped] || LEGACY_REDIRECTS[localeStripped.replace(/\/$/, '')] || '/';
    }
    return '/'; // Unknown locale path → home
  }

  // Strip query params like ?amp
  const noQuery = pathname.split('?')[0];
  if (noQuery !== pathname && LEGACY_REDIRECTS[noQuery]) return LEGACY_REDIRECTS[noQuery];

  return null;
}

export default function PageNotFound({}) {
    const location = useLocation();
    const navigate = useNavigate();
    const pageName = location.pathname.substring(1);

    useEffect(() => {
      const fullPath = location.pathname + location.search;
      const redirect = resolveRedirect(location.pathname) || resolveRedirect(fullPath.split('?')[0]);
      if (redirect) {
        navigate(redirect, { replace: true });
      }
    }, [location.pathname]);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-slate-300">404</h1>
                        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-slate-800">
                            Page Not Found
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-slate-700">Admin Note</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
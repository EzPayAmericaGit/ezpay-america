import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Quiz from './pages/Quiz';
import RetailPaymentSolutions from './pages/RetailPaymentSolutions';
import RetailMerchants from './pages/RetailMerchants';
import RestaurantMerchants from './pages/RestaurantMerchants';
import WebPaymentPages from './pages/WebPaymentPages';
import MerchantCashAdvance from './pages/MerchantCashAdvance';
import EzPayPOS from './pages/EzPayPOS';
import EzPayPOSHome from './pages/EzPayPOSHome';
import RetailPOS from './pages/RetailPOS';
import RestaurantPOS from './pages/RestaurantPOS';
import FreeDemo from './pages/FreeDemo';
import ApplyOnline from './pages/ApplyOnline';
import News from './pages/News';
import NewsAdmin from './pages/NewsAdmin';
import NewsArticle from './pages/NewsArticle';
import ApplicationTracker from './pages/ApplicationTracker';
import AdminDashboard from './pages/AdminDashboard';
import Sitemap from './pages/Sitemap';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Contact": Contact,
    "Support": Support,
    "Quiz": Quiz,
    "RetailPaymentSolutions": RetailPaymentSolutions,
    "RetailMerchants": RetailMerchants,
    "RestaurantMerchants": RestaurantMerchants,
    "WebPaymentPages": WebPaymentPages,
    "MerchantCashAdvance": MerchantCashAdvance,
    "EzPayPOS": EzPayPOS,
    "EzPayPOSHome": EzPayPOSHome,
    "RetailPOS": RetailPOS,
    "RestaurantPOS": RestaurantPOS,
    "FreeDemo": FreeDemo,
    "ApplyOnline": ApplyOnline,
    "News": News,
    "NewsAdmin": NewsAdmin,
    "NewsArticle": NewsArticle,
    "ApplicationTracker": ApplicationTracker,
    "AdminDashboard": AdminDashboard,
    "Sitemap": Sitemap,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
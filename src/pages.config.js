/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import ACHPayments from './pages/ACHPayments';
import AutomatedInvoicing from './pages/AutomatedInvoicing';
import ChargebackManagement from './pages/ChargebackManagement';
import CRMPage from './pages/CRMPage';
import DeveloperAPI from './pages/DeveloperAPI';
import FraudDetection from './pages/FraudDetection';
import FraudRules from './pages/FraudRules';
import WebhookManagement from './pages/WebhookManagement';
import InstantPayouts from './pages/InstantPayouts';
import Integrations from './pages/Integrations';
import InventoryManagement from './pages/InventoryManagement';
import MarketingTools from './pages/MarketingTools';
import OnlineCheckout from './pages/OnlineCheckout';
import PaymentLinks from './pages/PaymentLinks';
import PCICompliance from './pages/PCICompliance';
import RecurringBilling from './pages/RecurringBilling';
import ThreeDSecure from './pages/ThreeDSecure';
import TokenizationSecurity from './pages/TokenizationSecurity';
import UsageBasedBilling from './pages/UsageBasedBilling';
import VirtualTerminal from './pages/VirtualTerminal';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AgentManagement from './pages/AgentManagement';
import Analytics from './pages/Analytics';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicationsAdmin from './pages/ApplicationsAdmin';
import ApplyOnline from './pages/ApplyOnline';
import BacklinkOutreach from './pages/BacklinkOutreach';
import BagelShopPOS from './pages/BagelShopPOS';
import BrandedPaymentGateway from './pages/BrandedPaymentGateway';
import FullServiceRestaurantPOS from './pages/FullServiceRestaurantPOS';
import QuickServicePOS from './pages/QuickServicePOS';
import BakeryPOS from './pages/BakeryPOS';
import CateringPOS from './pages/CateringPOS';
import IceCreamShopPOS from './pages/IceCreamShopPOS';
import JuiceSmoothieBarPOS from './pages/JuiceSmoothieBarPOS';
import GhostKitchenPOS from './pages/GhostKitchenPOS';
import BreweryPOS from './pages/BreweryPOS';
import WineryPOS from './pages/WineryPOS';
import NightclubPOS from './pages/NightclubPOS';
import HotelRestaurantPOS from './pages/HotelRestaurantPOS';
import CafeteriaPOS from './pages/CafeteriaPOS';
import GatewayRecurringBilling from './pages/GatewayRecurringBilling';
import GatewayFraudProtection from './pages/GatewayFraudProtection';
import GatewayTokenization from './pages/GatewayTokenization';
import GatewayPaymentLinks from './pages/GatewayPaymentLinks';
import GatewayMobilePayments from './pages/GatewayMobilePayments';
import GatewayReporting from './pages/GatewayReporting';
import BarTavernPOS from './pages/BarTavernPOS';
import BusinessDashboard from './pages/BusinessDashboard';
import CBDStorePOS from './pages/CBDStorePOS';
import CRM from './pages/CRM';
import Checkout from './pages/Checkout';
import CoffeePOS from './pages/CoffeePOS';
import Contact from './pages/Contact';
import ContentBot from './pages/ContentBot';
import CountertopTerminal from './pages/CountertopTerminal';
import CustomerOnboarding from './pages/CustomerOnboarding';
import CustomerPortal from './pages/CustomerPortal';
import DeliShopPOS from './pages/DeliShopPOS';
import ECommerce from './pages/ECommerce';
import EmailMarketing from './pages/EmailMarketing';
import EquipmentInventory from './pages/EquipmentInventory';
import EzPayPOS from './pages/EzPayPOS';
import EzPayPOSHome from './pages/EzPayPOSHome';
import FoodTruckPOS from './pages/FoodTruckPOS';
import FreeDemo from './pages/FreeDemo';
import GiftShopPOS from './pages/GiftShopPOS';
import GroceryStorePOS from './pages/GroceryStorePOS';
import Helpdesk from './pages/Helpdesk';
import Home from './pages/Home';
import Invoicing from './pages/Invoicing';
import LiquorStorePOS from './pages/LiquorStorePOS';
import MerchantCapital from './pages/MerchantCapital';
import MerchantCashAdvance from './pages/MerchantCashAdvance';
import MiniMarketPOS from './pages/MiniMarketPOS';
import MobilePayments from './pages/MobilePayments';
import News from './pages/News';
import NewsAdmin from './pages/NewsAdmin';
import NewsArticle from './pages/NewsArticle';
import NotificationPreferences from './pages/NotificationPreferences';
import Offers from './pages/Offers';
import OrdersAdmin from './pages/OrdersAdmin';
import ProcessPayment from './pages/ProcessPayment';
import ProductAdmin from './pages/ProductAdmin';
import Quiz from './pages/Quiz';
import RestaurantMerchants from './pages/RestaurantMerchants';
import RestaurantPOS from './pages/RestaurantPOS';
import RetailMerchants from './pages/RetailMerchants';
import RetailPOS from './pages/RetailPOS';
import RetailPaymentSolutions from './pages/RetailPaymentSolutions';
import RobotsTxt from './pages/RobotsTxt';
import Services from './pages/Services';
import SettingsAdmin from './pages/SettingsAdmin';
import Shop from './pages/Shop';
import Sitemap from './pages/Sitemap';
import Support from './pages/Support';
import TemplateManagement from './pages/TemplateManagement';
import TransactionHistory from './pages/TransactionHistory';
import UserManagement from './pages/UserManagement';
import VapeStorePOS from './pages/VapeStorePOS';
import WebPaymentPages from './pages/WebPaymentPages';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ACHPayments": ACHPayments,
    "AutomatedInvoicing": AutomatedInvoicing,
    "ChargebackManagement": ChargebackManagement,
    "CRMPage": CRMPage,
    "DeveloperAPI": DeveloperAPI,
    "FraudDetection": FraudDetection,
    "FraudRules": FraudRules,
    "WebhookManagement": WebhookManagement,
    "InstantPayouts": InstantPayouts,
    "Integrations": Integrations,
    "InventoryManagement": InventoryManagement,
    "MarketingTools": MarketingTools,
    "OnlineCheckout": OnlineCheckout,
    "PaymentLinks": PaymentLinks,
    "PCICompliance": PCICompliance,
    "RecurringBilling": RecurringBilling,
    "ThreeDSecure": ThreeDSecure,
    "TokenizationSecurity": TokenizationSecurity,
    "UsageBasedBilling": UsageBasedBilling,
    "VirtualTerminal": VirtualTerminal,
    "Admin": Admin,
    "AdminDashboard": AdminDashboard,
    "AgentManagement": AgentManagement,
    "Analytics": Analytics,
    "AnalyticsDashboard": AnalyticsDashboard,
    "ApplicationTracker": ApplicationTracker,
    "ApplicationsAdmin": ApplicationsAdmin,
    "ApplyOnline": ApplyOnline,
    "BacklinkOutreach": BacklinkOutreach,
    "BagelShopPOS": BagelShopPOS,
    "BrandedPaymentGateway": BrandedPaymentGateway,
    "FullServiceRestaurantPOS": FullServiceRestaurantPOS,
    "QuickServicePOS": QuickServicePOS,
    "BakeryPOS": BakeryPOS,
    "CateringPOS": CateringPOS,
    "IceCreamShopPOS": IceCreamShopPOS,
    "JuiceSmoothieBarPOS": JuiceSmoothieBarPOS,
    "GhostKitchenPOS": GhostKitchenPOS,
    "BreweryPOS": BreweryPOS,
    "WineryPOS": WineryPOS,
    "NightclubPOS": NightclubPOS,
    "HotelRestaurantPOS": HotelRestaurantPOS,
    "CafeteriaPOS": CafeteriaPOS,
    "GatewayRecurringBilling": GatewayRecurringBilling,
    "GatewayFraudProtection": GatewayFraudProtection,
    "GatewayTokenization": GatewayTokenization,
    "GatewayPaymentLinks": GatewayPaymentLinks,
    "GatewayMobilePayments": GatewayMobilePayments,
    "GatewayReporting": GatewayReporting,
    "BarTavernPOS": BarTavernPOS,
    "BusinessDashboard": BusinessDashboard,
    "CBDStorePOS": CBDStorePOS,
    "CRM": CRM,
    "Checkout": Checkout,
    "CoffeePOS": CoffeePOS,
    "Contact": Contact,
    "ContentBot": ContentBot,
    "CountertopTerminal": CountertopTerminal,
    "CustomerOnboarding": CustomerOnboarding,
    "CustomerPortal": CustomerPortal,
    "DeliShopPOS": DeliShopPOS,
    "ECommerce": ECommerce,
    "EmailMarketing": EmailMarketing,
    "EquipmentInventory": EquipmentInventory,
    "EzPayPOS": EzPayPOS,
    "EzPayPOSHome": EzPayPOSHome,
    "FoodTruckPOS": FoodTruckPOS,
    "FreeDemo": FreeDemo,
    "GiftShopPOS": GiftShopPOS,
    "GroceryStorePOS": GroceryStorePOS,
    "Helpdesk": Helpdesk,
    "Home": Home,
    "Invoicing": Invoicing,
    "LiquorStorePOS": LiquorStorePOS,
    "MerchantCapital": MerchantCapital,
    "MerchantCashAdvance": MerchantCashAdvance,
    "MiniMarketPOS": MiniMarketPOS,
    "MobilePayments": MobilePayments,
    "News": News,
    "NewsAdmin": NewsAdmin,
    "NewsArticle": NewsArticle,
    "NotificationPreferences": NotificationPreferences,
    "Offers": Offers,
    "OrdersAdmin": OrdersAdmin,
    "ProcessPayment": ProcessPayment,
    "ProductAdmin": ProductAdmin,
    "Quiz": Quiz,
    "RestaurantMerchants": RestaurantMerchants,
    "RestaurantPOS": RestaurantPOS,
    "RetailMerchants": RetailMerchants,
    "RetailPOS": RetailPOS,
    "RetailPaymentSolutions": RetailPaymentSolutions,
    "RobotsTxt": RobotsTxt,
    "Services": Services,
    "SettingsAdmin": SettingsAdmin,
    "Shop": Shop,
    "Sitemap": Sitemap,
    "Support": Support,
    "TemplateManagement": TemplateManagement,
    "TransactionHistory": TransactionHistory,
    "UserManagement": UserManagement,
    "VapeStorePOS": VapeStorePOS,
    "WebPaymentPages": WebPaymentPages,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
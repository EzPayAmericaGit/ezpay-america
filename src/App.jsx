import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { setupIframeMessaging } from './lib/iframe-messaging';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ClothingBoutiquePOS from './pages/ClothingBoutiquePOS';
import ShoeStorePOS from './pages/ShoeStorePOS';
import JewelryStorePOS from './pages/JewelryStorePOS';
import SpecialtyFoodStorePOS from './pages/SpecialtyFoodStorePOS';
import FurnitureStorePOS from './pages/FurnitureStorePOS';
import ElectronicsStorePOS from './pages/ElectronicsStorePOS';
import SportingGoodsStorePOS from './pages/SportingGoodsStorePOS';
import PetStorePOS from './pages/PetStorePOS';
import FloristPOS from './pages/FloristPOS';
import ThriftStorePOS from './pages/ThriftStorePOS';
import PopUpRetailPOS from './pages/PopUpRetailPOS';
import HairSalonPOS from './pages/HairSalonPOS';
import BarberShopPOS from './pages/BarberShopPOS';
import NailSalonPOS from './pages/NailSalonPOS';
import SpaPOS from './pages/SpaPOS';
import MassageTherapyPOS from './pages/MassageTherapyPOS';
import TanningSalonPOS from './pages/TanningSalonPOS';
import TattooShopPOS from './pages/TattooShopPOS';
import BeautyClinicPOS from './pages/BeautyClinicPOS';
import MedSpaPOS from './pages/MedSpaPOS';
import PersonalTrainerPOS from './pages/PersonalTrainerPOS';
import YogaStudioPOS from './pages/YogaStudioPOS';
import FitnessGymPOS from './pages/FitnessGymPOS';
import DanceStudioPOS from './pages/DanceStudioPOS';
import CoachingBusinessPOS from './pages/CoachingBusinessPOS';
import DentalOfficePOS from './pages/DentalOfficePOS';
import ChiropractorPOS from './pages/ChiropractorPOS';
import PhysicalTherapyPOS from './pages/PhysicalTherapyPOS';
import UrgentCarePOS from './pages/UrgentCarePOS';
import PrivateMedicalPOS from './pages/PrivateMedicalPOS';
import MentalHealthClinicPOS from './pages/MentalHealthClinicPOS';
import VeterinaryClinicPOS from './pages/VeterinaryClinicPOS';
import HomeHealthcarePOS from './pages/HomeHealthcarePOS';
import MedicalLabPOS from './pages/MedicalLabPOS';
import HVACCompanyPOS from './pages/HVACCompanyPOS';
import PlumbingServicesPOS from './pages/PlumbingServicesPOS';
import ElectricalContractorPOS from './pages/ElectricalContractorPOS';
import RoofingCompanyPOS from './pages/RoofingCompanyPOS';
import LandscapingPOS from './pages/LandscapingPOS';
import PestControlPOS from './pages/PestControlPOS';
import ResidentialCleaningPOS from './pages/ResidentialCleaningPOS';
import CommercialCleaningPOS from './pages/CommercialCleaningPOS';
import RestorationCompanyPOS from './pages/RestorationCompanyPOS';
import HandymanServicesPOS from './pages/HandymanServicesPOS';
import PoolMaintenancePOS from './pages/PoolMaintenancePOS';
import SecurityInstallerPOS from './pages/SecurityInstallerPOS';
import MovingCompanyPOS from './pages/MovingCompanyPOS';
import ApplianceRepairPOS from './pages/ApplianceRepairPOS';
import DryCleanersPOS from './pages/DryCleanersPOS';
import LawFirmPOS from './pages/LawFirmPOS';
import AccountingFirmPOS from './pages/AccountingFirmPOS';
import BookkeepingServicesPOS from './pages/BookkeepingServicesPOS';
import MarketingAgencyPOS from './pages/MarketingAgencyPOS';
import ConsultingFirmPOS from './pages/ConsultingFirmPOS';
import ITServicesPOS from './pages/ITServicesPOS';
import WebDesignAgencyPOS from './pages/WebDesignAgencyPOS';
import SoftwareDeveloperPOS from './pages/SoftwareDeveloperPOS';
import ArchitectureFirmPOS from './pages/ArchitectureFirmPOS';
import EngineeringFirmPOS from './pages/EngineeringFirmPOS';
import StaffingAgencyPOS from './pages/StaffingAgencyPOS';
import TranslationServicesPOS from './pages/TranslationServicesPOS';
import PRFirmPOS from './pages/PRFirmPOS';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

setupIframeMessaging();

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <LayoutWrapper currentPageName={mainPageKey}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route key={path} path={`/${path}`} element={<Page />} />
        ))}
        <Route path="/ClothingBoutiquePOS" element={<ClothingBoutiquePOS />} />
        <Route path="/ShoeStorePOS" element={<ShoeStorePOS />} />
        <Route path="/JewelryStorePOS" element={<JewelryStorePOS />} />
        <Route path="/SpecialtyFoodStorePOS" element={<SpecialtyFoodStorePOS />} />
        <Route path="/FurnitureStorePOS" element={<FurnitureStorePOS />} />
        <Route path="/ElectronicsStorePOS" element={<ElectronicsStorePOS />} />
        <Route path="/SportingGoodsStorePOS" element={<SportingGoodsStorePOS />} />
        <Route path="/PetStorePOS" element={<PetStorePOS />} />
        <Route path="/FloristPOS" element={<FloristPOS />} />
        <Route path="/ThriftStorePOS" element={<ThriftStorePOS />} />
        <Route path="/PopUpRetailPOS" element={<PopUpRetailPOS />} />
        <Route path="/HairSalonPOS" element={<HairSalonPOS />} />
        <Route path="/BarberShopPOS" element={<BarberShopPOS />} />
        <Route path="/NailSalonPOS" element={<NailSalonPOS />} />
        <Route path="/SpaPOS" element={<SpaPOS />} />
        <Route path="/MassageTherapyPOS" element={<MassageTherapyPOS />} />
        <Route path="/TanningSalonPOS" element={<TanningSalonPOS />} />
        <Route path="/TattooShopPOS" element={<TattooShopPOS />} />
        <Route path="/BeautyClinicPOS" element={<BeautyClinicPOS />} />
        <Route path="/MedSpaPOS" element={<MedSpaPOS />} />
        <Route path="/PersonalTrainerPOS" element={<PersonalTrainerPOS />} />
        <Route path="/YogaStudioPOS" element={<YogaStudioPOS />} />
        <Route path="/FitnessGymPOS" element={<FitnessGymPOS />} />
        <Route path="/DanceStudioPOS" element={<DanceStudioPOS />} />
        <Route path="/CoachingBusinessPOS" element={<CoachingBusinessPOS />} />
        <Route path="/DentalOfficePOS" element={<DentalOfficePOS />} />
        <Route path="/ChiropractorPOS" element={<ChiropractorPOS />} />
        <Route path="/PhysicalTherapyPOS" element={<PhysicalTherapyPOS />} />
        <Route path="/UrgentCarePOS" element={<UrgentCarePOS />} />
        <Route path="/PrivateMedicalPOS" element={<PrivateMedicalPOS />} />
        <Route path="/MentalHealthClinicPOS" element={<MentalHealthClinicPOS />} />
        <Route path="/VeterinaryClinicPOS" element={<VeterinaryClinicPOS />} />
        <Route path="/HomeHealthcarePOS" element={<HomeHealthcarePOS />} />
        <Route path="/MedicalLabPOS" element={<MedicalLabPOS />} />
        <Route path="/HVACCompanyPOS" element={<HVACCompanyPOS />} />
        <Route path="/PlumbingServicesPOS" element={<PlumbingServicesPOS />} />
        <Route path="/ElectricalContractorPOS" element={<ElectricalContractorPOS />} />
        <Route path="/RoofingCompanyPOS" element={<RoofingCompanyPOS />} />
        <Route path="/LandscapingPOS" element={<LandscapingPOS />} />
        <Route path="/PestControlPOS" element={<PestControlPOS />} />
        <Route path="/ResidentialCleaningPOS" element={<ResidentialCleaningPOS />} />
        <Route path="/CommercialCleaningPOS" element={<CommercialCleaningPOS />} />
        <Route path="/RestorationCompanyPOS" element={<RestorationCompanyPOS />} />
        <Route path="/HandymanServicesPOS" element={<HandymanServicesPOS />} />
        <Route path="/PoolMaintenancePOS" element={<PoolMaintenancePOS />} />
        <Route path="/SecurityInstallerPOS" element={<SecurityInstallerPOS />} />
        <Route path="/MovingCompanyPOS" element={<MovingCompanyPOS />} />
        <Route path="/ApplianceRepairPOS" element={<ApplianceRepairPOS />} />
        <Route path="/DryCleanersPOS" element={<DryCleanersPOS />} />
        <Route path="/LawFirmPOS" element={<LawFirmPOS />} />
        <Route path="/AccountingFirmPOS" element={<AccountingFirmPOS />} />
        <Route path="/BookkeepingServicesPOS" element={<BookkeepingServicesPOS />} />
        <Route path="/MarketingAgencyPOS" element={<MarketingAgencyPOS />} />
        <Route path="/ConsultingFirmPOS" element={<ConsultingFirmPOS />} />
        <Route path="/ITServicesPOS" element={<ITServicesPOS />} />
        <Route path="/WebDesignAgencyPOS" element={<WebDesignAgencyPOS />} />
        <Route path="/SoftwareDeveloperPOS" element={<SoftwareDeveloperPOS />} />
        <Route path="/ArchitectureFirmPOS" element={<ArchitectureFirmPOS />} />
        <Route path="/EngineeringFirmPOS" element={<EngineeringFirmPOS />} />
        <Route path="/StaffingAgencyPOS" element={<StaffingAgencyPOS />} />
        <Route path="/TranslationServicesPOS" element={<TranslationServicesPOS />} />
        <Route path="/PRFirmPOS" element={<PRFirmPOS />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </LayoutWrapper>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
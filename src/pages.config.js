import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Quiz from './pages/Quiz';
import RetailPaymentSolutions from './pages/RetailPaymentSolutions';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Contact": Contact,
    "Support": Support,
    "Quiz": Quiz,
    "RetailPaymentSolutions": RetailPaymentSolutions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Contact": Contact,
    "Support": Support,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};
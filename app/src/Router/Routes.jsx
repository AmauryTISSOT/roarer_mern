import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Profil from "../pages/Profil/Profil.jsx";
import Recherche from "../pages/Recherche/Recherche.jsx";
import Notification from "../pages/Notification/Notification.jsx";
import Layout from "../layout/Layout.jsx";
import Inscription from "../pages/Inscription/Inscription.jsx";
import Connexion from "../pages/Connexion/Connexion.jsx";
import TweetDetail from "../components/TweetDetail/TweetDetail.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import CreateRoarer from "../pages/CreateRoarer/CreateRoarer.jsx";
import BookmarksPage from "../pages/BooksmarksPage/BookmarksPage.jsx";
const RoutesRoarer = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes accessibles à tout le monde */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes protégées */}
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profil />} />
            <Route path="/search" element={<Recherche />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/detail/:id" element={<TweetDetail />} />
            <Route path="/create" element={<CreateRoarer />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default RoutesRoarer;

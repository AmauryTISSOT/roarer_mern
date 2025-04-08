import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import MainContent from "../../components/MainContent/MainContent.jsx";
import style from "./Home.module.css";
import { WebcamProvider } from "../../provider/WebcamProvider.jsx";

const Home = () => {
    return (
        <div className={style.homeWrapper}>

            <WebcamProvider>
                <MainContent />
            </WebcamProvider>

        </div>
    );
};
export default Home;

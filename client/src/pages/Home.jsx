import "../styles/Home.css"
import Logo from "../assets/meal.png"
const Home = () => {
    return (
        <div className="home-page">
            <header className="header-section">
                <div className="left-section">
                    <img src={Logo} alt="logo.png" className="logo-image"/>
                    <h2 className="app-title">
                        PotluckHub
                    </h2>
                </div>

                <div className="right-section">
                    <button>
                        Log in
                    </button>

                    <button>
                        Sign up
                    </button>
                </div>
            </header>

            <div>

            </div>
        </div>
    )
}

export default Home
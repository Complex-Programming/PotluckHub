const Login = () => {
    const AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/github`;
    const handleLoginClick = () => {
        console.log('GitHub login clicked', { authUrl: AUTH_URL });
    };

    return (
        <div className='Login'>
            <h1>PotluckHub</h1>
            <center>
                <a href={AUTH_URL}>
                    <button className="headerBtn" onClick={handleLoginClick}>
                        🔒 Login via Github
                    </button>
                </a>
            </center>
        </div>
    );
};

export default Login;
import { Link } from "react-router-dom";

function HeaderApp() {
  return (
    <>
        <header id="header">
            <div className="header-box flex-row">
                <div>
                    <Link to="/homepage">Logo App</Link>
                </div>
                <div className="header-links">
                
                </div>
                <div className="header-nav-auth">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </header>    
    </>
  );
}


export default HeaderApp;
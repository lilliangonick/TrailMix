import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="logo-box">
        <h1 className="logo">trailmix</h1>
        <div className="mascot">🥹</div>
      </div>

      <div className="form">
        <label htmlFor="email">email</label>
        <input type="email" id="email" placeholder="Enter your email" />

        <label htmlFor="password">pwd</label>
        <input type="password" id="password" placeholder="Enter your password" />

        <div className="forgot-reset">
          <span>forgot password?</span>
          <span className="reset">reset</span>
        </div>

        <div className="signup-prompt">
          <span>new to trailmix?</span>
          <Link to="/signup" className="signup-link">sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

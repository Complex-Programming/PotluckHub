import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CircleHelp, User, Mail, Lock } from "lucide-react";
import "../styles/Register.css";

const securityQuestions = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What was the make of your first car?",
  "What is your favorite food?",
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.securityQuestion || !formData.securityAnswer) {
      alert("Please select a security question and provide an answer.");
      return;
    }

    // connect to database


    // navigate to events
    navigate("/events");
  };

  return (
    <div className="register-page">
      <h1 className="headline">Create account</h1>
      <p className="slogan">Join PotluckHub and start planning</p>
      <div className="register-form">
        <form className="register-form-body" onSubmit={handleSubmit}>
          <label className="register-label" htmlFor="name">
            Name
          </label>
          <div className="input-shell">
            <span className="input-icon" aria-hidden="true">
              <User size={18} strokeWidth={2} />
            </span>
            <input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <label className="register-label" htmlFor="email">
            Email
          </label>
          <div className="input-shell">
            <span className="input-icon" aria-hidden="true">
              <Mail size={18} strokeWidth={2} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <label className="register-label" htmlFor="password">
            Password
          </label>
          <div className="input-shell">
            <span className="input-icon" aria-hidden="true">
              <Lock size={18} strokeWidth={2} />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="........"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <label className="register-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="input-shell">
            <span className="input-icon" aria-hidden="true">
              <Lock size={18} strokeWidth={2} />
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="........"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="security-block">
            <div className="security-title-row">
              <span className="security-icon" aria-hidden="true">
                <CircleHelp size={18} strokeWidth={2} />
              </span>
              <label className="register-label" htmlFor="securityQuestion">
                Security Question
              </label>
            </div>

            <p className="security-help">
              This will help you recover your password if you forget it
            </p>

            <select
              id="securityQuestion"
              name="securityQuestion"
              value={formData.securityQuestion}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a question
              </option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>

            {formData.securityQuestion && (
              <input
                id="securityAnswer"
                name="securityAnswer"
                placeholder="Your answer"
                value={formData.securityAnswer}
                onChange={handleChange}
              />
            )}
          </div>

          <button className="primary-cta" type="submit">
            Create account
          </button>
        </form>

        <div className="signin-row">
          <p>Already have an account?</p>
          <Link to="/signin">
            <button type="button">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

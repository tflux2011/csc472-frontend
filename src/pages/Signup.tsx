import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api"; 
import Navbar from "../components/NavBar";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null);   
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false); 
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "cpassword") {
      setCPassword(value);
    }
  };

  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setError("You must accept the terms and conditions to proceed.");
      return; 
    }

    if (cpassword === password) {
      setLoading(true);  
      setError(null);     

      try {
        await signup(name, email, password); 
        navigate("/login"); 
      } catch (error) {
         
        if (typeof error === "string") {
          console.log(error); 
        } else if (error instanceof Error) {
          console.log(error.message); // 
          setError("Signup failed: " + error.message);
        }
      } finally {
        setLoading(false);  
      }
    } else {
      setError("Passwords do not match.");  
    }
  };

  return (
    <>
    <Navbar active="signup"/>
      <section className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="input-text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="input-text"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="input-password"
                    required
                    value={password}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input
                    type="password"
                    name="cpassword"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="input-password"
                    required
                    value={cpassword}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="input-check"
                      checked={acceptedTerms}
                      onChange={handleTermsChange}
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                      I accept the <a className="text-sr-link" href="#">Terms and Conditions</a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create an account"}
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {/* Login Link */}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
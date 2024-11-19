import { Link } from "react-router-dom";

const Footer = () => {
    return ( 
        
        <footer className="bg-white dark:bg-gray-900 mt-5">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="/wap.svg" className="h-8" alt="PolicyMakers Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PolicyMakers</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link to="/about" className="hover:underline me-4 md:me-6">About</Link>
                        </li>
                        <li>
                            <Link to="/policies" className="hover:underline me-4 md:me-6">Policies</Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:underline me-4 md:me-6">Log in</Link>
                        </li>
                        <li>
                            <Link to="/signup" className="hover:underline">Sign up</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 Made with ❤️ from <a href="https://www.linkedin.com/in/tobi-adeosun-283ba413b/" className="hover:underline">Tobi Lekan Adeosun</a>. All Rights Reserved.</span>
            </div>
        </footer>


        
     );
}
 
export default Footer;
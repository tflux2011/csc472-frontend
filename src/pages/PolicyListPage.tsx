import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import HorizontalPolicyList from "../components/policies/HorizontalPolicyList";

const PolicyListPage = () => {

  return (
    <div>
      <Navbar active="policies" />
      <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-8 mb-4">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">
            Policies
          </h2>
          <p className="font-light text-gray-700 sm:text-xl">
            Explore the most recent proposals and have your say by upvoting the ones that matter most.
          </p>
        </div>
        <HorizontalPolicyList />
      </div>
    </section>
    
      <Footer />
    </div>
  );
};

export default PolicyListPage;
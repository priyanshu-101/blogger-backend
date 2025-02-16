import Header from "./Header";
import Footer from "./Footer";
import BlogSection from "../home/section";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto p-6">
                <BlogSection />
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;

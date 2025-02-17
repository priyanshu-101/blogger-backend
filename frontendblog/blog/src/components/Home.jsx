import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import BlogSection from "../home/section";
import Suggestion from "../home/suggestion";
import Recommendation from "../home/recommendation";
// import Breadcrumbs from "./BreadCrumbs";

const Home = () => {
    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col">
            <Header />

            {/* <Breadcrumbs /> */}

            <main className="flex-grow container mx-auto p-4 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <BlogSection />
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                    <Recommendation />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <Suggestion />
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;

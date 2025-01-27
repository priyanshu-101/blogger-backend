import Header from "./Header";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <div>
                <h1 className="text-3xl font-bold text-center mt-10">Home</h1>
            </div>
        </div>
    );
}
export default Home;
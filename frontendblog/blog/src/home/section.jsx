

const BlogSection = () => {
  return (
    <div>
      <div className="relative w-full h-[200px] overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1305038827/photo/a-beautiful-valley-with-a-river-blue-sky-with-large-clouds-and-bright-sun-aerial.jpg?s=612x612&w=0&k=20&c=2_Y-xkCmXqpfT1-LZokPtKmZQDa9MPr_Hcxaj07Uxfc=')] bg-cover bg-center" />
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
          <h1 className="text-6xl font-bold text-white">
            Read Our Blog
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          WEEKLY ARTICLES WITH INSIGHT INTO THE WEEKEND'S MESSAGE
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl">
          Our blog takes the message from the weekend and lays out next right steps, so you can hear a message and do a message in practical ways.
        </p>
      </div>
    </div>
  );
};

export default BlogSection;
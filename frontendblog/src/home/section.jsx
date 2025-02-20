import React from 'react';
import { ArrowRight, Book } from 'lucide-react';

const BlogSection = () => {
  return (
    <div className="space-y-12">
      <div className="relative w-full h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-gray-900/70 z-10 
          animate-gradient-shift" />
        <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1305038827/photo/a-beautiful-valley-with-a-river-blue-sky-with-large-clouds-and-bright-sun-aerial.jpg?s=612x612&w=0&k=20&c=2_Y-xkCmXqpfT1-LZokPtKmZQDa9MPr_Hcxaj07Uxfc=')] 
          bg-cover bg-center transform scale-105 animate-subtle-zoom rounded-xl" />
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/80">
              <Book className="w-6 h-6" />
              <span className="uppercase tracking-wider text-sm font-medium">Our Blog</span>
            </div>
            
            <h1 className="text-7xl font-bold text-white leading-tight animate-fade-in">
              Read Our Blog
            </h1>
            
            <div className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer group">
              <span>Explore Stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500" />
          
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight pl-6">
              WEEKLY ARTICLES WITH INSIGHT INTO THE WEEKENDS MESSAGE
            </h2>
            
            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-sm">
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                Our blog takes the message from the weekend and lays out next right steps, 
                so you can hear a message and do a message in practical ways.
              </p>
              
              <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 
                transition-all duration-300 flex items-center gap-2 group">
                Start Reading
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
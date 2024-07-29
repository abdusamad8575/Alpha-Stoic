// components/Bonuses.tsx
import React from 'react';

interface Course {
  image: string;
  title: string;
  description: string;
  value: number;
}

const Bonuses: React.FC = () => {
  const courses: Course[] = [
    {
      image: 'https://backend.alphastoic.in/uploads/1720876099987-for%20web.jpg',
      title: 'Proven Framework to Identify Hidden Market Leaders',
      description: 'Proven strategy, Research, and analysis of 15 companies projected to outperform over the next decade.',
      value: 5000,
    },
    {
      image: 'https://backend.alphastoic.in/uploads/1720876099987-for%20web.jpg',
      title: 'Alpha stoics 40 Stock Picks for the Coming Decade',
      description: 'A curated list of 40 stocks expected to perform well over the next ten years.',
      value: 4500,
    },
    {
      image: 'https://backend.alphastoic.in/uploads/1720876099987-for%20web.jpg',
      title: 'Understanding the Stock Market: Introduction to Technical and Fundamental Analysis',
      description: 'An eBook offering an introduction to technical and fundamental analysis in the stock market.',
      value: 3000,
    },
    {
      image: 'https://backend.alphastoic.in/uploads/1720876099987-for%20web.jpg',
      title: 'Risk Management Tools',
      description: 'An overview of tools and strategies to manage investment risks effectively.',
      value: 2400,
    },
  ];

  const totalValue = courses.reduce((sum, course) => sum + course.value, 0);

  return (
    <section className="py-10 bg-gray-100 text-center p-5">
      <h1 className="text-3xl font-bold mb-6">
        Get Access to BONUSES Worth ₹{totalValue}/- FREE
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-[#3EB449] mb-2">
                {course.title}
              </h2>
              <p className="text-gray-700 mb-2">
                {course.description}
              </p>
              <p className="text-xl font-bold text-black">
                ₹ {course.value}/-
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
      </div>
    </section>
  );
};

export default Bonuses;
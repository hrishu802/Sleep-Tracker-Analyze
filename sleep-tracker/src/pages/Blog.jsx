import React from 'react';

const blogPosts = [
  {
    title: 'The Science of Sleep: Why It Matters',
    date: '2024-06-01',
    excerpt: 'Discover the importance of sleep for your health and well-being, and how it impacts your daily life.',
    content: 'Sleep is essential for physical and mental health. It helps the body repair, supports brain function, and improves mood. Chronic sleep deprivation can lead to serious health issues...'
  },
  {
    title: '5 Tips for Better Sleep Tonight',
    date: '2024-05-20',
    excerpt: 'Struggling to fall asleep? Try these five proven tips to improve your sleep quality starting tonight.',
    content: '1. Stick to a schedule. 2. Create a restful environment. 3. Limit screen time before bed. 4. Watch your diet. 5. Get regular exercise...'
  },
  {
    title: 'Understanding Sleep Cycles',
    date: '2024-05-10',
    excerpt: 'Learn about the different stages of sleep and why each one is important for your health.',
    content: 'Sleep cycles include REM and non-REM stages. Each stage plays a unique role in physical restoration and memory consolidation...'
  }
];

const Blog = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Blog</h1>
      <p className="text-lg text-gray-300 mb-10 text-center">Insights, tips, and the latest research on sleep health.</p>
      <div className="space-y-8">
        {blogPosts.map((post, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-white">{post.title}</h2>
            <p className="text-sm text-gray-400 mb-2">{post.date}</p>
            <p className="text-gray-200 mb-4">{post.excerpt}</p>
            <button className="text-indigo-400 hover:underline">Read more</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog; 
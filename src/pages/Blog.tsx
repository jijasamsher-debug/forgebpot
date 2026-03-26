import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PublicNav } from '../components/PublicNav';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: Date;
  categories: string[];
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const q = query(
        collection(db, 'blogPosts'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        slug: doc.data().slug,
        excerpt: doc.data().excerpt,
        featuredImage: doc.data().featuredImageUrl,
        author: doc.data().author,
        publishedAt: doc.data().publishedAt?.toDate(),
        categories: doc.data().categories || []
      } as BlogPost));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = ['all', ...new Set(posts.flatMap(p => p.categories))];
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Insights, tips, and updates about chatbots, customer engagement, and growing your business
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No posts found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.featuredImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.publishedAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author.name}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

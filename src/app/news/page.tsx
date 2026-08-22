import Link from 'next/link';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Newspaper, Calendar, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db/prisma';

export default async function NewsPage() {
  const news = await prisma.businessNews.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      business: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { publishDate: 'desc' },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#0a897d] to-[#0d6e6a] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News Updates</h1>
            <p className="text-xl text-white/90">
              Latest news and updates from local businesses
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {news.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No News Yet</h2>
              <p className="text-gray-500">
                Check back later for the latest business news and updates.
              </p>
              <Link href="/businesses">
                <Button className="mt-6 bg-[#0a897d] hover:bg-[#0d6e6a]">
                  Browse Businesses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {article.featuredImage && (
                      <div className="aspect-video bg-gray-100">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {article.publishDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(article.publishDate).toLocaleDateString()}
                          </span>
                        )}
                        {article.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {article.views} views
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {article.summary || article.content?.slice(0, 150)}...
                      </p>
                      {article.business && (
                        <p className="text-sm text-[#0a897d] font-medium">
                          {article.business.name}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

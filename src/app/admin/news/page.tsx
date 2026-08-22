import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Newspaper, Eye, Calendar } from 'lucide-react';

export default async function AdminNewsPage() {
  const news = await prisma.businessNews.findMany({
    include: {
      business: true,
    },
    orderBy: { publishDate: 'desc' },
    take: 50,
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">News</h1>
        <p className="text-muted-foreground">{news.length} total articles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All News Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No news articles yet</p>
            ) : (
              news.map((article) => (
                <div key={article.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            article.status === 'PUBLISHED'
                              ? 'default'
                              : article.status === 'DRAFT'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {article.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {article.business.name}
                        </span>
                      </div>
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.summary || article.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.publishDate
                            ? new Date(article.publishDate).toLocaleDateString()
                            : 'Not published'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

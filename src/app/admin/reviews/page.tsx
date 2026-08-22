import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Check, X, Flag } from 'lucide-react';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      business: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
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
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">{reviews.length} total reviews</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={review.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {review.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {review.user.name || review.user.email}
                      </span>
                    </div>
                    <p className="font-medium">{review.title}</p>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Business: {review.business.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

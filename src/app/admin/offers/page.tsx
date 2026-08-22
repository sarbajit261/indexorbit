import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tag, Percent, Clock } from 'lucide-react';

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    include: {
      business: true,
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
        <h1 className="text-3xl font-bold">Offers</h1>
        <p className="text-muted-foreground">{offers.length} total offers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          offer.status === 'PUBLISHED'
                            ? 'default'
                            : offer.status === 'EXPIRED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {offer.status}
                      </Badge>
                      {offer.discount && (
                        <span className="text-sm font-medium text-green-600">
                          {offer.discount}% OFF
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{offer.title}</p>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Business: {offer.business.name}
                    </p>
                    {offer.endDate && (
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(offer.endDate).toLocaleDateString()}
                      </p>
                    )}
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

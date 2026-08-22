import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, MapPin, Star, Eye, Edit, Trash2 } from 'lucide-react';

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    where: { deletedAt: null },
    include: {
      businessType: true,
      primaryLocation: true,
      _count: {
        select: {
          reviews: true,
          offers: true,
        },
      },
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
        <h1 className="text-3xl font-bold">Businesses</h1>
        <p className="text-muted-foreground">{businesses.length} total businesses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Business</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Reviews</th>
                  <th className="text-left py-3 px-4">Offers</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{business.name}</div>
                      <div className="text-sm text-muted-foreground">{business.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">
                        {business.businessType?.name || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {business.primaryLocation?.name || business.city || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {business._count.reviews}
                    </td>
                    <td className="py-3 px-4">
                      {business._count.offers}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {business.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/businesses/${business.slug}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

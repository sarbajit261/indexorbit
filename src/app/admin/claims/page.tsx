import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock, Flag } from 'lucide-react';

export default async function AdminClaimsPage() {
  const claims = await prisma.businessClaim.findMany({
    include: {
      business: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
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
        <h1 className="text-3xl font-bold">Business Claims</h1>
        <p className="text-muted-foreground">{claims.length} total claims</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ownership Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No claims yet</p>
            ) : (
              claims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            claim.status === 'APPROVED'
                              ? 'default'
                              : claim.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="font-medium">{claim.business.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Claimed by: {claim.user.name || claim.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
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

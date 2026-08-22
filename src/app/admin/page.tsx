import { auth } from '@/lib/auth/config';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import {
  Building2,
  Users,
  Star,
  Flag,
  Tag,
  Newspaper,
  Send,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getStats() {
  const [
    totalBusinesses,
    totalUsers,
    totalReviews,
    pendingClaims,
    activeOffers,
    publishedNews,
    pendingSubmissions,
    recentBusinesses,
    recentReviews,
  ] = await Promise.all([
    prisma.business.count({ where: { deletedAt: null } }),
    prisma.user.count(),
    prisma.review.count({ where: { status: 'APPROVED' } }),
    prisma.claim.count({ where: { status: 'PENDING' } }),
    prisma.offer.count({ where: { status: 'PUBLISHED', endDate: { gte: new Date() } } }),
    prisma.businessNews.count({ where: { status: 'PUBLISHED' } }),
    prisma.businessSubmission.count({ where: { status: 'PENDING' } }),
    prisma.business.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, slug: true, createdAt: true, rating: true },
    }),
    prisma.review.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        business: { select: { name: true, slug: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalBusinesses,
    totalUsers,
    totalReviews,
    pendingClaims,
    activeOffers,
    publishedNews,
    pendingSubmissions,
    recentBusinesses,
    recentReviews,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getStats();

  const statCards = [
    {
      title: 'Total Businesses',
      value: stats.totalBusinesses,
      icon: Building2,
      href: '/admin/businesses',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      href: '/admin/users',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Reviews',
      value: stats.totalReviews,
      icon: Star,
      href: '/admin/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: Flag,
      href: '/admin/claims',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Active Offers',
      value: stats.activeOffers,
      icon: Tag,
      href: '/admin/offers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'News Articles',
      value: stats.publishedNews,
      icon: Newspaper,
      href: '/admin/news',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || 'Admin'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending Actions */}
      {(stats.pendingSubmissions > 0 || stats.pendingClaims > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingSubmissions > 0 && (
              <Link
                href="/admin/submissions"
                className="flex items-center justify-between rounded-lg bg-white p-3 hover:bg-orange-100 transition-colors"
              >
                <span>{stats.pendingSubmissions} new business submissions</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
            {stats.pendingClaims > 0 && (
              <Link
                href="/admin/claims"
                className="flex items-center justify-between rounded-lg bg-white p-3 hover:bg-orange-100 transition-colors"
              >
                <span>{stats.pendingClaims} pending claim requests</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Assistant Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get help with managing your directory. Ask questions like:
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <Link
              href="/admin/ai?q=businesses%20missing%20phone%20numbers"
              className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors text-sm"
            >
              &quot;Show businesses missing phone numbers&quot;
            </Link>
            <Link
              href="/admin/ai?q=find%20duplicate%20businesses"
              className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors text-sm"
            >
              &quot;Find duplicate businesses&quot;
            </Link>
            <Link
              href="/admin/ai?q=expired%20offers"
              className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors text-sm"
            >
              &quot;Show expired offers&quot;
            </Link>
            <Link
              href="/admin/ai?q=weekly%20report"
              className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors text-sm"
            >
              &quot;Generate a weekly report&quot;
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Businesses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBusinesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/businesses/${business.slug}`}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(business.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {business.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {business.rating.toFixed(1)}
                    </div>
                  )}
                </Link>
              ))}
              {stats.recentBusinesses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No businesses yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/businesses/${review.business.slug}`}
                  className="block rounded-lg p-2 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.business.name}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {review.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {review.user?.name ?? 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
              {stats.recentReviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

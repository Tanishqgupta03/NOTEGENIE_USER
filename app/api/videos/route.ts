import { NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');
    
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('meetNotes');

    let dateFilter = {};
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    switch (period) {
      case 'today':
        dateFilter = {
          uploadDate: { $gte: startOfToday }
        };
        break;
      case 'yesterday':
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        dateFilter = {
          uploadDate: {
            $gte: startOfYesterday,
            $lt: startOfToday
          }
        };
        break;
      case 'week':
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        dateFilter = {
          uploadDate: { $gte: startOfWeek }
        };
        break;
      default:
        dateFilter = {};
    }

    const videos = await db.collection('videos')
      .find(dateFilter)
      .sort({ uploadDate: -1 })
      .toArray();

    return NextResponse.json(videos);

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
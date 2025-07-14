export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import ProductFeedback from '@/app/models/ProductFeedback';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';

// Helper to get user identity from session
async function getUserInfo(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user) return null;
  return {
    id: (session.user as any).id,
    name: session.user.name || session.user.email,
    image: session.user.image || null,
  };
}

// GET feedback for a product
export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  await dbConnect();
  const productId = params.productId;
  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }
  const feedback = await ProductFeedback.findOne({ productId });
  return NextResponse.json(feedback || {
    productId,
    likes: 0,
    dislikes: 0,
    comments: [],
    votes: [],
  });
}

// POST a comment or vote
export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  await dbConnect();
  const productId = params.productId;
  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }
  const body = await request.json();
  const user = await getUserInfo(request as NextRequest);
  if (!user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }
  if (body.type === 'comment') {
    const { text } = body;
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Comment text required' }, { status: 400 });
    }
    const feedback = await ProductFeedback.findOneAndUpdate(
      { productId },
      { $push: { comments: { user: user.id, name: user.name, image: user.image, text, date: new Date() } } },
      { upsert: true, new: true }
    );
    return NextResponse.json(feedback);
  }
  // Like/Dislike vote
  if (body.type === 'vote') {
    const { vote } = body; // 'like' or 'dislike'
    if (!['like', 'dislike'].includes(vote)) {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 });
    }
    // Only allow one vote per user
    const feedback = await ProductFeedback.findOne({ productId });
    let update = {};
    if (!feedback) {
      update = {
        $set: { productId },
        $push: { votes: { user: user.id, name: user.name, image: user.image, vote } },
        $inc: { [vote + 's']: 1 },
      };
    } else {
      const existing = feedback.votes.find((v: any) => v.user === user.id);
      if (existing) {
        if (existing.vote === vote) {
          // Already voted this way
          return NextResponse.json(feedback);
        } else {
          // Change vote
          update = {
            $set: { 'votes.$[elem].vote': vote },
            $inc: { [vote + 's']: 1, [existing.vote + 's']: -1 },
          };
        }
      } else {
        update = {
          $push: { votes: { user: user.id, name: user.name, image: user.image, vote } },
          $inc: { [vote + 's']: 1 },
        };
      }
    }
    const updated = await ProductFeedback.findOneAndUpdate(
      { productId },
      update,
      { upsert: true, new: true }
    );
    return NextResponse.json(updated);
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
} 
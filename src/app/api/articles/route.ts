// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/firebase/firebaseServices";
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

// GET - Fetch all articles
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'articles'));
    const articles = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log('Fetched articles:', articles.length);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const q = query(
      collection(db, 'articles'), 
      where('slug', '==', body.slug)
    );
    const existingDocs = await getDocs(q);
    
    if (!existingDocs.empty) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the article document
    const articleData = {
      title: body.title,
      subtitle: body.subtitle || '',
      image_url: body.image_url || '',
      slug: body.slug,
      content: body.content,
      description: body.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'articles'), articleData);

    console.log('Article created with ID:', docRef.id);

    return NextResponse.json(
      { 
        id: docRef.id, 
        ...articleData,
        message: 'Article created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
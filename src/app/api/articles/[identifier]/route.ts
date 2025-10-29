// app/api/articles/[identifier]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/firebase/firebaseServices";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

interface Props {
  params: Promise<{
    identifier: string;
  }>;
}

// Helper function to check if identifier is a Firestore document ID
// Firestore IDs are typically 20 characters of alphanumeric
function isFirestoreId(str: string): boolean {
  return /^[a-zA-Z0-9]{20,}$/.test(str);
}

// GET - Fetch article by slug OR by ID
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { identifier } = await params;
    
    // Check if it's a Firestore ID or a slug
    if (isFirestoreId(identifier)) {
      // Fetch by document ID
      const docRef = doc(db, 'articles', identifier);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      console.log('Fetched article by ID:', identifier);
      return NextResponse.json({
        id: docSnap.id,
        ...docSnap.data()
      });
    } else {
      // Fetch by slug
      const q = query(
        collection(db, "articles"), 
        where("slug", "==", identifier)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('Article not found with slug:', identifier);
        return NextResponse.json(
          { message: "Article not found" }, 
          { status: 404 }
        );
      }

      const article = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[0];

      console.log('Fetched article by slug:', identifier);
      return NextResponse.json(article);
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update article (only works with document ID)
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { identifier } = await params;

    // PUT operations require document ID
    if (!isFirestoreId(identifier)) {
      return NextResponse.json(
        { error: 'Update requires document ID, not slug' },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'articles', identifier);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    const currentData = docSnap.data();
    if (body.slug !== currentData.slug) {
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
    }

    const updateData = {
      title: body.title,
      subtitle: body.subtitle || '',
      image_url: body.image_url || '',
      slug: body.slug,
      content: body.content,
      description: body.description || '',
      updated_at: new Date().toISOString()
    };

    await updateDoc(docRef, updateData);

    console.log('Article updated:', identifier);

    return NextResponse.json({
      id: identifier,
      ...updateData,
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete article (only works with document ID)
// ✅ Correct version
export async function DELETE(req: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const { identifier } = params;

    if (!isFirestoreId(identifier)) {
      return NextResponse.json(
        { error: 'Delete requires document ID, not slug' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'articles', identifier);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await deleteDoc(docRef);
    console.log('Article deleted:', identifier);

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { title, genre, duration, notes, user } = await request.json();
    if (!title || !genre || !duration || !user) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("data");

    const newMovie = {
      title,
      genre,
      duration,
      notes,
      createdBy: user,
      createdAt: new Date(),
    };

    await collection.insertOne(newMovie);

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");

    if (!user) {
      return NextResponse.json({ error: "User query parameter is required" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("data");

    const movies = await collection.find({ createdBy: user }).toArray();

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { title, genre, duration, notes, user } = await request.json();
    if (!title || !genre || !duration || !user) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("data");

    const updatedMovie = {
      title,
      genre,
      duration,
      notes,
      createdBy: user,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { 
        _id: ObjectId.createFromHexString(movieId), 
        createdBy: user 
      },
      { $set: updatedMovie }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Movie not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('hex string')) {
      return NextResponse.json(
        { error: "Invalid movie ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { user } = await request.json(); // Get user from the request body
    if (!user) {
      return NextResponse.json(
        { error: "User is required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("data");

    const result = await collection.deleteOne({
      _id: ObjectId.createFromHexString(movieId),
      createdBy: user,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Movie not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Movie deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
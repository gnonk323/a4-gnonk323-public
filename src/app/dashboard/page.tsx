"use client"

import Button from "@/components/Button";
import { TextInput, TextArea } from "@/components/TextInput";
import Data from "@/components/Data";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Movie {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  notes: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();  // Initialize the router for redirection

  const [movieId, setMovieId] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to root if the user is not authenticated
  useEffect(() => {
    if (status === "loading") return;  // Prevent redirect if session is loading
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to the root (sign-in page)
    }
  }, [status, router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEditing) {
      const postData = async () => {
        try {
          const response = await fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              genre,
              duration,
              notes,
              user: session?.user?.name,
            }),
          });
    
          if (!response.ok) throw new Error("Failed to add movie");
          const newMovie = await response.json();
          setMovies([...movies, newMovie]);
          setTitle(""); setGenre(""); setDuration(""); setNotes("");
    
          console.log("Movie added successfully");
        } catch (error) {
          console.error(error);
        }
      };
      postData();
    } else {
      const updateData = async () => {
        try {
          const response = await fetch(`/api/data?id=${movieId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              genre,
              duration,
              notes,
              user: session?.user?.name,
            }),
          });
  
          if (!response.ok) throw new Error("Failed to update movie");
          const updatedMovie = await response.json();
          setMovies(movies.map(movie => movie._id === movieId ? updatedMovie : movie));
          setTitle(""); setGenre(""); setDuration(""); setNotes(""); setIsEditing(false);
  
          console.log("Movie updated successfully");
        } catch (error) {
          console.error(error);
        }
      };
      updateData();
    }
  };

  const handleDelete = async (movieId: string) => {
    const response = await fetch(`/api/data?id=${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session?.user?.name,
      }),
    });
  
    if (response.ok) {
      setMovies(movies.filter(movie => movie._id !== movieId));
      console.log("Movie deleted successfully");
    } else {
      console.error("Failed to delete movie");
    }
  };

  const handleEdit = (movie: Movie) => {
    setMovieId(movie._id);
    setTitle(movie.title);
    setGenre(movie.genre);
    setDuration(movie.duration);
    setNotes(movie.notes);
    setIsEditing(true);
  }

  const handleStopEditing = () => {
    setMovieId("");
    setTitle("");
    setGenre("");
    setDuration("");
    setNotes("");
    setIsEditing(false);
  }

  return (
    <div className="w-1/2 mx-auto py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-bold">My Movie Watchlist</h1>
          <p className="text-sm">Signed in as {session?.user?.name}</p>
        </div>
        <Button variant="danger" onClick={() => signOut()}>Sign Out</Button>
      </div>
      <div className="bg-white rounded shadow-md flex flex-col p-6 mb-12">
        {!isEditing ? (
          <h2 className="text-lg font-semibold mb-4">Add Movie</h2>
        ) : (
          <div className="flex justify-between mb-4 items-center">
            <h2 className="text-lg font-semibold">Edit Movie</h2>
            <button onClick={handleStopEditing} className="text-red-500 px-3 py-1 rounded hover:bg-neutral-100 transition-colors">Stop Editing</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <TextInput
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextInput
            placeholder="Genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <TextInput
            placeholder="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <TextArea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button className="w-full mt-3" type="submit">
            {!isEditing ? "Add Movie" : "Update Movie"}
          </Button>
        </form>        
      </div>
      <div className="bg-white rounded shadow-md p-6">
        <Data handleEdit={handleEdit} handleDelete={handleDelete} movies={movies} setMovies={setMovies} />
      </div>
    </div>
  );
}
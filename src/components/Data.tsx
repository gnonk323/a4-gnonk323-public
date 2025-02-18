"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface Movie {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  notes: string;
  createdAt: string;
}

export default function Data({ handleEdit, handleDelete, movies, setMovies }: { handleEdit: (movie: Movie) => void, handleDelete: (movieId: string) => void, movies: Movie[], setMovies: (movies: Movie[]) => void }) {

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data?user=${session?.user?.name}`);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (session?.user?.name) {
      fetchData();
    }
  }, [session, setMovies]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Movies</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Genre</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Notes</th>
            <th className="py-2">Created At</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{movie.title}</td>
              <td className="border px-4 py-2">{movie.genre}</td>
              <td className="border px-4 py-2">{Math.floor(Number(movie.duration) / 60)}h {Number(movie.duration) % 60}m</td>
              <td className="border px-4 py-2">{movie.notes}</td>
              <td className="border px-4 py-2">{new Date(movie.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2 text-center">
                <button 
                  className="text-blue-500 px-2 py-1 rounded hover:bg-neutral-100 transition-colors mr-2"
                  onClick={() => handleEdit(movie)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-500 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
                  onClick={() => handleDelete(movie._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
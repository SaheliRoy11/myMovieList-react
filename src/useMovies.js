import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]); //store list of movies fetched from api
  const [isLoading, setIsLoading] = useState(false); //loading indicator while fetching data from api
  const [error, setError] = useState(""); //indicating if there is an error currently

  useEffect(
    function () {
      const controller = new AbortController(); //browser API

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //reset error if incase it is holding value from previous render

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${query}`,
            {
              //connect the AbortController with the fetch function
              signal: controller.signal,
            }
          );

          //error in fetching data
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          //no movie found
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //if a movie details is already opened then close it before searching new movies
      //handleCloseMovie();
      fetchMovies();

      //clean up data fetching
      return function () {
        controller.abort();
      };
    },
    [query] //synchronize with query state
  );

  return {movies, isLoading, error};
}

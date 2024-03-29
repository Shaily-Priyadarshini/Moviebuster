import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];



const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key="e0a114ba";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [isLoading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [query, setQuery] = useState("");
  const [selecteMoviedId, setSelectedMovieId]=useState(null);
  const [watched, setWatched]= useState([]);

   // const [watched, setWatched]= useState(function(){
  //   const storeValue=localStorage.getItem('watched');
  //   return JSON.parse(storeValue);
  // });
  
  function handleSelectMovie(id){
    setSelectedMovieId((selecteMoviedId)=>id === selecteMoviedId?null:id);
  }

  function handleCloseMovie(){
    setSelectedMovieId(null);
  }

  function handleAddWatchMovieList(movie){
    setWatched((watched)=>[...watched,movie]);
    
  }

  function handleDeletedWatched(id){
    setWatched((watched)=>watched.filter((movie)=>movie.imdbID!==id));
  }

  // useEffect(
  //   function(){
  //   localStorage.setItem("watched",JSON.stringify(watched));
  // },
  // [watched]);


  useEffect(function(){
    const controller=new AbortController();
    async function fetchMovies(){
      try
      {setLoading(true);
      setError('');
      const response= await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
      {signal : controller.signal});


      
      if (!response.ok) throw new Error ("Something went wrong with fetching movies");
      const data = await response.json();
      if (data.Response==='False') throw new Error ("Movie not found");

      setMovies(data.Search); 
      }
      catch(err){
        if (err.name!== "AbortError")
        setError(err.message);
      }
      finally{
        setLoading(false);
      }

    }
    if (query.length<3){
      setMovies([]);
      setError('');
      return
    }

    handleCloseMovie();
    fetchMovies();
//     fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=jab+we+met`)
// .then((response)=>response.json())
// .then((data)=>setMovies((movies)=>data.Search));
},[query]);
  return (
    <>
    <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
    </Navbar>
    <Main>
      <Box>
      {isLoading && <Loader />}
      {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
      {error && <ErrorMessage message={error} />}
      </Box>
      <Box>{selecteMoviedId?<MovieDetails 
      watched={watched} 
      onAddToWatchList={handleAddWatchMovieList} 
      onCloseMovie={handleCloseMovie} 
      selecteMoviedId={selecteMoviedId}
      />:<WatchedBox watched={watched} onDeletedwatched={handleDeletedWatched}/>}</Box>
      
    </Main>
    </>
  );
}

function Navbar({children}) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍕</span>
      <h1>movieBuster</h1>
    </div>
  );
}
function Search({query,setQuery}) {
  const inputEl= useRef(null)
  
  useEffect(function(){
    function callback(e){
      if (document.activeElement===inputEl.current) return
      if (e.code === 'Enter'){
        inputEl.current.focus(); 
        setQuery("");
      }

    }
    document.addEventListener('keydown',callback);


    //focus method- used to focus the element automatically
    return ()=>document.addEventListener('keydown',callback);


  },[setQuery])
  
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumResults({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
// function Main({movies,isLoading,error}) {
//   return (
//     <main className="main">
//       {isLoading && <Loader />}
//       {!isLoading && !error && <MovieList movies={movies}/>}
//       {error && <ErrorMessage message={error} />}
//       <WatchList />
//     </main>
//   );
// }
function Loader(){
  return <p className="loader">Loading...</p>
}

function ErrorMessage({message}){
  return <p className="error"><span>⛔ {message}</span></p>
}

function Main({ children }) {
  return <main className="main">
    {children}
    </main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}




// function ListBox() {
 
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       > 
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && (
//         <MovieList/>
//       )}
//     </div>
//   );
// }
function MovieList({movies, onSelectMovie}){
  
  return <ul className="list list-movies">
  {movies?.map((movie) => (<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />)
    
  )}
</ul>
  
}
function Movie({movie, onSelectMovie}){
  return <li onClick={()=>onSelectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
</li>
}

function MovieDetails({selecteMoviedId,onCloseMovie, onAddToWatchList,watched}){
  const [movie,setMovie]=useState({});
  const [isLoading,setIsLoading]=useState(false);
  const [userRating, setUserRating]=useState('');
  const countRating = useRef (0);

  useEffect(function(){
    if(userRating){
      countRating.current++;
    }
  },[userRating])
  const isWatched=watched.map((movie)=>movie.imdbID).includes(selecteMoviedId);
  const watchedUserRating=watched.find((movie)=>movie.imdbID===selecteMoviedId)?.userRating;
  const{
    Title:title,
    Year:year,
    Poster:poster,
    Runtime:runtime,
    imdbRating,
    Plot:plot,
    Released:released,
    Actors:actors,
    Director:director,
    Genre:genre,

  }=movie;

  function handleAdd(movieData){
    const newWatchedMovie={
      imdbID:selecteMoviedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRating

    }

    onAddToWatchList(newWatchedMovie);
    onCloseMovie();
  }
  useEffect(function(){
    function callback(e){
      if (e.code ==="Escape"){
        onCloseMovie();
      }}
    document.addEventListener("keydown",callback);
      return function(){
        document.removeEventListener('keydown',callback)
      }
    
  },[onCloseMovie])

  useEffect(function(){
    async function getMovieDetails(){
      setIsLoading(true);
      const response= await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${selecteMoviedId}`)
      const data = await response.json();

      setMovie(data);
      setIsLoading(false);

    }
    getMovieDetails();

  },[selecteMoviedId]);
useEffect(function(){
  if (!title) return; 
  document.title=`Movie | ${title}`

  return function(){
    document.title="MovieBuster";
  }
},[title])

  return <div className="details">  
  { isLoading?<Loader/>:
  <>
    <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img className="details img" src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
            { !isWatched ?(
            <>
            <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
            
            {userRating>0 && <button className="btn-add" onClick={handleAdd}>+ Add to List</button>
            }
            </>
             ): (
              <p>You have rated this movie {watchedUserRating}🌟</p>
            )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}
            </p>
          </section>
          </>
}
  </div>
}
// fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=jab+we+met`)
// .then((response)=>response.json())
// .then((data)=>setMovies((movies)=>data.Search));
function WatchedBox({watched, onDeletedwatched}) {

  const [isOpen2, setIsOpen2] = useState(true);


  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
        <WatchedSummary watched={watched}/>
        <WatchedMovieList watched={watched} onDeletedwatched={onDeletedwatched}/>
          

          
        </>
      )}
    </div>
  );
}


function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
  <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{avgImdbRating.toFixed(2)}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating.toFixed(2)}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{avgRuntime} min</span>
              </p>
            </div>
          </div>);
}
function WatchedMovieList({watched,onDeletedwatched}){
  return (
    <ul className="list">
            {watched.map((movie) => (
              <li key={movie.imdbID}>
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
                <div>
                  <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                  </p>
                  <button className="btn-delete" onClick={()=>onDeletedwatched(movie.imdbID)}>X</button>
                </div>
              </li>
            ))}
          </ul>
  )

}
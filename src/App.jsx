import React from "react";
import {useEffect ,useState} from "react";
import Search from "./assets/component/Search.jsx";
import Snipper from "./assets/component/Spinner.jsx";
import MovieCard from "./assets/component/MovieCard.jsx";
import {useDebounce} from "react-use";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS ={
    method : 'GET',
    headers : {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const [debouncedSearchTerm ,setDebouncedSearchTerm]=useState('');

    const [movieList, setMovieList]=useState([]);
    const [errorMessage,setErrorMessage]=useState('');
    const [isLoading ,setisLoading]=useState(false);

    const [trendingMovies,setTrendingMovies]=useState([]);


    //prevent API server from overloading,Since traditionally every time we type a letter in search bar it sends the fetch request.
    useDebounce(()=>setDebouncedSearchTerm(searchTerm),500,[searchTerm]);


    const fetchMovie = async(query = '')=>{
        setisLoading(true);
        setErrorMessage('');

        try{
            const endpoint =
                query ?
                `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
                `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint,API_OPTIONS);

            if(!response.ok){
                throw new Error("Could not find movie.");
            }

            const data = await response.json();

            console.log(data);

            if(data.response === false){
                setErrorMessage((data.Error || "Could not fetch movies."));
                setMovieList([])
                return;
            }

            setMovieList(data.results || []);

            if(debouncedSearchTerm && data.results.length > 0){
                updateSearchCount(debouncedSearchTerm,data.results[0]);
            }
        }
        catch (error) {
            console.error(`Error fetching movie ${error}`);
            setErrorMessage('Error fetching movie details. try again later !');

        }finally {
            setisLoading(false);
        }
    }

    const updateSearchCount = async (searchTerm,movie) => {
        try{
            await fetch("http://localhost:5000/api/metrics",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    searchTerm : searchTerm,
                    movie_id:movie.id,
                    poster_path: movie.poster_path,
                }),
            });
        }
        catch(error){
            console.log("Error updating search count",error);
        }
    };

    const fetchTrendingMovies = async() => {
        try{
            const response = await fetch("http://localhost:5000/api/trending");
            if (!response.ok) {
                throw new Error("Failed to fetch trending movies");
            }
            const data = await response.json();
            setTrendingMovies(data);
            console.log(data);
        }catch (error) {
            console.log("Error fetching trending movies",error);
        }
    }

    useEffect(()=>{
        fetchMovie(debouncedSearchTerm);
    },[debouncedSearchTerm]);

    useEffect(()=>{
        fetchTrendingMovies();
    },[]);




    return (
        <main>
            <div className="pattern">
            <div className="wrapper">

                <header className="header">
                    <img src="./hero.png" alt="Hero" />
                    <h1>find <span className="text-gradient">Movies</span> you'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index) => (
                                <li key={index}>
                                    <p>{index + 1}</p>
                                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_url}`} alt={movie.searchTerm}/>
                                </li>
                                ))}
                        </ul>

                    </section>
                )}

                <section >
                    <h2>All Movies</h2>

                    {isLoading ? <Snipper/>
                        : errorMessage ? (<p className="text-red-500">{errorMessage}</p>)
                            : (<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {movieList.map((movie) =>(
                                    <MovieCard key={movie.id} movie={movie}/>
                                 ))}
                             </ul>)
                    }
                </section>




            </div>
            </div>
        </main>

    )
}

export default App;
import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import ActorForm from "./ActorForm";
import MovieEditForm from "./MovieEditForm";
import ActorEditForm from "./ActorEditForm";
import MoviesList from "./MoviesList";
import ActorList from "./ActorList";
import CastView from "./Cast";
import CastEdit from "./CastEdit";

function App() {
    const [movies, setMovies] = useState([]); // aktualna lista wszystkich filmow
    const [actors, setActors] = useState([]); // aktualna lista wszystkich aktorow
    const [cast, setCast] = useState([]); // obsada aktualnie podgladanego filmu (po kliiknieciu Cast)
    const [addingMovie, setAddingMovie] = useState(false); // czy dodajemy film
    const [addingActor, setAddingActor] = useState(false); // czy dodajemy aktora
    const [showActors, setShowingActors] = useState(false); // czy wyswietlamy aktorow
    const [editMovie, setEditMovie] = useState(null); // czy (ew. null) i ktory film edytujemy (nazwa, rezyser, itp.)
    const [editActor, setEditActor] = useState(null); // czy (ew. null) i ktorego aktora edytujemy (imie i nazwisko)
    const [editCastOf, setEditCastOf] = useState(null);  // czy (ew. null) i ktorego filmu obsade chcemy powiekszyc (tj. dodac aktora)
    const [showCast, setShowCast] = useState(null); // czy (ew. null) i ktorego filmu obsade aktualnie podgladamy

 //   function handleAddMovie(movie) {
 //       setMovies([...movies, movie]);
 //       setAddingMovie(false);
 //   }

    useEffect(() => {
    const fetchMovies = async () => {
        const response = await fetch(`/movies`);
        if (response.ok) {
            const movies = await response.json();
            setMovies(movies);
            console.log("Current movies:", movies);
        }
    };
    fetchMovies();
    }, []);

    useEffect(() => {
    const fetchActors = async () => {
        const response = await fetch(`/actors`);
        if (response.ok) {
            const actors = await response.json();
            setActors(actors);
            console.log("Current actors:", actors);
        }
    };
    fetchActors();
    }, []); 


    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {method: 'DELETE',
        });
        
        if (response.ok) {
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies);
        }
    }

    async function deleteActorCast(actor) {
        const response = await fetch(`/movies/${showCast.id}/actors/${actor.id}`, {method: 'DELETE',
        });
        
        if (response.ok) {
            //const nextCast = cast.filter(m => !(m.movie_id === showCast.id && m.actor_id === actor.id));
            const nextCast = cast.filter(a => a.id !== actor.id);
            setCast(nextCast);
            console.log("Current cast:", cast);
        }
    }

   // async function handleEditCast(actor) {
   //     const response = await fetch(`/movies/${.id}/actors/`, {
   //         method: 'POST',
   //         body: JSON.stringify(actor),
   //         headers: { 'Content-Type': 'application/json' }
    //    });

      //  if (response.ok) {
        //    const addingResponse = await response.json()
            
            //Chcemy zeby od razu mial ID
          //  const newActor= {
            //    ...actor,
              //  id: addingResponse.id
           // };
            
            //setCast(prev => [...prev, newActor]);
            //setAddingActor(false);
        //}
    //}

    async function handleDeleteActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {method: 'DELETE',
        });
        
        if (response.ok) {
            const nextActors = actors.filter(a => a !== actor);
            setActors(nextActors);
        }
    }

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const addingResponse = await response.json()
            //movie.id = addingResponse.id;

            //const newMovie = {
            //    ...movie,
            //    id: addingResponse.id
            //};


            setMovies(prev => [...prev, addingResponse]);
            setAddingMovie(false);
        }
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const addingResponse = await response.json()
            
            //Chcemy zeby od razu mial ID
            const newActor = {
                ...actor,
                id: addingResponse.id
            };
            
            setActors(prev => [...prev, newActor]);
            setAddingActor(false);
        }
    }

    async function handleEditCast(actor) {
        const response = await fetch(`/movies/${editCastOf.id}/actors/${actor.id}`, {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const addingResponse = await response.json()
            
            //Chcemy zeby od razu mial ID
            //const newActor = {
            //    ...actor,
            //    id: addingResponse.id
            //};
            
            setCast(prev => [...prev, actor]);
           // setAddingActor(false);
        }
    }

    async function handleEditMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'PUT',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            //const updatedMovie = await response.json();
            //const addingResponse = await response.json()
            //movie.id = addingResponse.id;
            //movie.title = addingResponse.title;
            //setMovies([...movies, movie]);
            //const updatedMovie = await response.json();
            //console.log(typeof movie.id);
            //console.log(typeof movies[0].id);
            //setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
            setMovies(prev => prev.map(m =>m.id === movie.id ? movie : m));

            //setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, title: movie.title } : m));
            setEditMovie(null);
        }
    }


    async function handleEditActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {
            method: 'PUT',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            //const updatedMovie = await response.json();
            //const addingResponse = await response.json()
            //movie.id = addingResponse.id;
            //movie.title = addingResponse.title;
            //setMovies([...movies, movie]);
            //const updatedMovie = await response.json();
            //console.log(typeof movie.id);
            //console.log(typeof movies[0].id);
            //setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
            setActors(prev => prev.map(a =>a.id === actor.id ? actor : a));

            //setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, title: movie.title } : m));
            setEditActor(null);
        }
    }

    function handleMovieForm(movie) {
        setEditMovie(movie);
        console.log("Editing movie:", movie);
    }

    function handleActorForm(actor) {
        setEditActor(actor);
        console.log("Editing actor:", actor);
    }

    function handleCastForm(movie) {
        setEditCastOf(movie);
        console.log("Editing cast of:", movie);
    }

    async function handleShowCast(movie) {
        setShowCast(movie);
        setEditCastOf(movie);
        console.log("Showing cast:", movie)

        const response = await fetch(`/movies/${movie.id}/actors`);
        if (response.ok) {
            const film_actors = await response.json();
            setCast(film_actors);
            console.log("Current cast:", film_actors);
        }
    }

    

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            <><button onClick={() => setAddingMovie(true)}>Add movie</button> <button onClick={() => setAddingActor(true)}>Add actor</button> <button onClick={() => setShowingActors(true)}>Show actors</button></>
            {movies.length === 0
                ? <p> No movies yet. Maybe add something? </p>
                : <MoviesList movies={movies}
                              onDeleteMovie={handleDeleteMovie} onEditMovie={handleMovieForm} onCastMovie={handleShowCast}
                />}
            {addingMovie && (<MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Send"
                             onCancel={() => setAddingMovie(false)}
                />
                //: <><button onClick={() => setAddingMovie(true)}>Add movie</button> <button onClick={() => setAddingActor(true)}>Add actor</button></>
            )}
            {addingActor && (<ActorForm onActorSubmit={handleAddActor}
                             buttonLabel="Send"
                             onCancel={() => setAddingActor(false)}
                />
                //: <><button onClick={() => setAddingMovie(true)}>Add movie</button> <button onClick={() => setAddingActor(true)}>Add actor</button></>
            )}
            {editMovie != null && (
                <MovieEditForm 
                movie={editMovie} 
                onMovieEdit={handleEditMovie} 
                buttonLabel="Apply"
                onCancel={() => setEditMovie(null)}
                />
            )}
            {editActor != null && (
                <ActorEditForm 
                actor={editActor} 
                onActorEdit={handleEditActor} 
                buttonLabel="Apply"
                onCancel={() => setEditActor(null)}
                />
            )}
            {showActors && (
                <>
                <button onClick={() => setShowingActors(false)}>Hide</button>
                <ActorList actors={actors}
                              onDeleteActor={handleDeleteActor} onEditActor={handleActorForm}
                />
                </>
            )}
            {showCast && (
                <>
                <button onClick={() => setShowCast(null)}>Hide</button>
                <button onClick={() => handleCastForm(showCast)}>Add actors</button>
                <h2>{showCast.title}</h2><br/>
                <CastView cast={cast}
                              onDeleteActor={deleteActorCast}
                />
                </>
            )}
            {editCastOf && (
                <>
                <button onClick={() => setEditCastOf(null)}>Hide</button>
                <h2>{editCastOf.title}</h2><br/>
                <CastEdit actors={actors}
                              onExpandingWith={handleEditCast}
                />
                </>
            )}
        </div>
    );
}

    

export default App;

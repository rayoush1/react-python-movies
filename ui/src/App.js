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

    // Pobieranie listy filmow
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

    // Pobieranie listy aktorow
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

    // Funkcja usuwania filmu
    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {method: 'DELETE',
        });
        
        if (response.ok) {
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies);
            setShowCast(null);
            setEditCastOf(null);
        }
    }

    // Usuwanie aktora z obsady konkretnego filmu
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

    // Funkcja obsługująca usuwanie aktora
    async function handleDeleteActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {method: 'DELETE',
        });
        
        if (response.ok) {
            const nextActors = actors.filter(a => a !== actor);
            setActors(nextActors);
        }
        
    }

    // Dodawanie filmu
    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const addingResponse = await response.json()

            setMovies(prev => [...prev, addingResponse]);
            setAddingMovie(false);
        }
    }

    // Dodawanie aktora
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

    // Dodaj aktora do obsady filmu
    async function handleEditCast(actor) {
        const response = await fetch(`/movies/${editCastOf.id}/actors/${actor.id}`, {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const addingResponse = await response.json()
            
            setCast(prev => [...prev, actor]);
           // setAddingActor(false);
        }
    }

    // Edytuj dane filmu
    async function handleEditMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'PUT',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            setMovies(prev => prev.map(m =>m.id === movie.id ? movie : m));

            //setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, title: movie.title } : m));
            setEditMovie(null);
        }
    }

    // Edytuj dane aktora
    async function handleEditActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {
            method: 'PUT',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {

            setActors(prev => prev.map(a =>a.id === actor.id ? actor : a));

            //setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, title: movie.title } : m));
            setEditActor(null);
        }
    }

    // Ustal, ktory film edytujemy
    function handleMovieForm(movie) {
        setEditMovie(movie);
        console.log("Editing movie:", movie);
    }

    // Ustal, ktorego aktora edytujemy
    function handleActorForm(actor) {
        setEditActor(actor);
        console.log("Editing actor:", actor);
    }

    // Ustal, ktorego filmu obsade edytujemy
    function handleCastForm(movie) {
        setEditCastOf(movie);
        console.log("Editing cast of:", movie);
    }

    // Pokaż obsadę wybranego filmu
    async function handleShowCast(movie) {
        setShowCast(movie);
        setEditCastOf(null);
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
            <h1>Small movie database</h1>
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

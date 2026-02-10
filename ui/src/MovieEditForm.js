import {useState, useEffect} from "react";

export default function MovieEditForm(props) {
    const [id, setMovieId] = useState(props.movie.id);
    const [title, setTitle] = useState(props.movie.title);
    const [year, setYear] = useState(props.movie.year);
    const [director, setDirector] = useState(props.movie.director);
    const [description, setDescription] = useState(props.movie.description);

    useEffect(() => {
        if (props.movie) {
            setMovieId(props.movie.id);
            setTitle(props.movie.title);
            setYear(props.movie.year);
            setDirector(props.movie.director);
            setDescription(props.movie.description);
        }
    }, [props.movie]);

    function editMovie(event) {
        event.preventDefault();
        if (title.length < 5) {
            return alert('Tytuł jest za krótki');
        }
        props.onMovieEdit({id, title, year, director, description});

        //setMovieId('');
        //setTitle('');
        //setYear('');
        //setDirector('');
        //setDescription('');
    }

    function cancel() {
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        props.onCancel();
    }

    return <form onSubmit={editMovie}>
        <h2>Edit a movie</h2>
        <div>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
        <button type="button" onClick={cancel}>Cancel</button>
    </form>;
}

import {useState} from "react";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');

    function addMovie(event) {
        event.preventDefault();
        if (title.length < 1) {
            return alert('Tytuł jest za krótki');
        }
        props.onMovieSubmit({title, year, director, description});
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
    }

    function cancel() {
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        props.onCancel();
    }

    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
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

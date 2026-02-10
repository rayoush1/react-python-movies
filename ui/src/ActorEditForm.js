import {useState, useEffect} from "react";

export default function ActorEditForm(props) {
    const [id, setActorId] = useState(props.actor.id);
    const [name, setName] = useState(props.actor.name);
    const [surname, setSurname] = useState(props.actor.surname);


    useEffect(() => {
        if (props.actor) {
            setActorId(props.actor.id);
            setName(props.actor.name);
            setSurname(props.actor.surname);
        }
    }, [props.actor]);

    function editActor(event) {
        event.preventDefault();
        if (surname.length < 1) {
            return alert('Nazwisko jest za krotkie.');
        }
        props.onActorEdit({id, name, surname});

        //setMovieId('');
        //setTitle('');
        //setYear('');
        //setDirector('');
        //setDescription('');
    }

    function cancel() {
        setName('');
        setSurname('');
        props.onCancel();
    }

    return <form onSubmit={editActor}>
        <h2>Edit an actor</h2>
        <div>
            <label>Imie</label>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
        </div>
        <div>
            <label>Nazwisko</label>
            <input type="text" value={surname} onChange={(event) => setSurname(event.target.value)}/>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
        <button type="button" onClick={cancel}>Cancel</button>
    </form>;
}

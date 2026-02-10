import {useState} from "react";

export default function ActorForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    function addActor(event) {
        event.preventDefault();
        if (surname.length < 1) {
            return alert('Nazwisko jest za krotkie');
        }
        props.onActorSubmit({name, surname});
        setName('');
        setSurname('');
    }

    function cancel() {
        setName('');
        setSurname('');
        props.onCancel();
    }

    return <form onSubmit={addActor}>
        <h2>Add actor</h2>
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
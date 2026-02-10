import CastEditItem from "./CastEditItem";

export default function CastEdit(props) {
    return <div>
        <h3>Actors available</h3>
        <ul className="castedit-list">
            {props.actors.map(actor => <li key={actor.id}>
                <CastEditItem actor={actor} onAddingCast={() => props.onExpandingWith(actor)} />
            </li>)}
        </ul>
    </div>;
}
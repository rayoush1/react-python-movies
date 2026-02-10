import CastItem from "./CastItem";

export default function CastView(props) {
    return <div>
        <h2>Cast</h2>
        <ul className="cast-list">
            {props.cast.map(actor => <li key={actor.id}>
                <CastItem actor={actor} onDelete={() => props.onDeleteActor(actor)}/>
            </li>)}
        </ul>
    </div>;
}
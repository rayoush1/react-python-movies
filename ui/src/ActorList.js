import ActorListItem from "./ActorListItem";

export default function ActorList(props) {
    return <div>
        <h3>Actors</h3>
        <ul className="actor-list">
            {props.actors.map(actor => <li key={actor.id}>
                <ActorListItem actor={actor} onDelete={() => props.onDeleteActor(actor)} onEdit={() => props.onEditActor(actor)}/>
            </li>)}
        </ul>
    </div>;
}
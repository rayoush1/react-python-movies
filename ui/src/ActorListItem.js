export default function ActorListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.actor.id}</strong>
                {' '}
                <strong>{props.actor.name}</strong>
                {' '}
                <strong>{props.actor.surname}</strong>
                {' '}
                <a onClick={props.onDelete}>Delete</a> | 
                <a onClick={props.onEdit}>Edit</a>
            </div>
        </div>
    );
}
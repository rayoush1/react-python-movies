export default function CastItem(props) {
    return (
        <div>
            <div>
                {' '}
                <strong>{props.actor.name}</strong>
                {' '}
                <strong>{props.actor.surname}</strong>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
        </div>
    );
}
export default function CastEditItem(props) {
    return (
        <div>
            <div>
                {' '}
                <strong>{props.actor.name}</strong>
                {' '}
                <strong>{props.actor.surname}</strong>
                {' '}
                <a onClick={props.onAddingCast}>Add</a>
            </div>
        </div>
    );
}
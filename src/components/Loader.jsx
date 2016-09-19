export function Loader(props) {
    return (
        <div className="loadState">
            <div className="loadMsg">
                {props.message}
            </div>
            <div className="spinner">
                <img src="/images/loader-ring.gif" alt="Kiwi standing on oval" />
            </div>
        </div>
    );
}
export default function UserFriends(props: any) {
    return (
        <>
            {props.friendList && props.friendList.length > 0 ? (
                props.friendList
            ) : (
                <div className="profile--achievements-body">
                    <p>You have no friends currently</p>
                    <p className="span"> search for some </p>
                </div>
            )}
        </>
    );
}

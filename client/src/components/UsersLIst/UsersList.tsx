import { IUser } from "../../utils/interfaces";

interface UsersListProps {
  users: IUser[];
  handleUserCardClick: (user_id: string, username: string) => void;
}

export function UsersList(props: UsersListProps) {
  return (
    <>
      <ul className="users-list">
        {props.users.map((user) => {
          return (
            <>
              <li
                className="user"
                onClick={() =>
                  props.handleUserCardClick(user._id, user.username)
                }
              >
                <header className="user-list-header">
                  <span>
                    User ID: <span className="order-id">{user._id}</span>
                  </span>
                  <span className="user-list-email">{user.username}</span>
                </header>
              </li>
            </>
          );
        })}
      </ul>
    </>
  );
}

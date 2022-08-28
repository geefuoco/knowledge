import { Navigate, useParams } from "react-router-dom";
import Profile from "../components/Profile";

const UserProfile: React.FC = () => {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/notfound" replace={true} />;
  }

  return <Profile userId={Number(id)} />;
};

export default UserProfile;

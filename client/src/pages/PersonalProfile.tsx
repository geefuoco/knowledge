import Profile from "../components/Profile";
import { useAuth } from "../hooks/useAuth";

const PersonalProfile: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <h1 className="font-bold text-center">
        Error: could not load user profile
      </h1>
    );
  }
  return <Profile userId={user.id} />;
};

export default PersonalProfile;

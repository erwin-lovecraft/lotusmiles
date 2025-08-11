import ProfileModal from "@/components/profile-modal";
import { useNavigate } from "react-router";

export default function ProfileView() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return <ProfileModal onClose={handleClose} />;
}

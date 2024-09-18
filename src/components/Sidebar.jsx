import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  HomeIcon,
  UserPlusIcon,
  HeartIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const isAdmin = user?.email === "marko.colak@fsre.sum.ba";

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <Card className="fixed top-0 left-0 h-screen w-64 p-6 shadow-xl bg-gradient-to-b from-blue-400 to-blue-200 text-white">
      <div className="mb-8">
        <Typography variant="h5" color="white" className="font-bold">
          Charity App
        </Typography>
      </div>
      <List className="space-y-4">
        <ListItem onClick={() => navigate("/")} className="hover:bg-blue-700">
          <ListItemPrefix>
            <HomeIcon className="h-5 w-5" />
          </ListItemPrefix>
          Home
        </ListItem>

        <ListItem onClick={() => navigate("/charities")} className="hover:bg-blue-700">
          <ListItemPrefix>
            <HeartIcon className="h-5 w-5" />
          </ListItemPrefix>
          Charities
        </ListItem>
        {!user && (
          <>
            <ListItem
              onClick={() => navigate("/login")}
              className="hover:bg-blue-700"
            >
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Login
            </ListItem>
            <ListItem
              onClick={() => navigate("/register")}
              className="hover:bg-blue-700"
            >
              <ListItemPrefix>
                <UserPlusIcon className="h-5 w-5" />
              </ListItemPrefix>
              Register
            </ListItem>
          </>
        )}
        {user && (
            <>
                  <ListItem
            onClick={() => navigate("/donations")}
            className="hover:bg-blue-700"
            > 
            <ListItemPrefix>
              <BanknotesIcon className="h-5 w-5" />
            </ListItemPrefix>
            Donations
          </ListItem>
        </>
        )}
        {isAdmin && (
            <>
            <ListItem
              onClick={() => navigate("/admin/add-charity")}
              className="hover:bg-blue-700"
            >
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              Add Charity
            </ListItem>
            <ListItem
              onClick={() => navigate("/admin/dashboard")}
              className="hover:bg-blue-700"
            >
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Admin Dashboard
            </ListItem>
          </>
        )}
        {user && (
          <>
            <ListItem
              onClick={() => navigate("/profile")}
              className="hover:bg-blue-700"
            >
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            <ListItem onClick={handleLogout} className="hover:bg-blue-700">
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </>
        )}
      </List>
    </Card>
  );
}

export default Sidebar;
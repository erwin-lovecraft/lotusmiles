import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import AppBar from "@/components/app-bar.tsx";
import BottomNavigationBar, { BottomNavigationBarItem } from "@/components/bottom-navigation-bar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const mockActivities = [
  {
    id: "1",
    description: "Purchase at Downtown Store",
    date: "2 hours ago",
    points: "+25",
    type: "earn",
  },
  {
    id: "2",
    description: "Reward Redeemed",
    date: "Yesterday",
    points: "-500",
    type: "redeem",
  },
  {
    id: "3",
    description: "Bonus Points",
    date: "3 days ago",
    points: "+100",
    type: "bonus",
  },
];

const mockRewards = [
  {
    id: "1",
    name: "Free Coffee",
    points: "500 points",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop&crop=center",
  },
  {
    id: "2",
    name: "Free Meal",
    points: "1000 points",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&crop=center",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickSetting = () => {
    navigate("/home/profile", {state: {background: location}});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <AppBar onSettingClick={handleClickSetting}/>

      <div className="p-4 space-y-6 pb-20">
        {/* Loyalty Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">Loyalty Card</h2>
              <p className="text-indigo-100">Member since 2024</p>
            </div>
            <div className="bg-gradient-to-r from-accent to-orange-500 px-3 py-1 rounded-full text-sm font-medium">
              Gold
            </div>
          </div>

          <div className="mb-6">
            <p className="text-indigo-100 text-sm mb-1">Current Points</p>
            <p className="text-3xl font-bold">2,847</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm">Next Reward</p>
              <p className="font-semibold">153 points away</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm">Progress</p>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-indigo-400 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: "75%"}}></div>
                </div>
                <span className="text-sm">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12V9m4.01 0V9M20 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0H4"
                ></path>
              </svg>
            </div>
            <p className="font-medium text-slate-800">Scan QR</p>
            <p className="text-xs text-slate-500">Earn points</p>
          </button>

          <button className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
            <p className="font-medium text-slate-800">Rewards</p>
            <p className="text-xs text-slate-500">Redeem now</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
          </div>

          <div className="p-6 space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "earn"
                      ? "bg-success/10"
                      : activity.type === "redeem"
                        ? "bg-red-100"
                        : "bg-primary/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      activity.type === "earn"
                        ? "text-success"
                        : activity.type === "redeem"
                          ? "text-red-500"
                          : "text-primary"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{activity.description}</p>
                  <p className="text-sm text-slate-500">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${activity.type === "redeem" ? "text-red-500" : "text-success"}`}>
                    {activity.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Available Rewards</h3>
          </div>

          <div className="p-6 space-y-4">
            {mockRewards.map((reward) => (
              <div key={reward.id} className="flex items-center space-x-4 p-3 border border-slate-200 rounded-xl">
                <img src={reward.image} alt={reward.name} className="w-12 h-12 rounded-lg object-cover"/>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{reward.name}</p>
                  <p className="text-sm text-slate-500">{reward.points}</p>
                </div>
                <Button
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Redeem
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigationBar>
        <BottomNavigationBarItem
          index
          icon={<FontAwesomeIcon icon="home"/>}
          title="Home"
          onClick={() => {
          }}/>
        <BottomNavigationBarItem icon={<FontAwesomeIcon icon="clock-rotate-left"/>} title="History" onClick={() => {
        }}/>
        <BottomNavigationBarItem icon={<FontAwesomeIcon icon="plus"/>} title="Miles Accrual Request" onClick={() => {
        }}/>
        <BottomNavigationBarItem icon={<FontAwesomeIcon icon="user"/>} title="Profile" onClick={() => {
        }}/>
      </BottomNavigationBar>
    </div>
  );
}

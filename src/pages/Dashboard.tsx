import { LoginStore } from "../store/Store";

const Dashboard = () => {
  const { token } = LoginStore();
  console.log(token);

  return <div>Dashboard</div>;
};

export default Dashboard;

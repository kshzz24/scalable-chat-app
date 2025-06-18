import { useAuthStore } from "@/store";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  console.log(user, "sdfsdfsd");
  return <pre className="text-white">{JSON.stringify(user, null, 4)}</pre>;
};

export default HomePage;

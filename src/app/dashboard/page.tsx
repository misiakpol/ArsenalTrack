const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-md"></div>
      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-md"></div>
      <div className="row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-md"></div>
      <div className="row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-md"></div>
    </div>
  );
};

export default Dashboard;

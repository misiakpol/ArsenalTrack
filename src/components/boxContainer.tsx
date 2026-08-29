const boxContainer = ({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default boxContainer;

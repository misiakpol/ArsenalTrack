import BoxContainer from "@/components/boxContainer";

const Sessions = () => {
  return (
    <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <BoxContainer title="Session Analytics">
          <p>Here is the content of the box</p>
        </BoxContainer>
      </div>
    </div>
  );
};

export default Sessions;

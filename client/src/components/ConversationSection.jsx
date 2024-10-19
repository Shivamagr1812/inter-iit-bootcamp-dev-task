import Message from "./Message";

function ConversationSection({ conversation }) {
  return (
    <div className="mt-[55px] mb-[70px] w-full flex-grow flex justify-center overflow-auto scrollbar-thin bg-[#131921]">
      <div className="h-[100%] w-[100%] md:w-[65%] flex flex-col gap-3 pt-3 pr-5 bg-[#131921]">
        {conversation.map((msg, index) => {
          return <Message key={index} msg={msg} />;
        })}
      </div>
    </div>
  );
}

export default ConversationSection;

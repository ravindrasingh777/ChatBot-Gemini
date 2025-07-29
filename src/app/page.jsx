"use client";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const Page = () => {
  const inpref = useRef();
  const [role, setrole] = useState("");
  const [output, setoutput] = useState("");
  const [userMsg, setuserMsg] = useState("");
  const [userRole, setuserRole] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const generateText = async (e) => {
    e.preventDefault();
    const inpValue = inpref.current.value;
    setuserMsg(inpValue);
    setuserRole("You");
    setrole("AI");
    setoutput("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: inpValue }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setoutput((prev) => prev + chunk);
    }

    inpref.current.value = "";
  };

  return (
    <>
      <div className="w-full relative min-h-screen bg-gray-400 ">
        <div className="fixed bottom-20 right-10">
          <div className="mb-12  w-full">
            {isOpen && (
              <div className="max-w-sm h-[400px] ">
                <div className="w-full rounded-t-md p-1  text-center font-bold text-2xl bg-red-500 text-white">
                  Chat With Us
                </div>

                <div className="w-full h-full p-3 rounded-b-md flex flex-col justify-end shadow-lg bg-gray-100 ">
                  <div className="mb-2 h-full  w-full overflow-y-scroll ">
                    {userMsg == "" && (
                      <div className="text-center ">No Messages Yet..</div>
                    )}
                    <div className="text-md mb-5 w-full break-words text-end pr-2">
                      {userRole && (
                        <>
                          <span className="font-bold">{userRole}:</span>{" "}
                          {userMsg}
                        </>
                      )}
                    </div>
                    <div className="text-sm text-start pr-2  max-w-none">
                      {role && (
                        <>
                          <div className="font-bold">{role}:</div>
                          <ReactMarkdown>{output}</ReactMarkdown>
                        </>
                      )}
                    </div>
                  </div>
                  <form onSubmit={generateText} className="flex gap-2">
                    <input
                      type="text"
                      ref={inpref}
                      className="flex-1 px-2 border border-gray-500 rounded-md bg-white outline-none"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="w-11 h-11 rounded-md bg-red-500 text-white"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="text-end">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-14 h-14 rounded-full shadow-lg bg-red-500 text-white font-bold"
            >
              AI
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

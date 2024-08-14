import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { CustomerCare } from "../middleware/Api";
import { LoginStore } from "../store/Store";
import { User, Chat } from "../middleware/utils";
import { IoSend } from "react-icons/io5";
import Swal from "sweetalert2";
import socketService from "../socket";

const CustomerCarePage = () => {
  const { token, id } = LoginStore();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [users, setUsers] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentReceiverId, setCurrentReceiverId] = useState<number | null>(
    null
  );
  const [currentReceiverName, setCurrentReceiverName] = useState("");
  const [mediumDialogOpen, setMediumDialogOpen] = useState(false);
  const [dataUser, setDataUser] = useState<User[]>([]);
  // const [typing, setTyping] = useState(false);

  useEffect(() => {
    getUserChatsdata();
    getDataChatAll();
    getMessages;
    socketConnect
  }, []);

  useEffect(() => {
    if (currentReceiverId !== null) {
      getMessages();
    }
  }, [currentReceiverId]);

  const socketConnect = async () => {
    await socketService.connect()
    socketService.on("cc_refresh", () => {
      getUserChatsdata()
      getDataChatAll()
      getMessages()
    })
  }

  const getUserChatsdata = async () => {
    try {
      const response = await CustomerCare.getUserChats(token, id);
      setUsers(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };
  const getDataChatAll = async () => {
    try {
      const response = await CustomerCare.getDataChat(token, 10000);
      const { result } = response.data.data;
      console.log(response.data.data);
      setDataUser(result);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data Guru & Karyawan, silakan refresh halaman!",
      });
    }
  };

  const setUpMessage = (userChat: any) => {
    setCurrentReceiverId(userChat.with_id);
    setCurrentReceiverName(userChat.withUser.full_name);
  };

  const newMessage = (user: any) => {
    setCurrentReceiverId(user.id);
    setCurrentReceiverName(user.full_name);
    setMessages([]);
    setMediumDialogOpen(false);
  };

  const getMessages = async () => {
    try {
      const response = await CustomerCare.getMessages(
        token,
        id,
        currentReceiverId || 1
      );
      const data = response.data.data[0]?.messages || [];
      setMessages(
        data.map((message: any) => ({
          text: message.message,
          sender: message.sender_id !== Number(id) ? currentReceiverName : "Me", // Example userId 1
          color: message.sender_id !== Number(id) ? "primary" : "amber",
          textColor: message.sender_id !== Number(id) ? "white" : "black",
          isSender: message.sender_id === Number(id), // Example userId 1
          stamp: new Date(message.createdAt).toLocaleString(),
        }))
      );
      getUserChatsdata();
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage || currentReceiverId === null) return;

    try {
      await CustomerCare.sendMessage(
        token,
        currentReceiverId,
        inputMessage,
        id
      );
      getMessages();
      setInputMessage("");
      socketService.emit('cc', {})
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex h-[84vh] w-[90%] m-auto my-10">
        <div
          className={`transition-transform overflow-y-auto ${
            drawerOpen ? "w-64" : "w-0"
          } flex-none bg-gray-800 text-white`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-2xl font-bold">Chats</h2>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="text-white text-xl"
            >
              <FaAngleLeft />
            </button>
          </div>

          <div className="overflow-y-auto px-4">
            {users?.map((userChat: Chat) => (
              <div
                key={userChat.with_id}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
                onClick={() => setUpMessage(userChat)}
              >
                <img
                  src="https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="ml-2">{userChat.withUser.full_name}</span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <button
              onClick={() => setMediumDialogOpen(true)}
              className="btn btn-success text-white w-full flex items-center justify-center"
            >
              <FaPlus /> Add Chat
            </button>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="bg-white shadow p-4 min-h-16 flex gap-5">
            {!drawerOpen ? (
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="text-black text-2xl align-middle text-center"
              >
                <FaAngleRight />
              </button>
            ) : null}
            {currentReceiverName ? (
              <div className="flex gap-2 text-center h-full items-center">
                <img
                  src="https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full"
                />
                <h2 className="text-xl">{currentReceiverName}</h2>
              </div>
            ) : null}
          </div>

          <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isSender ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    message.isSender
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  <div>{message.text}</div>
                  <div className="text-xs">{message.stamp}</div>
                </div>
              </div>
            ))}
            {/* {typing && <div className="text-gray-500">Typing...</div>} */}
          </div>

          <div className="p-4 bg-white flex items-center">
            <input
              type="text"
              value={inputMessage}
              className="input input-bordered flex-grow rounded-full"
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type here"
            />
            <button
              onClick={sendMessage}
              className="btn btn-success btn-circle text-white ml-4"
            >
              <IoSend />
            </button>
          </div>
        </div>

        {mediumDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h2 className="text-xl mb-4">Kirim Pesan</h2>
              <div className="overflow-y-auto max-h-80">
                {dataUser?.map((user: User, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => newMessage(user)}
                  >
                    <img
                      src="https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="ml-2">{user.full_name}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setMediumDialogOpen(false)}
                  className="btn btn-warning"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCarePage;

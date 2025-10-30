import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
      <h1 className="text-4xl font-bold mb-6">🎉 Birthday Cards 🎉</h1>
      <p className="mb-8 text-lg text-gray-700">
        Create a personalized birthday card with photos, music, and a message.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/create")}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
        >
          Create a Card
        </button>
        <button
          onClick={() => navigate("/card/6903aadf9e23b2bbc0a72ec9")} 
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
        >
          View Example
        </button>
      </div>
    </div>
  );
}

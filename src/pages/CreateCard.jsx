import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/apiPaths";

const CreateCard = () => {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([""]);
  const [images, setImages] = useState([]);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleSongChange = (e) => setSong(e.target.files[0]);

  const handleMessageChange = (index, value) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addMessage = () => setMessages((prev) => [...prev, ""]);
  const removeMessage = (index) =>
    setMessages((prev) => prev.filter((_, i) => i !== index));

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("messages", JSON.stringify(messages));

      images.forEach((file) => formData.append("images", file));
      if (song) formData.append("song", song);

      console.log("📤 Submitting form data:");
       for (let [key, value] of formData.entries()) {
       console.log(key, value);
}


      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
  const errorText = await res.text();
  console.error("Backend error:", errorText);
  throw new Error("Failed to create card");
}


      const data = await res.json();
    

      // Navigate to the card view page using the new card’s ID
      navigate(`/card/${data.card._id}`); 
    } catch (error) {
      console.error("❌ Error creating card:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Create Birthday Card
        </h1>

        <input
          type="text"
          placeholder="Recipient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        {/* messages */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Messages</label>
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <textarea
                  placeholder={`Message ${idx + 1}`}
                  value={msg}
                  onChange={(e) => handleMessageChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={() => removeMessage(idx)}
                  className="px-3 py-2 rounded-md bg-red-100 text-red-600 text-sm hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMessage}
            className="mt-2 px-4 py-2 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
          >
            + Add message
          </button>
        </div>

        {/* image upload */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload Images
          </label>
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-pink-400 rounded-xl cursor-pointer bg-pink-50 hover:bg-pink-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-pink-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16l4-4a4 4 0 015.657 0L21 4M16 8v6m0 0l-2-2m2 2l2-2"
              />
            </svg>
            <p className="text-sm text-pink-600 font-medium">
              Click or drag to upload images
            </p>
            <p className="text-xs text-gray-500">(PNG, JPG, JPEG allowed)</p>
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {images.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              {images.length} image{images.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Song upload */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Upload Song (optional)
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-green-600 transition group">
            <input
              type="file"
              accept="audio/*"
              onChange={handleSongChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-2v13M9 10h12M9 14h12M5 20h14"
                />
              </svg>
              <p className="text-gray-500 group-hover:text-green-600">
                Click to upload your song file
              </p>
              <p className="text-sm text-gray-400">(MP3, WAV, or AAC)</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Card"}
        </button>
      </form>
    </div>
  );
};

export default CreateCard;

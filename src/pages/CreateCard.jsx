import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/apiPaths";

const CreateCard = () => {
  const [name, setName] = useState("");
  const [entries, setEntries] = useState([{ message: "", image: null }]);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { message: "", image: null }]);
  };

  const removeEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSongChange = (e) => setSong(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      // Separate arrays for messages and images
      const messages = entries.map((entry) => entry.message);
      formData.append("messages", JSON.stringify(messages));

      entries.forEach((entry) => {
        if (entry.image) formData.append("images", entry.image);
      });

      if (song) formData.append("song", song);

      const res = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", errText);
        throw new Error("Failed to create card");
      }

      const data = await res.json();
      navigate(`/card/${data.card._id}`);
    } catch (err) {
      console.error("❌ Error creating card:", err);
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

        {/* Entries (message + image) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Messages & Images
          </label>

          {entries.map((entry, idx) => (
            <div
              key={idx}
              className="mb-4 p-4 border rounded-lg bg-pink-50 space-y-3"
            >
              <textarea
                placeholder={`Message ${idx + 1}`}
                value={entry.message}
                onChange={(e) =>
                  handleEntryChange(idx, "message", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleEntryChange(idx, "image", e.target.files[0])
                  }
                />
                {entry.image && (
                  <img
                    src={URL.createObjectURL(entry.image)}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(idx)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            className="px-4 py-2 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
          >
            + Add another
          </button>
        </div>

        {/* Song upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Song (optional)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleSongChange}
            className="w-full border p-2 rounded-lg"
          />
          {song && (
            <p className="text-sm text-green-600 mt-1">
              Song selected: {song.name}
            </p>
          )}
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

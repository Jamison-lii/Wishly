import React, { useState, useEffect, useRef } from "react";
import { FiHeart, FiShare2, FiChevronLeft, FiChevronRight, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import defaultSong from "../assets/Adun.mp3";
import ShareLink from "./ShareLink";
import { BASE_URL } from "../utils/apiPaths";

const BirthdayCard = () => {
  const { cardId } = useParams();
  const [cardData, setCardData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Fetch card data
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${cardId}`);
        const data = await res.json();
        if (data.success) setCardData(data.card);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCard();
  }, [cardId]);

  // Initialize audio once cardData is loaded
  useEffect(() => {
    if (cardData) {
      audioRef.current = new Audio(cardData.song || defaultSong);
      audioRef.current.loop = true;
    }
  }, [cardData]);

  // Handle play after user interaction
  const handlePlayButtonClick = () => {
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => {
        setIsMusicPlaying(true);
        setShowContent(true);
      })
      .catch(err => {
        console.error("Error playing audio:", err);
        alert("Audio failed to play. Please check your browser settings.");
        setShowContent(true);
      });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsMusicPlaying(!isMusicPlaying);
  };

  //console.log("Card Data song:", cardData.song);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % (cardData.images.length || 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + (cardData.images.length || 1)) % (cardData.images.length || 1));

  const shareCard = () => {
    if (!cardData) return;
    if (navigator.share) {
      navigator.share({
        title: `Birthday Card for ${cardData.name}`,
        text: `Check out this birthday card for ${cardData.name}!`,
        url: window.location.href,
      }).catch(console.error);
    } else alert("Share this link: " + window.location.href);
  };

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center p-8">
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  const { name, messages = [], images = [] } = cardData;

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
        <button
          onClick={handlePlayButtonClick}
          className="bg-white text-pink-600 px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-pink-100 transition-all flex items-center gap-2"
        >
          <FiVolume2 className="text-2xl" />
          Click to Start Birthday Celebration
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 left-4 z-40 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all"
        aria-label={isMusicPlaying ? "Mute music" : "Play music"}
      >
        {isMusicPlaying ? <FiVolume2 className="text-pink-600" /> : <FiVolumeX className="text-pink-600" />}
      </button>

      {/* Main card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white flex justify-between items-center">
          <button
            onClick={shareCard}
            className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
          >
            <FiShare2 /> Share
          </button>
        </div>

        <div className="md:flex">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
            {images.length > 0 && (
              <>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Memory ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain drop-shadow-lg rounded-lg"
                    onClick={() => setIsFullscreen(true)}
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all"
                    >
                      <FiChevronLeft className="h-5 w-5 text-pink-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all"
                    >
                      <FiChevronRight className="h-5 w-5 text-pink-600" />
                    </button>
                  </>
                )}
                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${currentImageIndex === idx ? "bg-pink-600 w-6" : "bg-white/80 w-2"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Messages */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-pink-600 mb-2">Happy Birthday</h1>
              <h2 className="text-3xl font-semibold text-gray-800">{name}!</h2>
            </div>

            {images.length > 0 && messages[currentImageIndex] && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-lg italic mb-4">"{messages[currentImageIndex]}"</p>
                <div className="flex items-center justify-end">
                  <FiHeart className="text-pink-500 mr-2" />
                  <span className="text-gray-600">With love</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-md transition-all"
              >
                Print Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setIsFullscreen(false)}>
            &times;
          </button>
          <div className="relative w-full max-w-4xl h-full max-h-screen">
            <img
              src={images[currentImageIndex]}
              alt={`Fullscreen`}
              className="w-full h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/30">
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/30">
                  <FiChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ShareLink />

      <div className="text-center mt-6 text-gray-500 text-sm">
        <p>PS: I don't have money, but I can code 😅, so I made this</p>
      </div>
    </div>
  );
};

export default BirthdayCard;

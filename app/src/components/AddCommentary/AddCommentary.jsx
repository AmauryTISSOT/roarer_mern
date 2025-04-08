import React from "react";
import styles from "./AddCommentary.module.css";
import { GiphyFetch } from "@giphy/js-fetch-api";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { HiOutlineGif } from "react-icons/hi2";
import { TweetApi } from "../../services/TweetApi";
import { useState, useRef, useEffect } from "react";

const AddCommentary = ({ tweetId, onCommentSubmit }) => {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [gifResults, setGifResults] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const gf = new GiphyFetch("0XtCmHx83p5NcC9TXSvhCwdlSHRS4PVA");

    const emojiPickerRef = useRef(null);
    const gifPickerRef = useRef(null);

    const handleTextChange = (e) => setText(e.target.value);
    const handleImageUrlChange = (e) => setImageUrl(e.target.value);

    const addImageUrl = () => {
        if (imageUrl.trim() !== "") {
            setImages([...images, imageUrl]);
            setImageUrl("");
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleEmojiSelect = (emojiData) => {
        setText(text + emojiData.emoji);
    };

    const handleGifClick = async () => {
        setShowGifPicker(!showGifPicker);
        setShowEmojiPicker(false); // Fermer l'emoji picker
        if (!gifResults.length && searchQuery === "") {
            const gifs = await gf.trending({ limit: 8 });
            setGifResults(gifs.data);
        }
    };

    const handleGifSearch = async () => {
        if (searchQuery) {
            const gifs = await gf.search(searchQuery, { limit: 8 });
            setGifResults(gifs.data);
        }
    };

    const handleGifSelect = (gifUrl) => {
        setSelectedGif(gifUrl);
        setShowGifPicker(false);
    };

    const handleRemoveGif = () => {
        setSelectedGif(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCommentary = {
            content: text,
            id_media_pictures: images,
            gif: selectedGif,
            created_at: new Date(),
        };
        try {
            console.log(newCommentary);
            await TweetApi.comment(tweetId, newCommentary);
            console.log("Commentary created successfully");
            resetForm();
            if (onCommentSubmit) {
                onCommentSubmit();
            }
        } catch (error) {
            console.error("Error creating tweet:", error);
        }
    };

    const resetForm = () => {
        setText("");
        setImages([]);
        setSelectedGif(null);
    };

    // Fermer les popups si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) &&
                !event.target.closest(`.${styles.emojiButton}`)
            ) {
                setShowEmojiPicker(false);
            }
            if (
                gifPickerRef.current &&
                !gifPickerRef.current.contains(event.target) &&
                !event.target.closest(`.${styles.gifButton}`)
            ) {
                setShowGifPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className={styles.createTweetContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <textarea
                        className={styles.textArea}
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Écrivez votre commentaire ici..."
                        maxLength="500"
                    />

                    <div className={styles.actions}>
                        <BsEmojiSmile
                            className={styles.emojiButton}
                            size="24"
                            onClick={() => {
                                setShowEmojiPicker(!showEmojiPicker);
                                setShowGifPicker(false);
                            }}
                        />
                        <HiOutlineGif
                            className={styles.gifButton}
                            size="24"
                            onClick={handleGifClick}
                        />
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div
                            ref={emojiPickerRef}
                            className={styles.emojiPicker}
                        >
                            <EmojiPicker onEmojiClick={handleEmojiSelect} />
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowEmojiPicker(false)}
                            >
                                Fermer
                            </button>
                        </div>
                    )}

                    {/* GIF Picker */}
                    {showGifPicker && (
                        <div ref={gifPickerRef} className={styles.gifPicker}>
                            <input
                                type="text"
                                placeholder="Rechercher des GIFs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.gifSearchInput}
                            />
                            <button
                                onClick={handleGifSearch}
                                className={styles.gifSearchButton}
                            >
                                Rechercher
                            </button>
                            <div className={styles.gifResults}>
                                {gifResults.map((gif, index) => (
                                    <img
                                        key={index}
                                        src={gif.images.fixed_height.url}
                                        alt="GIF"
                                        className={styles.gifImage}
                                        onClick={() =>
                                            handleGifSelect(
                                                gif.images.fixed_height.url
                                            )
                                        }
                                    />
                                ))}
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowGifPicker(false)}
                            >
                                Fermer
                            </button>
                        </div>
                    )}

                    {/* Affichage du GIF sélectionné */}
                    {selectedGif && (
                        <div className={styles.selectedGif}>
                            <img src={selectedGif} alt="GIF sélectionné" />
                            <button
                                onClick={handleRemoveGif}
                                className={styles.removeGifButton}
                            >
                                X
                            </button>
                        </div>
                    )}

                    {/* Ajout d'une image via URL */}
                    <input
                        type="text"
                        placeholder="Ajouter une image par URL"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        className={styles.urlInput}
                    />
                    <div className={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={addImageUrl}
                            className={styles.addButton}
                        >
                            Ajouter Image
                        </button>

                        {/* Aperçu des images ajoutées */}
                        <div className={styles.imagePreview}>
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={styles.previewContainer}
                                >
                                    <img
                                        src={img}
                                        alt={`Image ${index + 1}`}
                                        className={styles.image}
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className={styles.removeButton}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCommentary;

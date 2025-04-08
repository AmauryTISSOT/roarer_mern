import React, { createContext, useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

export const WebcamContext = createContext(null);

export const WebcamProvider = ({ children, userId }) => {
    const webcamRef = useRef(null);
    const [currentPost, setCurrentPost] = useState(null);
    const [timeOnPost, setTimeOnPost] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const middleOfScreen = window.innerHeight / 2;

    useEffect(() => {
        const handleScroll = () => {
            const middleOfScreen = window.innerHeight / 2;

            document.querySelectorAll("[class*='tweetContainer']").forEach((post) => {
                const postRect = post.getBoundingClientRect();

                if (postRect.bottom > 0 && postRect.top < window.innerHeight) {
                    if (postRect.top <= middleOfScreen && postRect.bottom >= middleOfScreen) {
                        const postId = post.id;

                        if (postId !== currentPost) {
                            setCurrentPost(postId);
                            setTimeOnPost(0);
                        }
                    }
                }
            });
        };

        const element = document.querySelectorAll("[class*='main']")[0]
        console.log(element)

        element.addEventListener("scroll", handleScroll);

        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, []);


    useEffect(() => {
        console.log(`🕒 Temps sur le post ${currentPost}: ${timeOnPost} sec`);

        if (timeOnPost >= 2) {
            startSendingFrames();
        } else {
            stopSendingFrames();
        }
    }, [timeOnPost]);

    useEffect(() => {
        if (currentPost) {
            const timer = setInterval(() => {
                setTimeOnPost((prev) => prev + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentPost]);

    const startSendingFrames = () => {
        console.log("start " + intervalId)
        if (!intervalId) {
            const id = setInterval(() => sendFrameToServer(), 5000);
            setIntervalId(id);
        }
    }

    const stopSendingFrames = () => {
        console.log("stop " + intervalId)
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const sendFrameToServer = async () => {
        if (!webcamRef.current) {
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            return;
        }

        console.log(imageSrc)

        try {
            await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: imageSrc,
                    postId: currentPost,
                    userId: userId
                }),
            });
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi de l'image:", error);
        }
    };

    return (
        <WebcamContext.Provider value={{ webcamRef }}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: "user" }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    opacity: 0,
                }}
            />
            {children}
        </WebcamContext.Provider>
    );
};

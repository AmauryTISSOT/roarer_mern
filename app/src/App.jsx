import React, { useState, useEffect } from "react";
import "./App.css";
import RoutesRoarer from "./Router/Routes";
import { WebcamProvider } from "./provider/WebcamProvider";

function App() {
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //     const storedUserId = Cookies.get("userId");
  //     if (storedUserId) {
  //         setUserId(storedUserId);
  //     }
  // }, []);

  // if (!userId) {
  //   return <>
  //     <RoutesRoarer />
  //   </>
  // }

  return (
    <>
      <RoutesRoarer />
    </>
  );

  // return (
  //   <>
  //     <RoutesRoarer />
  //   </>
  // );
}

export default App;

import React from "react";
import Lottie from "react-lottie";
import pokeballAnimation from "../../assets/loading.json";

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: pokeballAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} isStopped={false} isPaused={false} />
    </div>
  );
}

import React from "react";
import Typewriter from "typewriter-effect";

const TypeWriter = () => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString(`Analyze your writing habits... `)
          .pauseFor(1100)
          .deleteAll()
          .typeString("Track your progress...")
          .pauseFor(1100)
          .deleteAll()
          .typeString("Get personalized tips...")
          .pauseFor(1100)
          .deleteAll()
          .typeString("Enhance your writing skills...")
          .start();
      }}
    />
  );
};

export default TypeWriter;
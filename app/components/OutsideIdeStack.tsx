"use client";

import Image from "next/image";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import styles from "../version-two.module.css";

type OutsideIdeStackProps = {
  imageSrc: string;
};

const interests = [
  {
    label: "Gym",
    caption: "Training helps me reset, stay consistent and return to work with more focus.",
  },
  {
    label: "Gaming",
    caption: "Games are where I unwind and stay curious about interactive systems.",
  },
  {
    label: "Going out",
    caption: "Time with friends keeps life social, energetic and balanced.",
  },
  {
    label: "Eating out",
    caption: "I enjoy discovering new places and sharing good food with good company.",
  },
];

export function OutsideIdeStack({ imageSrc }: OutsideIdeStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeInterest = interests[activeIndex];
  const nextIndex = (activeIndex + 1) % interests.length;

  return (
    <div className={styles.outsideIdeLayout}>
      <div className={styles.interestDetails}>
        <p className={styles.interestCount}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(interests.length).padStart(2, "0")}
        </p>
        <div className={styles.interestCopy} aria-live="polite" aria-atomic="true">
          <h3>{activeInterest.label}</h3>
          <p>{activeInterest.caption}</p>
        </div>

        <ul className={styles.interestSelectors} aria-label="Choose an interest">
          {interests.map((interest, index) => (
            <li key={interest.label}>
              <button
                type="button"
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                {interest.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className={styles.interestStackButton}
        type="button"
        onClick={() => setActiveIndex(nextIndex)}
        aria-label={`Show next interest: ${interests[nextIndex].label}`}
      >
        <span className={styles.interestStage} aria-hidden="true">
          {interests.map((interest, index) => {
            const slot = (index - activeIndex + interests.length) % interests.length;

            return (
              <span className={styles.interestCard} data-slot={slot} key={interest.label}>
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 78vw, 380px"
                />
                <span className={styles.interestCardShade} />
                <span className={styles.interestCardLabel}>{interest.label}</span>
                <span className={styles.temporaryMedia}>Temporary image</span>
              </span>
            );
          })}
        </span>
        <span className={styles.cyclePrompt}>
          Click to cycle <FaArrowRight aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

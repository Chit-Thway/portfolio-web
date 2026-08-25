"use client";

import Image from "next/image";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import styles from "../version-two.module.css";

const interests = [
  {
    label: "Socials",
    caption: "Time with friends and live music keeps life social, energetic and balanced.",
    startIndex: 0,
  },
  {
    label: "Travel",
    caption: "Travelling gives me new perspectives, memorable experiences and time to reset.",
    startIndex: 2,
  },
  {
    label: "Gaming",
    caption: "Games are where I unwind and stay curious about interactive systems.",
    startIndex: 4,
  },
  {
    label: "Eating out",
    caption: "I enjoy discovering new places and sharing good food with good company.",
    startIndex: 6,
  },
];

const photos = [
  {
    category: "Socials",
    src: "/life-beyond-screen/socials-1.jpg",
    alt: "Friends gathered for a graduation celebration outdoors",
  },
  {
    category: "Socials",
    src: "/life-beyond-screen/socials-2.png",
    alt: "Live music performance viewed from the audience",
  },
  {
    category: "Travel",
    src: "/life-beyond-screen/travel-1.png",
    alt: "Hotel lounge with city views during a trip",
  },
  {
    category: "Travel",
    src: "/life-beyond-screen/travel-2.png",
    alt: "Visiting an elephant sanctuary",
  },
  {
    category: "Gaming",
    src: "/life-beyond-screen/gaming-1.png",
    alt: "Stardew Valley farm during gameplay",
  },
  {
    category: "Gaming",
    src: "/life-beyond-screen/gaming-2.png",
    alt: "Esports tournament winners on stage",
  },
  {
    category: "Eating out",
    src: "/life-beyond-screen/eating-out-1.png",
    alt: "Sharing bowls of ramen while eating out",
  },
  {
    category: "Eating out",
    src: "/life-beyond-screen/eating-out-2.png",
    alt: "Mapo tofu and rice at a restaurant",
  },
];

const visibleCardCount = 4;

export function OutsideIdeStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = photos[activeIndex];
  const activeInterest = interests.find((interest) => interest.label === activePhoto.category)!;
  const nextIndex = (activeIndex + 1) % photos.length;
  const visiblePhotos = Array.from({ length: visibleCardCount }, (_, offset) => ({
    ...photos[(activeIndex + offset) % photos.length],
    slot: offset,
  }));

  return (
    <div className={styles.outsideIdeLayout}>
      <div className={styles.interestDetails}>
        <p className={styles.interestCount}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
        <div className={styles.interestCopy} aria-live="polite" aria-atomic="true">
          <h3>{activeInterest.label}</h3>
          <p>{activeInterest.caption}</p>
        </div>

        <ul className={styles.interestSelectors} aria-label="Choose an interest">
          {interests.map((interest) => (
            <li key={interest.label}>
              <button
                type="button"
                aria-pressed={interest.label === activePhoto.category}
                onClick={() => setActiveIndex(interest.startIndex)}
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
        aria-label={`Show next photo: ${photos[nextIndex].category}`}
      >
        <span className={styles.interestStage} aria-hidden="true">
          {visiblePhotos.map((photo) => (
            <span
              className={styles.interestCard}
              data-slot={photo.slot}
              key={`${photo.category}-${photo.src}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 78vw, 380px"
              />
              <span className={styles.interestCardShade} />
              <span className={styles.interestCardLabel}>{photo.category}</span>
            </span>
          ))}
        </span>
        <span className={styles.cyclePrompt}>
          Click to cycle <FaArrowRight aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

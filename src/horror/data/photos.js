const captions = {
  2: "I don't remember taking this.",
  5: "There used to be people in this one.",
  8: "Who was standing by the door?",
  11: "I think this used to be my room.",
  15: "The face won't stay still when I look away.",
  19: "It has been raining since I got here.",
};

// Put custom files in public/images/horror, then add their photo number here,
// such as 1: "/images/horror/doorway.webp". Numbers run from 1 to 20.
const customHorrorPhotos = {
  // 1: "/images/horror/doorway.webp",
};

export const horrorPhotos = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1;
  return {
    id: `horror-photo-${String(number).padStart(2, "0")}`,
    image: customHorrorPhotos[number] || null,
    caption: captions[number] || "",
    alt: captions[number] || "A dark photograph you do not remember taking",
    variant: index % 5,
    seed: 731 + index * 977,
  };
});

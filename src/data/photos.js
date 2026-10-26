// Replace null with an image address such as "/images/clicks/photo-01.jpg".
// Empty caption lines stay hidden. Add, remove, or move these entries as needed.
const emptyPhoto = (number) => ({
  id: `photo-${String(number).padStart(2, "0")}`,
  src: null,
  alt: "",
  title: "",
  place: "",
  date: "",
  camera: "",
});

export const photos = Array.from({ length: 20 }, (_, index) =>
  emptyPhoto(index + 1),
);

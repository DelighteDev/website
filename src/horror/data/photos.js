// Put custom files in public/images/horror, then add their photo number here,
// such as 1: "/images/horror/photo-01.jpg". Numbers run from 1 to 20.
const customHorrorPhotos = {
  // 1: "/images/horror/photo-01.jpg",
};

const emptyPhoto = (number) => ({
  id: `horror-photo-${String(number).padStart(2, "0")}`,
  src: customHorrorPhotos[number] || null,
  alt: "",
  title: "",
  place: "",
  date: "",
  camera: "",
});

export const horrorPhotos = Array.from({ length: 20 }, (_, index) =>
  emptyPhoto(index + 1),
);

import {
  currentGame,
  currentShow,
  favouriteGame,
  favouriteShow,
  otherGames,
  otherShows,
  setup,
} from "../../data/interests";

// To use your own scary picture, put it in public/images/horror and add the
// exact game or show name here, such as "Omori": "/images/horror/omori.webp".
const customHorrorImages = {
  // "Omori": "/images/horror/omori.webp",
};

const corrupt = (item) => ({
  ...item,
  id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  horrorImage: customHorrorImages[item.name] || null,
});

export const horrorFavouriteGame = corrupt(favouriteGame);
export const horrorCurrentGame = corrupt(currentGame);
export const horrorFavouriteShow = corrupt(favouriteShow);
export const horrorCurrentShow = corrupt(currentShow);
export const horrorGames = otherGames.map(corrupt);
export const horrorShows = otherShows.map(corrupt);

export const horrorSetup = setup.map((part) =>
  part.label === "Keyboard" ? { ...part, value: "I did not type any of this" } : part,
);

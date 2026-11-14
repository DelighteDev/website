export const horrorRoutes = {
  about: "/ab0ut",
  interests: "/1nterests",
  clicks: "/cl1cks",
  blog: "/b10g",
  minecraft: "/m1necraft",
  training: "/tra1ning-data",
};

const horrorPaths = new Set(Object.values(horrorRoutes));

export function isHorrorPath(pathname) {
  return horrorPaths.has(pathname);
}

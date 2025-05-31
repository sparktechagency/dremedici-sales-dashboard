export const getImageUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "https://api.elmagocigarsapp.com";
    return `${baseUrl}/${path}`;
  }
};

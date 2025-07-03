export const getImageUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    // const baseUrl = "https://api.elmagocigarsapp.com";
    const baseUrl = "http://10.0.60.126:5003";
    return `${baseUrl}/${path}`;
  }
};

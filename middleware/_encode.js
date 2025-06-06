module.exports = (obj) => {
    let string = "";
  
    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;
      string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  
    return string.substring(1);
}
export function humanizeDate(date) {
  if (typeof date === 'string' || date instanceof String) {
    const dateArr = date.toString().split("-")
    let day = dateArr[2]
    let month = dateArr[1]
    let year = dateArr[0]
    return `${day}.${month}.${year}`;
  } else {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

export function deHumanizeDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDateObj(dateString) {
  if (!dateString) return new Date();
  const parts = dateString.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

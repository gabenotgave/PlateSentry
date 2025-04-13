export const formatDateTime = (input) => {
    const date = new Date(input.replace(" ", "T"));
    const month = date.getMonth() + 1;         // 0-based
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(2); // "25"
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formatted = `${month}/${day}/${year} ${hours}:${minutes}`;
    return formatted;
}
const formatDate = (date) => {
    const newDate = new Date(date);
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    return newDate.toLocaleString("fr-FR", options).replace(",", "");
};

export default formatDate;

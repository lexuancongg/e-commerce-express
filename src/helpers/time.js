const converDate = (dateMongodb) => {
    const isDateObject = new Date(dateMongodb);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC"
    }
    return isDateObject.toLocaleDateString("en-US", options)
}
module.exports = converDate;
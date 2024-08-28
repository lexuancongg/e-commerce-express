const compareStringsIgnoreCaseAndVietnamese = (str1, str2) => {
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
    return normalize(str1) === normalize(str2) || normalize(str1).includes(normalize(str2));
}
export default compareStringsIgnoreCaseAndVietnamese
function formatCurrency(number, currencyCode) {
    // Kiểm tra xem mã tiền tệ có tồn tại và không rỗng không
    if (!currencyCode || typeof currencyCode !== 'string') {
        throw new Error('Currency code is required and must be a non-empty string.');
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currencyCode
    });
    return formatter.format(number);
}

export default formatCurrency;

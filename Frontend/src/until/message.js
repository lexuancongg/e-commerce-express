const messageAction = (parentElement, information) => {
    const message = document.createElement('div');
    message.classList.add('message', information.type);
    message.innerHTML = `
        <div class="icon"></div>
        <div class="content">
            <div class="title">${information.title}</div>
            <div class="text">${information.text}</div>
        </div>
    `;

    // Thêm vào đầu danh sách
    // parentElement.appendChild(message);
    parentElement.insertBefore(message, parentElement.firstChild);
    // Loại bỏ phần tử DOM sau 3 giây
    setTimeout(() => {
        parentElement.removeChild(message);
    }, 5000);
};

export default messageAction;

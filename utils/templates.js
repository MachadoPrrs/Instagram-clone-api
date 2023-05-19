const resetPasswordHtml = (url) => {
  return `<p>To reset the password, click on the following <a href="${url}">link.</a></p>`;
};

const welcomeMessage = (username) => {
  return `<p>${username} your account has been created</p>`;
};

const deleteUser = () => {
  return `<p>Your account has been deleted</p>`;
};

module.exports = {
  resetPasswordHtml,
  welcomeMessage,
  deleteUser,
};

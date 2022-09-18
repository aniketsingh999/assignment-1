const createTokenUser = ({ name, email, _id: userId }) => {
  return {
    name,
    email,
    userId,
  };
};

module.exports = createTokenUser;
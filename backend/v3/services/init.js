const fs = require("fs");

const init = async () => {
  try {
    if (!fs.existsSync(`/home/mohamed/bauereg`)) {
      fs.mkdirSync(`/home/mohamed/bauereg`);
    }

    if (!fs.existsSync(`/home/mohamed/bauereg/api`)) {
      fs.mkdirSync(`/home/mohamed/bauereg/api`);
    }

    if (!fs.existsSync(`/home/mohamed/bauereg/api/users`)) {
      fs.mkdirSync(`/home/mohamed/bauereg/api/users`);
    }

    if (!fs.existsSync(`/home/mohamed/bauereg/DataEntryFiles`)) {
      fs.mkdirSync(`/home/mohamed/bauereg/DataEntryFiles`);
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { init };

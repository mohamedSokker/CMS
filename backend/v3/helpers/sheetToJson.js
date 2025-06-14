const sheerToJson = (data) => {
  try {
    delete data?.["!ref"];
    delete data?.["!autofilter"];
    delete data?.["!margins"];
    const arrayData = data ? Object.keys(data) : [];
    const result = [];
    let object = {};
    let count = 2;
    arrayData.map((item) => {
      if (
        item.replace(/[A-Z]/g, "") != count &&
        item.replace(/[A-Z]/g, "") != "1"
      ) {
        result.push(object);
        count++;
        object = {};
      }

      if (item.replace(/[A-Z]/g, "") != "1") {
        // if (item.replace(/[A-Z]/g, "") == "2") {
        //   console.log(data[`${item.split(/[0-9]/).join("")}1`]?.v);
        // }
        object = {
          ...object,
          [data[`${item.split(/[0-9]/).join("")}1`]?.v]: data[item]?.v
            ? data[item]?.v
            : "",
        };
      }
    });

    result.push(object);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sheerToJson };

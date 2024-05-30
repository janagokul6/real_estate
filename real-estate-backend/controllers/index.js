/* This API method reneders the sample/dummy home page usin EJS */
const homePage = async (req, res, next) => {
  try {
    res.render("index", { title: "Dashboard" });
  } catch (error) {
    console.log("Error while fetching the details of the user : ", error);
    return res
      .status(500)
      .json({ message: "Failed to load the Home Page", error });
  }
};

module.exports = {
  homePage,
};

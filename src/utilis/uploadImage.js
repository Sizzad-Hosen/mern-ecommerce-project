import SummaryApi from "@/common/SummaryApi";
import Axios from "../utilis/Axios.js";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image); // Assuming image is in req.file

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
    });

    return response; // Return the response from the API to handle it later
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error; // Throw the error to be handled in the calling function
  }
};

export default uploadImage;

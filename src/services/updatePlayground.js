import apiConfig from "../configs/axios";
import logger from "../helpers/logger";

const updatePlayground = async (body, id) => {
  try {
    const { data } = apiConfig().patch(`/v1/playground/${id}`, body);
    return data;
  } catch (error) {
    logger("Update Playground",error);
    throw error;
  }
}

export default updatePlayground;
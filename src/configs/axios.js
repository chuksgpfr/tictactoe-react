import Axios from "axios";
import { HEADERS, API_ROOT } from "../constants/index";

const apiConfig = () => {
  return Axios.create({
    headers: HEADERS,
    baseURL: API_ROOT
  })
}

export default apiConfig;
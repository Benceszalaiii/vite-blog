import { getApiUrl } from "../api";
import { getToken } from "../store";

export const handleDelete = async (id: string) => {
  const disconnect = () => {
    window.location.search = "";
  };
  if (!id || isNaN(parseInt(id))) {
    return disconnect();
  }
  if (confirm("Biztosan törölni szeretnéd a posztot?")) {
    await fetch(`${getApiUrl()}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }
  return disconnect();
};

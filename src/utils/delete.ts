import { getApiUrl } from "../api";
import { getToken } from "../store";

export const handleDelete = async (id: string, destination?: string) => {
  const disconnect = (success?: boolean) => {

    if (destination) {
      if (success === undefined)
        window.location.replace(destination);
      else
        window.location.replace(`/?${success ? "success=delete" : "error=delete"}#/${destination}`);

      return;
    }

    if (success === undefined)
      window.location.search = "";
    else
      window.location.search = success ? "success=delete" : "error=delete";
  };
  if (!id || isNaN(parseInt(id))) {
    return disconnect(false);
  }
  if (confirm("Biztosan törölni szeretnéd a posztot?")) {
    const response = await fetch(`${getApiUrl()}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return disconnect(response.ok);
  }
  return disconnect();
};

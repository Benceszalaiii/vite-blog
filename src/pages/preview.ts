import { Post } from "../types";
import { renderPost } from "./post"

export const renderPreview = async (container: HTMLElement, data: Post) => {
    renderPost(container, data, true);
}
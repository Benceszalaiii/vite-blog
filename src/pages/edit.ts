import { renderNavbar, attachNavbarEvents } from "../components/navbar";
import { getToken, getUser, isLoggedIn } from "../store";
import { fetchCategories, fetchPost, getApiUrl } from "../api";
import { Category, Post } from "../types";
import { renderPreview } from "./preview";

const notFoundPage = ({
  message,
  errorCode = "404 - Az oldal nem található",
}: {
  message: string;
  errorCode: string;
}) => {
  return `
    <main>
    ${renderNavbar()}
    <section class="min-h-[80vh] gap-4 flex flex-col items-center justify-center">
    <h1 class="text-red-500 font-bold text-2xl">${errorCode}</h1>
    <p class="text-lg">${message}</p>
    </section>
    </main>
    `;
};

export const renderEditPage = async (container: HTMLElement, slug?: string) => {
  if (!isLoggedIn()) {
    window.location.hash = "#/login";
    return;
  }

  const user = getUser();
  if (!user || (user?.role !== "admin" && user?.role !== "adminisztrator")) {
    window.location.hash = "#/";
    return;
  }

  if (!slug || isNaN(parseInt(slug))) {
    container.innerHTML = notFoundPage({
      message: `Nincs megadva azonosító: ${slug}`,
      errorCode: `400 - Rossz kérés`,
    });
    return;
  }
  const postSlug = parseInt(slug);
  const post = await fetchPost(postSlug);

  if (!post) {
    container.innerHTML = notFoundPage({
      message: `A keresett blog nem létezik ${postSlug} azonosítóval`,
      errorCode: `404 - Nem található`,
    });
    return;
  }
  let currentData: Post = {
    cim: post.cim,
    boritekep: post.boritekep,
    kivonat: post.kivonat,
    tartalom: post.tartalom,
    categoryId: post.categoryId,
    datum: post.datum,
    kiemelt: post.kiemelt,
    id: post.id,
    szerzo: post.szerzo,
  };
  const categories = await fetchCategories();
  let categoriesMap: Map<number, Category> = new Map();
  categories.forEach((cat) => categoriesMap.set(cat.id, cat));

  container.innerHTML = `
    <main>
    <div id="preview" class="hidden fixed top-12 w-full h-screen bg-black/50 z-50"></div>
    ${renderNavbar()}
    <form id="editForm" class="max-w-4xl border rounded-lg p-4 border-neutral-300/30 shadow-inner mx-auto my-4 flex flex-col gap-4" action="">
    <h2 class="text-2xl font-bold">Blogbejegyzés szerkesztése</h2>
    <label class=" mb-2" for="title">Cím</label>
    <input required class=" mb-2 w-full border border-neutral-400/30 rounded-sm" type="text" id="title" name="title" value="${currentData.cim}" />
    <label class=" mb-2" for="imageUrl">Borítókép</label>
    <img id="imagePreview" src="${currentData.boritekep}" alt="${currentData.cim}" loading="lazy" class="h-44 aspect-auto rounded-lg w-fit" />
    <input required id="imageUrl" class="block mb-2 w-full border border-neutral-400/30 rounded-sm " type="text" id="image" name="image" value="${currentData.boritekep}" />
    <label class=" mb-2" for="category">Kategória</label>
    <select required name="category" id="category" class=" mb-2 w-1/3 border border-neutral-400/30 rounded-sm">
    </select>
    <div class="flex flex-row gap-4 items-center justify-start">
    <label class="text-lg" for="featured">Kiemelt</label>
    <input type="checkbox" class="w-fit" id="featured" name="featured" ${currentData.kiemelt ? "checked" : ""} />
    </div>
    <label class=" mb-2 " for="excerpt">Kivonat</label>
    <input required class=" mb-2 w-full border border-neutral-400/30 rounded-sm" type="text" id="excerpt" name="excerpt" value="${currentData.kivonat}" />
    <label class=" mb-2" for="content">Tartalom</label>
    <textarea class=" mb-2 w-full border border-neutral-400/30 rounded-sm  h-[20vh]" id="content" name="content">${currentData.tartalom}</textarea>
    <div class="flex flex-row justify-end w-full gap-4">
    <button id="saveBtn" class=" bg-violet-700 hover:bg-violet-800 mb-2 w-fit px-8 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer" type="submit">Mentés</button>
    <button id="previewBtn" type="button" class="bg-emerald-700 hover:bg-emerald-800 mb-2 w-fit px-8 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer">Előnézet</button>
    <button id="deleteBtn" class=" bg-red-700 hover:bg-red-800 mb-2 w-fit px-6 py-2 bg-primary-color text-white rounded-md hover:opacity-80 transition-all cursor-pointer" type="submit">Törlés</button>
    </div>
    </form>
    </main>
    `;

  const categorySelect = document.getElementById(
    "category",
  ) as HTMLSelectElement;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id.toString();
    option.textContent = cat.name;
    if (currentData.categoryId === cat.id) option.selected = true;
    categorySelect.appendChild(option);
  });

  const formElement = document.getElementById("editForm") as HTMLFormElement;
  formElement.addEventListener("input", (e) => {
    const target = e.currentTarget as HTMLFormElement;
    const formData = new FormData(target);
    formData.forEach((value, key) => {
      switch (key) {
        case "title":
          currentData.cim = value.toString();
          break;
        case "image":
          currentData.boritekep = value.toString();
          break;
        case "category":
          currentData.categoryId = parseInt(value.toString());
          break;
        case "featured":
          currentData.kiemelt = value === "on";
          break;
        case "excerpt":
          currentData.kivonat = value.toString();
          break;
        case "content":
          currentData.tartalom = value.toString();
          break;
      }
    });
  });
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("help")

    const response = await fetch(`${getApiUrl()}/posts/${currentData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(currentData),
    });

    console.log(response);
    if (response.ok) {
      window.location.replace("/?success#/dashboard");
    }
  });

  const input = document.getElementById("imageUrl") as HTMLInputElement;
  const imagePreview = document.getElementById(
    "imagePreview",
  ) as HTMLImageElement;
  input.addEventListener("input", () => {
    imagePreview.src = input.value;
  });

  const closePreview = () => {
    document.body.style.overflow = "auto";
    previewDiv.classList.remove("flex");
    previewDiv.classList.add("hidden");
  };
  const openPreview = () => {
    document.body.style.overflow = "hidden";
    previewDiv.classList.remove("hidden");
    previewDiv.classList.add("flex");
  };

  const previewBtn = document.querySelector('button[type="button"]');
  const previewDiv = document.getElementById("preview") as HTMLDivElement;
  previewBtn?.addEventListener("click", async () => {
    previewDiv.innerHTML = `
        <div class="w-full max-w-7xl h-[75vh] mt-[10vh] rounded-lg p-12">
        <section id="preview-container" class="w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full aspect-video pretty-scrollbar overflow-y-scroll overflow-x-hidden bg-(--bg-color) shadow-inner">
        </section>
        <button id="close-preview" class="text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg py-2 px-4 transition-colors fixed bottom-8 z-100 right-8 cursor-pointer">Bezárás</button>
        </div>
        `;

    const previewContainer = document.getElementById(
      "preview-container",
    ) as HTMLDivElement;

    await renderPreview(previewContainer, currentData);

    const closePreviewBtn = document.getElementById("close-preview");
    closePreviewBtn?.addEventListener("click", () => {
      closePreview();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePreview();
      }
    });

    openPreview();
  });

  window.addEventListener("hashchange", () => {
    document.body.style.overflow = "auto";
  });

  attachNavbarEvents();
};

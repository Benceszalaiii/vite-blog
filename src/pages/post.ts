import { fetchCategories, fetchPost } from "../api";
import { attachNavbarEvents, renderNavbar } from "../components/navbar";
import { Post } from "../types";

const notFoundPage = ({message, errorCode = "404 - Az oldal nem található"} : {message: string, errorCode: string}) => {
    return `
    <main>
    ${renderNavbar()}
    <section class="min-h-[80vh] gap-4 flex flex-col items-center justify-center">
    <h1 class="text-red-500 font-bold text-2xl">${errorCode}</h1>
    <p class="text-lg">${message}</p>
    </section>
    </main>
    `;
}
type IdOrPost =
  | number
  | Post;
export const renderPost = async (container: HTMLElement, data: IdOrPost, preview: boolean = false) => {
    const post = typeof data === "number" ? await fetchPost(data) : data;
    if (!post) {
      container.innerHTML = notFoundPage({message: `A keresett blog nem létezik ${data} azonosítóval`, errorCode: `404 - Nem található`});
      return;
    }
    const category = (await fetchCategories()).find((x)=> x.id === post.categoryId);
    container.innerHTML = `
    ${preview ? "" : renderNavbar()}
     <div style="position: relative; height: 80vh; background-image: url(${post.boritekep}); background-repeat: no-repeat; background-position: center; background-size: cover; display: flex; align-items: flex-end;">
      <div style="max-width: 80rem; margin: 0 auto; z-index: 10; position: relative; display: grid; grid-template-columns: 1fr 48rem 1fr; color: white; padding-bottom: 2rem;">
        <div style="grid-column: 2 / span 2;">
          <div style="text-transform: uppercase; font-size: 1.275rem; margin-bottom: 0rem;">
            ${
            category?.name
            }
          </div>

          <div>
            <h1 style=" font-size: 3rem; ">${post.cim}</h1>
            <p style="margin-bottom: 1.5rem; font-size: 1.5rem;">${post.kivonat}</p>
          </div>

          <div style="display: flex; flex-direction: row; gap: 4rem;">

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                  <p style="font-size: 0.875rem;">Szerző</p>
                  <p>${post.szerzo}</p>
                </div>
              </div>
            
              <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                <p style="font-size: 0.875rem;">Megjelenés dátuma</p>

                <time datetime="${post.datum}">${post.datum}</time>
              </div>
            
          </div>
        </div>
      </div>
      <div style="min-height: 80vh; width: 100%; user-select: none;">
 <div style="position: absolute; pointer-events: none; left: 0; bottom: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);" />
      </div>
    </div>
    </div>
    <section style="color: white; padding-top: 2rem; padding-bottom: 6rem; margin-right: 20%; margin-left: 20%; font-weight: semibold; text-align: justify; font-size: 1.5rem; margin-top: 12px;">
    ${post.tartalom}
    </section>
  `;
  attachNavbarEvents();
}
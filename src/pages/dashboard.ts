import { renderNavbar } from "../components/navbar"

export const renderDashboard = (container: HTMLElement) => {
    container.innerHTML = `
    ${renderNavbar()}
    <h2>Vezérlőpult hamarosan...</h2>
    `
}
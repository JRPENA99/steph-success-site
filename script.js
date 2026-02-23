document.getElementById("year").textContent = new Date().getFullYear();



document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");
  const closeBtn = document.querySelector(".pdf-close");

  if (!modal || !viewer || !closeBtn) {
    console.log("Modal elements missing:", { modal, viewer, closeBtn });
    return;
  }

  function openModal(pdfPath) {
    viewer.src = pdfPath;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    viewer.src = "";
    document.body.style.overflow = "";
  }

  // ✅ This catches clicks even if cards are loaded/changed later
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.open-pdf");
    if (!link) return;

    e.preventDefault();
    const pdf = link.getAttribute("data-pdf");
    if (!pdf) return;

    openModal(pdf);
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
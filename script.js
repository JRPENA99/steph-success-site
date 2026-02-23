document.getElementById("year").textContent = new Date().getFullYear();
const modal = document.getElementById("pdfModal");
const viewer = document.getElementById("pdfViewer");
const closeBtn = document.querySelector(".pdf-close");

document.querySelectorAll(".open-pdf").forEach(link => {
  link.addEventListener("click", function(e){
    e.preventDefault();
    viewer.src = this.dataset.pdf;
    modal.style.display = "flex";
  });
});

function closeModal(){
  modal.style.display = "none";
  viewer.src = "";
}

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function(e){
  if(e.target === modal){
    closeModal();
  }
});
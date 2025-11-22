function showDialog(htmlContent = "") {
  const dialogBox = document.querySelector(".dialog-box");
  if (dialogBox) {
    dialogBox.innerHTML = htmlContent += 
    `<button onclick="hideDialog()" class="ui-btn">关闭</button>`;  // 设置动态内容
  }
  document.querySelector(".dialog-backdrop").style.display = "flex";
}

function hideDialog() {
  document.querySelector(".dialog-backdrop").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="dialog-backdrop" onclick="hideDialog()">
      <div class="dialog-box md-typeset" onclick="event.stopPropagation()"></div>
    </div>
  `);
});

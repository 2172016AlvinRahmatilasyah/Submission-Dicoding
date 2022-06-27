document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("bookSubmit");
    submitButton.addEventListener("click", function (event) {
      event.preventDefault();
      addBuku();
      window.alert("Buku baru telah ditambahkan ke rak");
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function addBuku() {
    const textJudul = document.getElementById("inputBookTitle").value;
    const textPenulis = document.getElementById("inputBookAuthor").value;
    const textTahun = document.getElementById("inputBookYear").value;
    const generatedID = generateId();
    const bukuObject = generateBukuObject(generatedID, textJudul, textPenulis, textTahun, false);
    buku.push(bukuObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function generateId() {
    return +new Date();
}
  
function generateBukuObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
}

const buku = [];
const RENDER_EVENT = "render-buku"; 

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBUKUList = document.getElementById("buku");
    uncompletedBUKUList.innerHTML = "";
    const completedBUKUList = document.getElementById("completeBookshelfList");
    completedBUKUList.innerHTML = "";
    for (const bukuItem of buku) {
      const bukuElement = makeBuku(bukuItem);
      if (!bukuItem.isCompleted) uncompletedBUKUList.append(bukuElement);
      else completedBUKUList.append(bukuElement);
    }
});
  
function makeBuku(bukuObject) {
    const textJudul = document.createElement("h3");
    textJudul.innerText = bukuObject.title;
    const textPenulis = document.createElement("p");
    textPenulis.innerText = bukuObject.author;
    const textTahun = document.createElement("p");
    textTahun.innerText = bukuObject.year;
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textJudul, textPenulis, textTahun);
    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `buku-${bukuObject.id}`);
    if (bukuObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");
      undoButton.addEventListener("click", function () {
        undoBukuFromCompleted(bukuObject.id);
      });
      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");
      trashButton.addEventListener("click", function () {
        removeBukuFromCompleted(bukuObject.id);
      });
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");
      checkButton.addEventListener("click", function () {
        addBukuToCompleted(bukuObject.id);
      });
      container.append(checkButton);
    }
    return container;
}
  
function findBuku(bukuId) {
    for (const bukuItem of buku) {
      if (bukuItem.id === bukuId) {
        return bukuItem;
      }
    }
    return null;
}
  
function addBukuToCompleted(bukuId) {
    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null) return;
    bukuTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah selesai dibaca");
}

function removeBukuFromCompleted(bukuId) {
    const bukuTarget = findBukuIndex(bukuId);
    if (bukuTarget === -1) return;  
    buku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah dihapus");
}
  
function undoBukuFromCompleted(bukuId) {
    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null) return;
    bukuTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku dibaca ulang");
}
 
function findBukuIndex(bukuId) { 
    for (const index in buku) {
      if (todos[index].id === bukuId) {
        return index;
      }
    }
    return -1;
}
  
function saveData() { 
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
  
const SAVED_EVENT = "saved-buku"; 
const STORAGE_KEY = "BUKU_APPS"; 

function isStorageExist() {  
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
}
  
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
  
function loadDataFromStorage() {  
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
      for (const bukuu of data) {
        buku.push(bukuu);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
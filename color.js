const form = document.querySelector("form.option-form");

const preList4 = JSON.parse(localStorage.getItem("list4"));
const preList2 = JSON.parse(localStorage.getItem("list2"));
let op = Number(localStorage.getItem("op")) || 100;

if (preList4 && preList2) {
  coloring(preList4, preList2);
  const inputList4 = document.querySelectorAll(".set4-ul input[type='text']");
  const inputList2 = document.querySelectorAll(".set2-ul input[type='text']");
  console.log(inputList4);
  inputList4.forEach((el, i) => {
    console.log(el);
    el.value = preList4[i];
  });
  inputList2.forEach((el, i) => {
    el.value = preList2[i];
  });
  console.log(inputList4);
}

form.addEventListener("submit", (el) => {
  op = el.target.op.value;
  localStorage.setItem("op", op);
  const colorList = {
    red: "#FF0000",
    purple: "#7F00FF",
    orange: "#0080FF",
    yellow: "#FFFF33",
    blue: "#0000FF",
    white: "#FFFFFF",
    green: "#00FF00",
    pink: "#FF99FF",
    skyblue: "#33FFFF",
    lavender: "#E5CCFF",
    lightgreen: "#CCFF99",
  };
  el.preventDefault();
  const color4List = new Array(6);
  for (let i = 0; i < 6; i++) {
    const en = "ABCDEF"[i];
    let value;
    if (el.target["colorText" + en].value) {
      console.log("hihi");
      value = el.target["colorText" + en].value;
    }
    if (el.target["color" + en].value) {
      value = colorList[el.target["color" + en].value];
    }
    color4List[i] = value;
  }

  const color2List = new Array(4);
  for (let i = 0; i < 4; i++) {
    const en = "abcd"[i];
    let value;
    if (el.target["colorText" + en].value) {
      console.log("hihi");
      value = el.target["colorText" + en].value;
    }
    if (el.target["color" + en].value) {
      value = colorList[el.target["color" + en].value];
    }
    color2List[i] = value;
  }
  console.log(color4List);
  localStorage.setItem("list4", JSON.stringify(color4List));
  localStorage.setItem("list2", JSON.stringify(color2List));
  coloring(color4List, color2List);

  const inputList4 = document.querySelectorAll(".set4-ul input[type='text']");
  const inputList2 = document.querySelectorAll(".set2-ul input[type='text']");
  console.log(inputList4);
  inputList4.forEach((el, i) => {
    console.log(el);
    el.value = color4List[i];
  });
  inputList2.forEach((el, i) => {
    el.value = color2List[i];
  });
  console.log(el.target.on.value);
  if (el.target.on.value == "on") {
    document.querySelectorAll(".subject-sch").forEach((el) => {
      if (!el.classList.contains("not-today")) el.classList.add("not-today");
    });
  } else {
    document.querySelectorAll(".subject-sch").forEach((el) => {
      if (el.classList.contains("not-today")) el.classList.toggle("not-today");
    });
  }
});
function coloring(color4List, color2List) {
  document.querySelectorAll(".bch").forEach((el) => {
    if (!isNaN(Number(op)) && op <= 100 && op >= 20) el.style.opacity = op / 100.0;
  });
  for (let i = 0; i < 6; i++) {
    console.log(document.querySelectorAll("." + "ABCDEF"[i] + ">div"));
    document.querySelectorAll("." + "ABCDEF"[i]).forEach((el) => {
      el.style.backgroundColor = color4List[i] + "33";
    });
    document.querySelectorAll(".set4-ul .current-color")[i].style.color = color4List[i];
  }
  for (let i = 0; i < 4; i++) {
    document.querySelectorAll("." + ["AA", "BB", "CC", "DD"][i]).forEach((el) => {
      el.style.backgroundColor = color2List[i] + "80";
      document.querySelectorAll(".set2-ul .current-color")[i].style.color = color2List[i];
    });
  }
}

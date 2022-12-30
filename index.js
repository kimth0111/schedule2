location.href = "https://kimth0111.github.io/schedule2.5/"


const schedule = [
  ["E", "E", "C", "B", "A"],
  ["C", "A*", "A", "B*", "D*"],
  ["B", "C", "C*", "C", "D"],
  ["A", "A", "B*", "E", "F"],
  ["D*", "F", "E", "F", "창"],
  ["D", "B", "F", "C*", "창"],
  ["A*", "D", "B", "D", "창"],
];
const health = {
  "1D": "운동1",
  "2D": "보건2",
  "1A": "보건1",
  "2A": "운동2",
  "1C": "보건1",
  "2C": "운동2",
  "1B": "운동1",
  "2B": "보건2",
}; // 체육과 보건중 먼저나오는 세트

let number = localStorage.getItem("number") | "";
if (list4[number]) {
  draw();
  document.querySelector("#back").style.backgroundImage = "url(" + number + ".jpg" + ")";
}
document.querySelector("form").addEventListener("submit", (el) => {
  el.preventDefault();
  number = el.target.number.value;
  if (number.length == 4) number = number[0] + "0" + number[1] + number[2] + number[3];
  console.log();
  if (!list2[number]) {
    const a = Object.keys(student).filter((el) => {
      return student[el] == number;
    });
    if (a[0]) number = a[0];
    else return;
    console.log(number);
  }
  localStorage.setItem("number", number);
  draw();
});

function draw() {
  const set4 = document.querySelectorAll(".set4-tr td");
  const set2 = document.querySelectorAll(".set2-tr td");
  const subject2 = document.querySelectorAll(" .subject2-tr td");
  const subject4 = document.querySelectorAll(" .subject4-tr td");
  const teacher4 = document.querySelectorAll(".teacher4-tr td");
  const teacher2 = document.querySelectorAll(".teacher2-tr td");

  document.querySelector(".name").innerHTML = number + " / 이름: " + student[number];

  //4단위
  subject4.forEach((sub, index) => {
    sub.innerHTML = list4[number][set4[index].innerText];
  });
  teacher4.forEach((tch, index) => {
    const a = whoTeacher(subject4[index].innerText, set4[index].innerText);
    tch.innerHTML = "<span>" + a + "</span>" + "<br/>" + where[a];
  });
  //2단위
  subject2.forEach((sub, index) => {
    if (list2[number][set2[index].innerText]) sub.innerHTML = list2[number][set2[index].innerText];
  });
  teacher2.forEach((tch, index) => {
    if (list2[number][set2[index].innerText])
      tch.innerHTML =
        "<span>" +
        whoTeacher(subject2[index].innerText, set2[index].innerText) +
        "</span>" +
        "<br/>" +
        where[whoTeacher(subject2[index].innerText, set2[index].innerText)];
  });

  const scheTr = document.querySelectorAll("#own-schedule tr");
  let now = new Date();
  let day = now.getDay();
  let healthCnt = 0;
  scheTr.forEach((tr, i) => {
    if (i != 0) {
      const td = tr.querySelectorAll("td");
      td.forEach((td, j) => {
        if (j != 0) {
          let a = schedule[i - 1][j - 1];
          if (a.length == 1) {
            if (list4[number][a]) {
              const div = document.createElement("div");
              div.innerHTML = list4[number][a] + "<br/>" + "(" + whoTeacher(list4[number][a], a) + "T)";
              div.title = "위치: " + where[whoTeacher(list4[number][a], a)];
              td.innerText = "";
              td.append(div);
              td.classList.add(a);
              if (day == j) td.classList.add("today");
            }
          }
          if (a.length == 2) {
            a = a.replace("*", "");
            if (list2[number][a][1] == "건") {
              let subH;
              if (healthCnt++ == 0) subH = health[list2[number][a][list2[number][a].length - 1] + a];
              else {
                subH = list2[number][a]
                  .replace("&", "")
                  .replace(health[list2[number][a][list2[number][a].length - 1] + a], "");
              }
              const div = document.createElement("div");
              div.innerHTML = subH + "<br/>" + "(" + whoTeacher(subH, a) + "T)";
              div.title = "위치: " + where[whoTeacher(subH, a)];
              td.innerText = "";
              td.append(div);
              if (day == j) td.classList.add("today");
            } else if (list2[number][a]) {
              td.innerHTML = list2[number][a] + "<br/>" + "(" + whoTeacher(list2[number][a], a) + "T)";
              td.title = "위치: " + where[whoTeacher(list2[number][a], a)];
              if (day == j) td.classList.add("today");
            }
            td.classList.add(a + a);
          }
        }
      });
    }
  });
}

function whoTeacher(sub, set) {
  if (teacher[sub]) return teacher[sub];
  if (teacher[sub + set]) return teacher[sub + set];
  console.log("errrrrorrrrr", sub, set);
  return undefined;
}

//Object.keys(list4).forEach(key=>{
//number = key;
//draw();
//})

const remainTime = document.querySelector("#hi");

function diffDay() {
  let masTime = new Date("2023-3-23");
  if (number == 20807) {
    masTime = new Date("2023-7-31");
  }
  const todayTime = new Date();

  const diff = masTime - todayTime;

  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const diffMin = Math.floor((diff / (1000 * 60)) % 60);
  const diffSec = Math.floor((diff / 1000) % 60);
  const diffMS = Math.floor((diff / 100) % 60);

  if (number == 20807) {
    remainTime.innerText = `사관까지 ${diffDay}일${diffHour}시간${diffMin}분${diffSec}초`;
  } else {
    remainTime.innerText = `3모까지 ${diffDay}일${diffHour}시간${diffMin}분${diffSec}초`;
  }
}

diffDay();
setInterval(diffDay, 1000);

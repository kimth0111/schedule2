const sdCode = "N10"; //교육청 코드
const scCode = "8140085"; //학교 코드
const toFindYear = "2022"; //찾을 년도

const url = `ATPT_OFCDC_SC_CODE=${sdCode}&SD_SCHUL_CODE=${scCode}&MLSV_YMD=${toFindYear}`; //요청할 url

let mealList = []; //급식표를 담는 배열

//Date객체로 오늘의 날짜 정보 저장
const date = new Date();
const today = {
  year: parseInt(date.getFullYear()),
  date: parseInt(date.getDate()),
  month: date.getMonth() + 1,
};

let currentDate = {...today};
let plusDate=0;

let mealCnt = {};

mealList = JSON.parse(localStorage.getItem("meal-list"));
if(!mealList){
	getData();
} else{
	getCnt(today);
	getList(today);
}

function getData(re=false, dateJson=today){
	drawList({
    dateJson,
    list:[["로딩중..."],["로딩중..."],["로딩중..."]],
  });
	
	//fetch로 api에 요청하여 급식데이터 가져오기
	fetch(
	  "https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=981b2e196a364ee7b2223e11f375de26&Type=json&pSize=1000&" +
		 url
	)
  .then((res) => res.json()) // 응답 데이터를 json화
  .then((myJson) => {
	localStorage.setItem("meal-list", JSON.stringify(myJson["mealServiceDietInfo"][1].row));
    mealList = myJson["mealServiceDietInfo"][1].row; // 받은 데이터에서 필요한 급식데이터만 추출
	 getCnt(dateJson);
    getList(dateJson, re);
  });	
}

function getList(dateJson, re=false) {
  // 날짜를 받고 그 날짜의 급식 데이터를 반환
  /* dateJson 형식
	{
		year:2022,
		date:05,
		month:11,
	}
	*/
  let { year, date, month } = dateJson;

  let list = [];

  //자리수 맞춰주기 ex) 5월 --> 05월
  date = date < 10 ? "0" + date : date;
  month = month < 10 ? "0" + month : month;

  let dateStr = "" + year + month + date; // 문자열로 변환 ex) 2022년05월22일 --> 20220522

  list = mealList.filter((el) => {
    return el.MLSV_YMD == dateStr;
  }); //mealList의 객체들중 MLSV_YMD란 값이 dateStr과 같은 객체만 반환하여 배열 생성

  for (let i = 0; i < 3; i++) {
    //급식 정보가 없다면
    if (!list[i]) {
      list[i] = ["급식정보가 없습니다!"];
		if(!re)
		{
			getData(true, dateJson);
			return;
		}
      continue;
    }
    list[i] = list[i].DDISH_NM.split("<br/>"); // ex) "백미밥<br/>김치" --> ["백미밥", "김치"]
  }

  //급식표 그리기
  drawList({
    dateJson,
    list,
  });
}

//html에 급식표 그리기 <-- 자유롭게 수정
function drawList({ dateJson, list }) {
  const mealHtmlList = document.querySelectorAll(
    ".meal-container>div"
  );
  for (let i = 0; i < 3; i++) {
    const divList = document.createElement("div");
	  
      const div = document.createElement("div");
	  div.classList = "meal-title";
	  div.innerText = ["아침","점심", "저녁"][i]
      divList.appendChild(div);
    for (let j = 0; j < list[i].length; j++) {
      const div = document.createElement("div");
		 const a = list[i][j].replace("(","").replace(")","").replace(/\./g,"").replace(/[0-9]/g,"");
      div.innerHTML = a;
		 if(mealCnt[a])
		 	div.title = "올해의 " + mealCnt[a] + "번째 " + a;
		 const br = document.createElement("br");
		 if(plusDate==44)
			 div.style.color = "red";
      divList.appendChild(div);
    }
    mealHtmlList[i].innerHTML = "";
    mealHtmlList[i].appendChild(divList);
  }
	if( plusDate <= 2)
	document.querySelector(".date").innerHTML = ["오늘","내일","모레"][plusDate]+"의 급식"+"("+getDay(dateJson)+")"
	else if (plusDate >=3 && plusDate <= 43)
		document.querySelector(".date").innerHTML = plusDate+"일 후의 급식"+"("+getDay(dateJson)+")"
	else if( plusDate == 44){
		document.querySelector(".date").innerHTML = plusDate+"일 후의 급식"+"("+getDay(dateJson)+")"
		document.querySelector(".date").style.color = "red";
	}
		
}

function getCnt(dateJson){
  let { year, date, month } = dateJson;

  //자리수 맞춰주기 ex) 5월 --> 05월
  date = date < 10 ? "0" + date : date;
  month = month < 10 ? "0" + month : month;

  let dateStr = "" + year + month + date; // 문자열로 변환 ex) 2022년05월22일 --> 20220522
	mealCnt = {};
	mealList.forEach((meal)=>{
		if(Number(meal.MLSV_YMD)>=20220301 && Number(meal.MLSV_YMD) <= Number(dateStr)){
			meal.DDISH_NM.split("<br/>").forEach((el)=>{
				const a = el.replace("(","").replace(")","").replace(/\./g,"").replace(/[0-9]/g,"");
				if(mealCnt[a]) mealCnt[a] = mealCnt[a] +1;
				else  mealCnt[a] = 1;
			})
		} 
	})
}

document.querySelector("button.tomorrow").addEventListener("click",()=>{
	if(plusDate >=44) return;
	plusDate++;
	currentDate.date = today.date + plusDate;
	const lastDate =  (new Date(currentDate.year, currentDate.month, 0)).getDate()
;
	if(currentDate.date > parseInt(lastDate)){
		currentDate.date = currentDate.date-lastDate;
		currentDate.month = date.getMonth() + 2;
		if(currentDate.month>12)
			currentDate.month=1;
	}
	getList(currentDate);
	getCnt(currentDate);
})

document.querySelector("button.yesterday").addEventListener("click",()=>{
	if(plusDate <=0) return;
	plusDate--;
	currentDate.date = today.date + plusDate;
	const lastDate = (new Date(currentDate.year, currentDate.month, 0)).getDate();
	if(currentDate.date > parseInt(lastDate)){
		currentDate.date = currentDate.date-lastDate;
		currentDate.month = date.getMonth() + 2;
		if(currentDate.month>12)
			currentDate.month=1;
	}
	getList(currentDate);
	getCnt(currentDate);
})

function getDay(dateJson){ //날짜문자열 형식은 자유로운 편
	
    var week = ['일', '월', '화', '수', '목', '금', '토'];

    var dayOfWeek = week[new Date(dateJson.year, dateJson.month-1, dateJson.date).getDay()];

    return dayOfWeek;
}

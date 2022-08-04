const sdCode = "N10"; //교육청 코드
const scCode = "8140085"; //학교 코드
const toFindYear = "2022"; //찾을 년도

const url = `ATPT_OFCDC_SC_CODE=${sdCode}&SD_SCHUL_CODE=${scCode}&MLSV_YMD=${toFindYear}`; //요청할 url

let mealList = []; //급식표를 담는 배열

//Date객체로 오늘의 날짜 정보 저장
const date = new Date();
const today = {
  year: date.getFullYear(),
  date: parseInt(date.getDate()),
  month: date.getMonth() + 1,
};

mealList = JSON.parse(localStorage.getItem("meal-list"));
if(!mealList){
	getData();
} else{
	getList(today);
}
console.log(mealList);

function getData(re=false){
	
	//fetch로 api에 요청하여 급식데이터 가져오기
	fetch(
	  "https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=981b2e196a364ee7b2223e11f375de26&Type=json&pSize=1000&" +
		 url
	)
  .then((res) => res.json()) // 응답 데이터를 json화
  .then((myJson) => {
	if(mealList!=myJson["mealServiceDietInfo"][1].row)
		localStorage.setItem("meal-list", JSON.stringify(myJson["mealServiceDietInfo"][1].row));
    mealList = myJson["mealServiceDietInfo"][1].row; // 받은 데이터에서 필요한 급식데이터만 추출
    getList(today, re);
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
			getData(true);
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
  console.log(mealHtmlList);
  for (let i = 0; i < 3; i++) {
    const divList = document.createElement("div");
	  
      const div = document.createElement("div");
	  div.classList = "meal-title";
	  div.innerText = ["아침","점심", "저녁"][i]
      divList.appendChild(div);
    for (let j = 0; j < list[i].length; j++) {
      const div = document.createElement("div");
      div.innerHTML = list[i][j].replace("(","").replace(")","").replace(/\./g,"").replace(/[0-9]/g,"");
		 const br = document.createElement("br");
      divList.appendChild(div);
    }
    mealHtmlList[i].innerHTML = "";
    mealHtmlList[i].appendChild(divList);
  }
}

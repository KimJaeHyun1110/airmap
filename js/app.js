let allItems = []; // 데이터를 저장할 배열

// 공공데이터 API 키 및 URL
const API_KEY = "JTsZUUaFx6y8w9jd35PcdP%2B5Ee6OGptiPXfRFcOGqJMlCTw%2BbJdx%2B0ibcvqt9GndQWc3dzRYDJH%2F%2BI06akjd%2Bw%3D%3D";
const API_URL = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";

// DOM 요소
const regionInput = document.getElementById("regionInput");
const searchBtn = document.getElementById("searchBtn");

// 지도 객체 초기화
const mapContainer = document.getElementById('map');
const mapOption = {
  center: new kakao.maps.LatLng(36.5, 127.5), // 대한민국 중심 좌표
  level: 13 // 확대 레벨
};
const map = new kakao.maps.Map(mapContainer, mapOption);
const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체

// 데이터 요청 및 마커 표시
async function fetchDustData() {
  try {
    let pageNo = 1; // 첫 번째 페이지부터 시작
    let totalCount = 1; // 처음에는 1로 설정

    // 페이지 번호에 따라 반복하며 데이터 요청
    while (allItems.length < totalCount) {
      const response = await fetch(`${API_URL}?sidoName=전국&returnType=json&pageNo=${pageNo}&numOfRows=100&serviceKey=${API_KEY}`);
      const data = await response.json();
      const items = data.response.body.items;

      if (items && items.length > 0) {
        allItems = allItems.concat(items); // 데이터를 배열에 추가
        totalCount = data.response.body.totalCount; // 전체 데이터 수 갱신
      }

      pageNo++; // 페이지 번호 증가
    }

    if (allItems.length > 0) {
      processDustData(allItems); // 모든 데이터 처리
    }
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
}

// 데이터 분석 및 지도에 마커 추가
function processDustData(items) {
  // PM10 농도 기준으로 오름차순 정렬 (미세먼지가 적은 순서대로)
  const sortedItems = items
    .filter(item => item.pm10Value && item.pm10Value !== '-')
    .sort((a, b) => a.pm10Value - b.pm10Value);  // 오름차순으로 정렬 (적은 순)

  // 전국 최저 미세먼지 농도 (1등)
  const lowest = sortedItems[0];  // 미세먼지가 가장 적은 곳 (1등)
  
  // 전국 최고 미세먼지 농도 (최후등)
  const highest = sortedItems[sortedItems.length - 1];  // 미세먼지가 가장 많은 곳 (꼴등)
  
  // 전국 중간 등수 미세먼지 농도
  const middleIndex = Math.floor(sortedItems.length / 2);
  const middle = sortedItems[middleIndex];  // 중간 등수의 측정소

  // 마커 추가 (각각의 정보와 등수 추가)
  addMarker(lowest, "blue", "전국 최저 미세먼지", sortedItems.indexOf(lowest) + 1);
  addMarker(highest, "red", "전국 최고 미세먼지", sortedItems.indexOf(highest) + 1);
  addMarker(middle, "green", "전국 중간 등수 미세먼지", sortedItems.indexOf(middle) + 1);
}

// 마커를 지도에 추가하는 함수
function addMarker(item, color, title, rank) {
  const searchQuery = `${item.sidoName} ${item.stationName}`; // 도시명 + 측정소명
  geocoder.addressSearch(searchQuery, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const position = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        zIndex: 999 // 마커 우선순위 설정
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px; font-size:12px; color:${color};">
                    <strong>${title}</strong><br>
                    ${item.sidoName} ${item.stationName}<br>
                    미세먼지: ${item.pm10Value}㎍/㎥<br>
                    ${rank}위
                  </div>`
      });
      infowindow.open(map, marker);
    }
  });
}

// 지역명 검색 기능
function searchRegion() {
  const input = regionInput.value.trim();
  if (!input) return alert("지역명을 입력해주세요.");

  // 저장된 데이터에서 검색한 지역 찾기
  const found = allItems.find(item => item.stationName.includes(input));

  if (found) {
    // 정렬된 데이터에서 검색한 지역의 등수를 계산
    const sortedItems = allItems
      .filter(item => item.pm10Value && item.pm10Value !== '-')
      .sort((a, b) => a.pm10Value - b.pm10Value); // 오름차순으로 정렬 (미세먼지가 적은 순)

    const rank = sortedItems.findIndex(item => item.stationName === found.stationName) + 1; // 등수 계산 (1부터 시작)

    // 주소 검색 후 좌표 얻기
    geocoder.addressSearch(found.stationName, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setCenter(position); // 검색한 지역으로 지도 중심 이동

        // 검색한 지역에 마커 추가
        addMarker(found, "gray", `${found.stationName}`, `${rank}위`);
      }
    });
  } else {
    alert("해당 지역의 데이터가 없습니다.");
  }
}

// 이벤트 리스너
searchBtn.addEventListener("click", searchRegion);

// 처음 데이터 불러오기
fetchDustData();

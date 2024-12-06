fetch("https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=%EC%84%9C%EC%9A%B8&pageNo=1&numOfRows=100&returnType=json&serviceKey=JTsZUUaFx6y8w9jd35PcdP%2B5Ee6OGptiPXfRFcOGqJMlCTw%2BbJdx%2B0ibcvqt9GndQWc3dzRYDJH%2F%2BI06akjd%2Bw%3D%3D&ver=1.0")
.then(response=>response.json())//json파일을 객체로 변환
.then(json=>{//객체 출력
    const data=json.response.body.items;
    document.querySelector("#result").innerHTML=data;
    console.log(data);
    /*
    let output='';
    json.forEach(item => {
        output+=`
            <h2>${student.name}</h2>
            <ul>
                <li>전공 : ${student.major}</li>
                <li>학년 : ${student.grade}</li>
            </ul>
            <hr>
        `;
    });
    document.querySelector("#result").innerHTML=output;*/
})
.catch(error=>console.log(error));

const lat = 35.1518;
const lng = 129.0457;

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표 - 부산
        level: 10 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 



//주소 검색도구
var geocoder = new kakao.maps.services.Geocoder();
// 주소로 좌표를 검색합니다
geocoder.addressSearch('서울특별시 구로구', function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
});   


// 마커 클러스터러를 생성합니다 
var clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
  minLevel: 5// 클러스터 할 최소 지도 레벨 
});

var positions = [
  {
    title: '<div style="padding:5px;font-size:0.9rem;">신라대</div>',
    latlng: new kakao.maps.LatLng(35.169190, 128.996851)    
  },
  {
    title: '<div style="padding:5px;font-size:0.9rem;">내차</div>',
    latlng: new kakao.maps.LatLng(35.169123, 128.995297)        
  },
  {
    title: '<div style="padding:5px;font-size:0.9rem;">도서관</div>',
    latlng: new kakao.maps.LatLng(35.167556, 128.997002)
  },
  {
    title: '<div style="padding:5px;font-size:0.9rem;">상경관</div>',
    latlng: new kakao.maps.LatLng(35.168093, 128.998407)
  }    ,
  {
    title: '<div style="padding:5px;font-size:0.9rem;">사범관</div>',
    latlng: new kakao.maps.LatLng(35.168776, 128.998026)
  }    ,
  {
    title: '<div style="padding:5px;font-size:0.9rem;">인문관</div>',
    latlng: new kakao.maps.LatLng(35.169190, 128.996851)
  }    ,
  {
    title: '<div style="padding:5px;font-size:0.9rem;">국제관</div>',
    latlng: new kakao.maps.LatLng(35.169190, 128.996851)
  }    ,
  {
    title: '<div style="padding:5px;font-size:0.9rem;">미술관</div>',
    latlng: new kakao.maps.LatLng(35.168365, 128.995084)
  }    
];

// 마커들을 모아놓을 변수
var markers = [];

for(let i = 0; i < positions.length; i++) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
      map: map,
      position: positions[i].latlng
  });

  markers.push(marker);   // 마커를 배열에 추가합니다

  var infowindow = new kakao.maps.InfoWindow( {
    content : positions[i].title   // 인포윈도우에 표시할 내용
  });

  // 마커에 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다 
  // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다

  // 마커에 마우스오버하면 makeOverListener() 실행
  kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));  
  // 마커에서 마우스아웃하면 makeOutListener() 실행
  kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));   
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);          
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}

clusterer.addMarkers(markers);
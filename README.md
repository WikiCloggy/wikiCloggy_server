# WikiCloggy_server

*기울어진 글* - 추가 예정


## User
user_code, avartar_path, name

### (Get) 모든 회원 정보 보기 (test 용도 : 데이터가 들어갔는지 확인할 때 사용)
  : `/api/user/show`


### (Get) 특정 user_code 의 정보 보기 (user_code = id)
  : `/api/user/details/$id` <br/>
	 ex) /api/user/details/hyeon <br/>**


### (Post) 해당 user_code의 Profile 정보 수정
  : `/api/user/profile/$id` <br/>
	 ex) /api/user/profile/hyeon <br/>
		{name : hyeongyeong, dog : [ name : puppy] } <br/>

### (Post) user_code profile 사진 path 설정
  : `/api/user/profile/files/:id` <br/>

### (Post) User create (필요 data : user_code, name, profile file)
  : `/api/user/`  <br/>
	ex) {user_code : hyeon} <br/>
    -> user code 존재할 시, user데이터 반환 or 서버 사용자 등록 <br/>

### (Web test) 웹으로 프로필 사진 test를 원할시 사용
  : `/api/user/upload` <br/>


추가 되어야 하는 코드 <br/>
1.


## Log
user_code, img_path, createdAt, *result*

### (POST) log 생성 (필요 data : user_code, log file, *result*)
  : `/api/log/` <br/>
    ex) {user_code : hyeon} <br/>
    -> user_code가 User DB에 존재할 시, log db에 해당 정보 저장 <br/>

### (POST) log 생성시 사용자 요청 파일 path 설정 (id = db 고유 id, log생성될 때 반한되는 db id )
  : `/api/log/files/:id` <br/>

### (DELETE) log 정보 삭제 (id = db id)
  : `/api/log/:id` <br/>

### (GET) 모든 log 정보 받아오기 (test 용도 : 데이터가 들어갔는지 확인할 때 사용)
  : `/api/log/show` <br/>

### (GET) 해당 user log 받아오기 (user = user_code)
  : `/api/log/list/:user` <br/>
    ex) /api/log/list/hyeon <br/>

### (GET) 해당 log detail 받아오기 (id = db id)
  : `/api/log/details/:id` <br/>
    ex) /api/log/details/0 <br/>

### (Web test) 웹으로 log create test를 원할시 사용
  : `/api/log/upload` <br/>

  추가 되어야 하는 코드 <br/>
  1.

## Board

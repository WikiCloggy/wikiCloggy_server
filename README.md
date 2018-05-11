# WikiCloggy_server


## User
user_code, avartar_path, name

### (Get) 모든 회원 정보 보기 (test 용도 : 데이터가 들어갔는지 확인할 때 사용)
  : /api/user/show


### (Get) user_code = id , 특정 user_code 의 정보 보기
  : /api/user/details/$id
	 ex) /api/user/details/hyeon


### (Post) 해당 user_code의 Profile 정보 수정
  : /api/user/profile/$id
	 ex) /api/user/profile/hyeon
		{name : hyeongyeong, dog : [ name : puppy] }

### (Post) user_code profile 사진 path 설정
  : /api/user/profile/files/:id

### (Post) user_code 정보를 data에 붙여서 새로만들기, User create
  : /api/user/
	ex) {user_code : hyeon}
    -> user code 존재할 시, user데이터 반환 or 서버 사용자 등록

### (Web test) 웹으로 프로필 사진 test를 원할시 사용
  : /api/user/upload


추가 되어야 하는 코드
1.

<hr/>

## Log

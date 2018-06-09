# WikiCloggy_server

## User
*완료* <br/>
user_code, avartar_path, name

### (Post) User create (필요 data : user_code, name, profile file)
  : `/api/user/`  <br/>
	ex) {user_code : hyeon} <br/>
    -> user code 존재할 시, user데이터 반환 or 서버 사용자 등록 <br/>

### (Post) Profile file upload
  : `/api/user/profile/files/:user_code` <br/>

### (Post) 해당 user_code의 Profile 정보 수정
  : `/api/user/profile/:user_code` <br/>
  	 ex) /api/user/profile/hyeon <br/>
  		{ name : hyeongyeong, dog : [ name : puppy] } <br/>

### (Get) 특정 user_code 의 정보 보기 (user_code = id)
  : `/api/user/details/:user_code` <br/>
	 ex) /api/user/details/hyeon <br/>


## User admin

### (Delete) User Delete (필요 data : db id) - Admin
  : `/api/user/admin/delete/:id`
### (Get) 모든 회원 정보 보기 (test 용도 : 데이터가 들어갔는지 확인할 때 사용)
  : `/api/user/admin/show`

### (Web test) 웹으로 프로필 사진 test를 원할시 사용 - Admin
  : `/api/user/admin/upload` <br/>


## Result  
**admin을 위한 URL - 키워드 생성할 때 사용** </br>
*추후 일정 : admin page 만들기 - keyword 관리하는 페이지 - 윤경담당(client)*<br/>
keyword, img[], analysis

### (POST) Create Keyword (Keyword, analysis, img[])
  : `/api/result/`<br/>

### (POST) ADD Files to Keyword
  : `/api/result/files/:id` <br/>

### (POST) Edit Keyword Informaion
  : `/api/result/admin/edit/:id`

### (DELETE) Delete Keyword
  : `/api/result/admin/delete/:id` <br/>

### (GET) Show All Keyword Info
  : `/api/result/admin/show`<br/>

### (Web test) 웹으로 keyword create
  : `/api/result/admin/upload` <br/>


## Keyword Admin page
*Web for admin*

### (Admin page)
  : `/client/home.html`

### (POST) Add keyword
  : `/client/add.html`

### (POST) Modify keyword
  : `/client/modify.html`

### (POST) Add & Check dataset from board
  : `/client/checkdataset.html`

## Query
*완료* <br/>
**사용자가 카메라를 사용하여 질문할 때 사용** <br/>
user_code, img_path, createdAt, result ID

### (POST) query log 생성 (필요 data : user_code, File)
  : `/api/log/` <br/>

### (POST) File path (id = db id)
  : `/api/log/files/:id` <br/>

### (DELETE) query log 정보 삭제 (id = db id)
  : `/api/log/delete/:id` <br/>

### (GET) 모든 user query log 받아오기 (user = user_code)
  : `/api/log/list/:user_code` <br/>
    ex) /api/log/list/hyeon <br/>

### (GET) 페이지당 5개의 user query log 받아오기 (user = user_code, page)
  : `/api/log/list/:user_code/:page` <br/>
    ex) /api/log/list/hyeon/1 <br/>

### (GET) 해당 log query detail 받아오기 (id = db id)
  : `/api/log/details/:id` <br/>
    ex) /api/log/details/0 <br/>

### (GET) 머리를 찾지 못했을 때 client로부터 방향을 가져옴
  : `/api/log/direction/:id/:type` <br/>
  type -> left or right <br/>
  id -> log id <br/>

## Query admin

### (GET) 모든 log 정보 받아오기 (test 용도 : 데이터가 들어갔는지 확인할 때 사용)
  : `/api/log/admin/show` <br/>

### (Web test) 웹으로 log create test를 원할시 사용
  : `/api/log/admin/upload` <br/>


## Board
title, content, img_path,author, createdAt </br>
*댓글 수정 기능 추가하기 - comments* = [commenter , body, adopted, keyword, createdAt]

### (GET) 선택된 게시글 보기 (id = db id)
  : `/api/board/details/:id` <br/>
    ex) /api/board/details/0 <br/>

### (GET) 현재 로그인 되어있는 사용자가 작성한 게시글 보기
  : `/api/board/log/:user_code` <br/>
    ex) /api/board/details/hyeon <br/>

### (GET) 페이지당 5개의 게시글 받아오기
  : `/api/board/list/:page` <br/>


### (GET) 게시판 검색하기
  : `/api/board/search/:type` <br/>
  type = 0 (전체 검색) , type = 1 (author_name 검색), type = 2 (제목 검색) <br/>
  json {query : 질문내용}  <br/>

### (POST) 게시글 생성하기 (필요 데이터 : 제목, 내용, 사진)
  : `/api/board/` <br/>

### (POST) 게시글 생성시 사용자 요청 파일 path 설정 (id = db 고유 id, 게시글 생성될 때 반한되는 db id )
  : `/api/board/files/:id` <br/>

### (POST) 게시글 수정하기 (id = 게시글 db id)
  : `/api/board/edit/:id` <br/>
    ex)  <br/>

### (POST) 덧글 작성하기 (id = 게시글 db id)
  : `/api/board/comments/:id` <br/>

### (POST) 덧글 수정하기
  : `/api/board/comments/:id/:comment` <br/>

### (DELETE) 게시글 삭제하기
  : `/api/board/delete/:id` <br/>

### (DELETE) 덧글 삭제하기
  : `/api/board/delete/:id/:comment` <br/>
    ex)  <br/>

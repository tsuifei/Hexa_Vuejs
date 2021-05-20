// Doms

const userNameInput = document.querySelector("#username");
const passWordInput = document.querySelector("#password");
const loginBtn = document.querySelector("#login");

loginBtn.addEventListener("click", login);
const url = 'https://vue3-course-api.hexschool.io/';
const path = 'moitw'; // 暫不需要

function login(e) {
  // console.log("點到了");


  const user = {
    "username": userNameInput.value,
    "password": passWordInput.value
  }
  axios.post(`${url}admin/signin`, user)
    .then((response) => {
      if (response.data.message) {
        alert(response.data.message);
        // 把token 和 expired 從response.data 取出
        const {
          token,
          expired
        } = response.data;
        // 寫入 cookie token 和 expired 效期
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        console.log(document.cookie);
        // 去產品頁
        window.location = "productList.html";

      } else {
        alert(response.data.message);
      }
    })
    .catch(error => {
      console.log(error);
    })
}

function checkLogin() {
  // #3 取得token (只需一次)
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  // console.log(token);
  axios.defaults.headers.common['Authorization'] = token;

  // #4 確認是否登入 POST
  axios.post(`${url}api/user/check`) // 請求
    .then((response) => {
      // console.log(response, "已登入");
      this.getProducts();
    })
    .catch(error => {
      console.log(error);
      alert("您未登入，請先登入！")
      window.location = "index.html";
    })
};
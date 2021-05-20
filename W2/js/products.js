const productListDom = document.querySelector("#productList");
const productCountDom = document.querySelector("#productCount");

const app = {
  products: [],
  apiInfo: {
    url: `https://vue3-course-api.hexschool.io/`,
    path: `moitw`,
  },
  getProducts() { // 取產品資料
    const url = `${this.apiInfo.url}api/${this.apiInfo.path}/products`;
    axios.get(url)
      .then((response) => {
        if (response.data.success) {
          this.products = response.data.products;
          this.render();
        } else {
          alert("請重新登入")
          window.location = "index.html";
        }
      })
  },
  render() { // 渲染
    this.getProducts();
    let str = "";
    this.products.forEach((item) => {
      str += `<tr>
      <td>${item.title}</td>
      <td width="120">${item.origin_price}</td>
      <td width="120">${item.price}</td>
      <td width="100">
        <span class="${item.is_enabled ? "text-success" : "text-secondary"}">${item.is_enabled ? "啟用" : "未啟用"}</span>
      </td>
      <td width="120">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger move deleteBtn"
          data-action="remove"
          data-id="${item.id}"
        >
          刪除
        </button>
      </td>
    </tr>`
    })
    productListDom.innerHTML = str;
    productCountDom.innerHTML = this.products.length;

    const deleteBtn = document.querySelectorAll(".deleteBtn")
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", this.deleteProduct.bind(this))
    })
  },
  deleteProduct(e) {
    const id = e.target.dataset.id;
    const url = `${this.apiInfo.url}api/${this.apiInfo.path}/admin/product/${id}`;

    axios.delete(url).then((response) => {
        alert(response.data.message);
        this.render();
      })
      .catch((error) => {
        console.log(error, response.data.message);
      })
  },
  created() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    this.render()
  },
}
app.created();
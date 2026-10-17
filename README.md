# ⚡ KeyGen 32 - Trình Tạo Key 32 Ký Tự Theo Tên

Website tạo 1 key 32 ký tự theo tên với giao diện Hologram Cyberpunk, hiệu ứng giải mã sinh động (scramble animation), pháo hoa, quầng sáng động tương tác chuột và âm thanh công nghệ.

Chuẩn 100% thuật toán Python trong `genkey.py`:
- `prefix`: Tên hoặc tiền tố bạn nhập vào.
- `suffix`: Ký tự ngẫu nhiên từ `a-z` và `0-9`.
- Tổng độ dài cố định luôn là **32 ký tự**.

---

## 🚀 Cách đưa lên GitHub và chạy Online miễn phí (GitHub Pages)

### Cách 1: Tải trực tiếp bằng trình duyệt trên GitHub.com (Dễ nhất - Không cần gõ lệnh)
1. Đăng nhập vào [GitHub.com](https://github.com).
2. Bấm vào dấu **`+`** ở góc trên bên phải -> Chọn **New repository**.
3. Đặt tên kho lưu trữ (ví dụ: `genkey-32`), chọn **Public** -> Bấm **Create repository**.
4. Ở trang mới hiện ra, bấm vào dòng chữ xanh **"uploading an existing file"**.
5. Kéo toàn bộ các file trong thư mục `genkey-web` này vào trình duyệt:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
6. Bấm nút **Commit changes**.
7. Bật link website miễn phí:
   - Vào mục **Settings** của repository -> Chọn **Pages** (ở cột bên trái).
   - Tại mục **Build and deployment** -> Chọn **Branch: `main`** (hoặc `master`) -> Bấm **Save**.
   - Chờ 1-2 phút, GitHub sẽ cấp cho bạn một đường link website chạy trực tiếp dạng:  
     👉 `https://<tên-tài-khoản-github>.github.io/genkey-32/`

---

### Cách 2: Dùng lệnh Git trên máy tính
Mở PowerShell hoặc Command Prompt tại thư mục này và gõ:

```bash
git init
git add .
git commit -m "Initial commit - KeyGen 32"
git branch -M main
git remote add origin https://github.com/<tên-tài-khoản-github>/<tên-repo>.git
git push -u origin main
```
Sau đó vào **Settings** -> **Pages** trên GitHub chọn branch `main` để kích hoạt link web.

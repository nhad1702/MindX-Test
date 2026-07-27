# NoteCode

Ứng dụng MERN giúp tạo, lưu và chia sẻ snippet qua một liên kết riêng. MVP không thực thi code người dùng; nội dung được lưu và hiển thị dưới dạng văn bản.

## Kiến trúc

- `Frontend`: React + Vite, giao diện responsive và quản lý trạng thái bản nháp.
- `Backend`: Express theo lớp route → controller → service → model.
- `MongoDB`: lưu `shareId`, code, ngôn ngữ, theme và timestamps.

## Chạy local

1. Tạo `Backend/.env` từ `Backend/.env.example` và cập nhật `MONGODB_URI`.
2. Trong `Backend`, chạy `npm install` rồi `npm run dev`.
3. Trong terminal khác, vào `Frontend`, chạy `npm install` rồi `npm run dev`.
4. Mở `http://localhost:5173`.

Vite chuyển tiếp `/api` đến backend tại `http://localhost:3001`.

## API

- `GET /api/health`
- `POST /api/snippets`
- `GET /api/snippets/:shareId`

## Biến môi trường production

Backend:

```env
MONGODB_URI=
CLIENT_URL=https://your-frontend.example
PORT=3001
NODE_ENV=production
```

Frontend:

```env
VITE_API_URL=https://your-api.example/api
```

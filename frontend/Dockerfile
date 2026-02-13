# Node.js 20 をベースイメージとして使用
FROM node:20-alpine AS development

# 作業ディレクトリを設定
WORKDIR /app

# package.json をコピー
COPY package.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# ビルドステージ（本番用）
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# 本番ステージ（nginx）
FROM nginx:alpine AS production

# ビルド成果物をnginxにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# カスタムnginx設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
